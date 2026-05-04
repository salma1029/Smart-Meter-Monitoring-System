import os
os.environ["KERAS_BACKEND"] = "torch"

import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
import pandas as pd
import keras
import joblib
from datetime import datetime
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
import uvicorn
from tensorflow.keras.models import load_model, Model

app = FastAPI(title="Smart Meter ML API")

# ==========================================
# 1. PYTORCH HYBRID MODEL ARCHITECTURE
# ==========================================

class HardSwish(nn.Module):
    def forward(self, x): return x * F.relu6(x + 3.0) / 6.0

class SqueezeExcitation(nn.Module):
    def __init__(self, in_channels, reduction=4):
        super().__init__()
        self.pool = nn.AdaptiveAvgPool1d(1)
        self.fc = nn.Sequential(
            nn.Linear(in_channels, max(in_channels // reduction, 8)),
            nn.ReLU(inplace=True),
            nn.Linear(max(in_channels // reduction, 8), in_channels),
            nn.Hardsigmoid()
        )
    def forward(self, x):
        b, c, _ = x.size()
        y = self.pool(x).view(b, c)
        y = self.fc(y).view(b, c, 1)
        return x * y

class InvertedResidual(nn.Module):
    def __init__(self, in_ch, out_ch, kernel_size, stride, expand_ratio, use_se=True, use_hs=True):
        super().__init__()
        hidden_dim = int(round(in_ch * expand_ratio))
        self.use_residual = stride == 1 and in_ch == out_ch
        layers_list = []
        if expand_ratio != 1:
            layers_list.extend([nn.Conv1d(in_ch, hidden_dim, 1, bias=False), nn.BatchNorm1d(hidden_dim), HardSwish() if use_hs else nn.ReLU(inplace=True)])
        layers_list.extend([nn.Conv1d(hidden_dim, hidden_dim, kernel_size, stride, padding=kernel_size//2, groups=hidden_dim, bias=False), nn.BatchNorm1d(hidden_dim), HardSwish() if use_hs else nn.ReLU(inplace=True)])
        if use_se: layers_list.append(SqueezeExcitation(hidden_dim))
        layers_list.extend([nn.Conv1d(hidden_dim, out_ch, 1, bias=False), nn.BatchNorm1d(out_ch)])
        self.conv = nn.Sequential(*layers_list)
    def forward(self, x): return x + self.conv(x) if self.use_residual else self.conv(x)

class MobileNetV3Encoder(nn.Module):
    def __init__(self, input_channels=4):
        super().__init__()
        self.stem = nn.Sequential(nn.Conv1d(input_channels, 16, 3, stride=2, padding=1, bias=False), nn.BatchNorm1d(16), HardSwish())
        configs = [[16, 16, 3, 1, 1, False, False], [16, 24, 3, 2, 4, False, False], [24, 24, 3, 1, 3, False, False], [24, 40, 5, 2, 3, True, False], [40, 40, 5, 1, 3, True, False], [40, 80, 3, 2, 6, False, True], [80, 80, 3, 1, 2.5, False, True], [80, 112, 3, 1, 6, True, True], [112, 160, 5, 1, 6, True, True]]
        layers_list = [InvertedResidual(*c) for c in configs]
        self.blocks = nn.Sequential(*layers_list)
        self.conv_head = nn.Sequential(nn.Conv1d(160, 960, 1, bias=False), nn.BatchNorm1d(960), HardSwish())
        self.pool = nn.AdaptiveAvgPool1d(1)
    def forward(self, x):
        x = self.stem(x)
        x = self.blocks(x)
        return self.pool(self.conv_head(x)).flatten(1)

class VAEEncoder(nn.Module):
    def __init__(self, input_dim=4000, hidden_dim=256, latent_dim=128):
        super().__init__()
        self.encoder = nn.Sequential(nn.Linear(input_dim, hidden_dim), nn.BatchNorm1d(hidden_dim), nn.ReLU(), nn.Dropout(0.2), nn.Linear(hidden_dim, hidden_dim // 2), nn.BatchNorm1d(hidden_dim // 2), nn.ReLU())
        self.fc_mu = nn.Linear(hidden_dim // 2, latent_dim)
        self.fc_logvar = nn.Linear(hidden_dim // 2, latent_dim)
    def forward(self, x):
        h = self.encoder(x)
        return self.fc_mu(h), self.fc_logvar(h)

class VAEDecoder(nn.Module):
    def __init__(self, latent_dim=128, hidden_dim=256, output_dim=4000):
        super().__init__()
        self.decoder = nn.Sequential(nn.Linear(latent_dim, hidden_dim // 2), nn.BatchNorm1d(hidden_dim // 2), nn.ReLU(), nn.Dropout(0.2), nn.Linear(hidden_dim // 2, hidden_dim), nn.BatchNorm1d(hidden_dim), nn.ReLU(), nn.Linear(hidden_dim, output_dim))
    def forward(self, z): return self.decoder(z)

class HybridNILM(nn.Module):
    def __init__(self, input_channels=4, n_appliances=9, embedding_dim=128, vae_latent_dim=64, use_vae=True, window_size=1000):
        super().__init__()
        self.mobilenet = MobileNetV3Encoder(input_channels)
        self.classifier = nn.Sequential(nn.Linear(960, embedding_dim), nn.BatchNorm1d(embedding_dim), HardSwish(), nn.Dropout(0.3), nn.Linear(embedding_dim, n_appliances))
        self.use_vae = use_vae
        if use_vae:
            input_dim = input_channels * window_size
            self.vae_encoder = VAEEncoder(input_dim=input_dim, hidden_dim=256, latent_dim=vae_latent_dim)
            self.vae_decoder = VAEDecoder(latent_dim=vae_latent_dim, hidden_dim=256, output_dim=input_dim)
    def forward(self, x):
        features = self.mobilenet(x)
        logits = self.classifier(features)
        if not self.use_vae: return logits
        x_flat = x.view(x.size(0), -1)
        mu, logvar = self.vae_encoder(x_flat)
        return logits, mu, logvar

# ==========================================
# 2. NILM ENGINE 
# ==========================================
class NILMEngine:
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.appliance_names = [
            'CoffeeMachine', 'Freezer', 'Fridge-Freezer', 'HairDryer-Straightener',
            'HandMixer', 'Kettle', 'MacBook2007', 'MacBookPro2011-1',
            'MacBookPro2011-2', 'Stove-Oven', 'TV-LG', 'TV-Philips', 
            'TV-Sharp', 'Toaster', 'VaccumCleaner'
        ]
        self.keras_model = None
        self.pytorch_model = None
        self.scaler = None

    def load(self):
        # 1. Load NILM Keras Model
        @keras.saving.register_keras_serializable()
        def weighted_binary_crossentropy(y_true, y_pred):
            return keras.losses.binary_crossentropy(y_true, y_pred)
            
        try:
            self.keras_model = keras.models.load_model('final_advanced_model.keras', custom_objects={'weighted_binary_crossentropy': weighted_binary_crossentropy})
            print("NILM Keras model loaded.")
        except Exception as e:
            print(f"Error loading NILM Keras: {e}")

        # 2. Load NILM Scaler
        try:
            self.scaler = joblib.load('advanced_scaler.pkl')
            print("NILM Scaler loaded.")
        except Exception as e:
            print(f"Error loading NILM Scaler: {e}")

        # 3. Load PyTorch Model
        try:
            self.pytorch_model = HybridNILM(n_appliances=len(self.appliance_names), embedding_dim=256, vae_latent_dim=128).to(self.device)
            import torch.serialization
            try: torch.serialization.add_safe_globals([np.float64, np.ndarray, np.core.multiarray.scalar])
            except: pass
            
            checkpoint = torch.load('best_hybrid_model.pth', map_location=self.device, weights_only=False)
            state_dict = checkpoint['model_state_dict'] if isinstance(checkpoint, dict) and 'model_state_dict' in checkpoint else checkpoint
            self.pytorch_model.load_state_dict(state_dict)
            self.pytorch_model.eval()
            print("NILM PyTorch model loaded.")
        except Exception as e:
            print(f"Error loading NILM PyTorch: {e}")

    def engineer_features(self, df):
        dt = datetime.now()
        df['hour_sin'] = np.sin(2 * np.pi * dt.hour / 24)
        df['hour_cos'] = np.cos(2 * np.pi * dt.hour / 24)
        df['dow_sin'] = np.sin(2 * np.pi * dt.weekday() / 7)
        df['dow_cos'] = np.cos(2 * np.pi * dt.weekday() / 7)
        
        df['apparent_power'] = np.sqrt(df['Active_Power_W']**2 + df['Reactive_Power_VAR']**2)
        df['power_factor'] = df['Active_Power_W'] / (df['apparent_power'] + 1e-6)
        df['reactive_ratio'] = df['Reactive_Power_VAR'] / (df['Active_Power_W'] + 1e-6)
        
        df['power_mean_20'] = df['Active_Power_W'].rolling(window=20, min_periods=1).mean()
        df['power_std_20'] = df['Active_Power_W'].rolling(window=20, min_periods=1).std().fillna(0)
        
        # Ensure cols_needed is a list
        if hasattr(self.scaler, 'feature_names_in_'):
            cols_needed = list(self.scaler.feature_names_in_)
        else:
            cols_needed = ['Active_Power_W', 'Reactive_Power_VAR', 'Voltage_V', 'Current_A', 'hour_sin', 'hour_cos', 'dow_sin', 'dow_cos', 'apparent_power', 'power_factor', 'reactive_ratio', 'power_mean_20', 'power_std_20']
            
        while len(cols_needed) < 40:
            cols_needed.append(f'pad_{len(cols_needed)}')
        for col in cols_needed:
            if col not in df.columns: df[col] = 0
                
        return df[cols_needed].values

    def predict(self, df_20hz):
        if self.keras_model is None or self.pytorch_model is None or self.scaler is None:
            raise Exception("NILM Models are not fully loaded.")

        # Ensure we have exactly 400 rows for Keras
        if len(df_20hz) != 400:
            indices = np.linspace(0, len(df_20hz) - 1, 400)
            df_20hz_fixed = pd.DataFrame({col: np.interp(indices, np.arange(len(df_20hz)), df_20hz[col]) for col in df_20hz.columns})
        else:
            df_20hz_fixed = df_20hz.copy()

        # Keras Inference
        features = self.engineer_features(df_20hz_fixed)
        features_scaled = self.scaler.transform(features)
        input_keras = features_scaled.reshape(1, 400, 40)
        pred_keras = self.keras_model.predict(input_keras, verbose=0)[0]

        # PyTorch Inference (requires 1000 rows)
        indices = np.linspace(0, len(df_20hz) - 1, 1000)
        df_50hz = pd.DataFrame({col: np.interp(indices, np.arange(len(df_20hz)), df_20hz[col]) for col in df_20hz.columns})
        
        signals = df_50hz[['Voltage_V', 'Current_A', 'Active_Power_W', 'Reactive_Power_VAR']].values.T
        signals_norm = np.zeros_like(signals)
        for ch in range(4):
            q25, q75 = np.percentile(signals[ch], [25, 75])
            iqr = q75 - q25
            signals_norm[ch] = (signals[ch] - np.median(signals[ch])) / iqr if iqr > 1e-6 else signals[ch] - np.median(signals[ch])
            
        input_pt = torch.FloatTensor(signals_norm).unsqueeze(0).to(self.device)
        with torch.no_grad():
            outputs = self.pytorch_model(input_pt)
            logits = outputs[0] if self.pytorch_model.use_vae else outputs
            pred_pt = torch.sigmoid(logits).cpu().numpy()[0]

        # Ensemble
        # Note: Keras model was trained on 5 appliances, PyTorch on 15.
        # We will use the PyTorch predictions for the full 15-device classification.
        combined_pred = pred_pt
        
        # Lowering threshold from 0.5 to 0.1 to make the model more sensitive to the signal
        stable_predictions = (combined_pred > 0.1).astype(int)
        
        # DEBUG LOGGING for the user to see in HF logs
        print(f"DEBUG: Max NILM probability: {np.max(combined_pred):.4f}")
        
        return {name: int(stable_predictions[i]) for i, name in enumerate(self.appliance_names)}

nilm_engine = NILMEngine()

# ==========================================
# 3. GLOBAL MODELS (ANOMALY & FORECAST)
# ==========================================
encoder = None
iso_forest = None
anomaly_scaler = None
forecast_model = None

ANOMALY_FEATURES = [
    'meter_reading', 'hour', 'day', 'day_of_week', 'day_of_year',
    'week_of_year', 'month', 'is_weekend', 'usage_change',
    'rolling_mean_3', 'rolling_std_3', 'usage_diff_3h'
]

@app.on_event("startup")
def load_all_models():
    global encoder, iso_forest, anomaly_scaler, forecast_model
    print("Initializing server and loading models...")
    
    # 1. Load NILM Models
    nilm_engine.load()

    # 2. Load Anomaly Models
    if os.path.exists("ae_model.h5") and os.path.exists("iso.pkl") and os.path.exists("scaler.pkl"):
        try:
            ae_model = load_model("ae_model.h5", compile=False)
            encoder = Model(inputs=ae_model.input, outputs=ae_model.layers[3].output)
            iso_forest = joblib.load("iso.pkl")
            anomaly_scaler = joblib.load("scaler.pkl")
            print("Anomaly models loaded.")
        except Exception as e: print(f"Error anomaly models: {e}")

    # 3. Load Forecast Model
    if os.path.exists("initial_model.keras"):
        try:
            forecast_model = load_model("initial_model.keras", compile=False)
            print("Forecast model loaded.")
        except Exception as e: print(f"Error forecast model: {e}")

# ==========================================
# 4. FASTAPI ENDPOINTS
# ==========================================

class AnomalyInput(BaseModel):
    data: List[Dict[str, float]]

@app.post("/predict/anomaly")
def predict_anomaly(payload: AnomalyInput):
    if encoder is None or iso_forest is None or anomaly_scaler is None:
        raise HTTPException(status_code=500, detail="Anomaly models not loaded.")
    df = pd.DataFrame(payload.data)
    X_scaled = anomaly_scaler.transform(df[ANOMALY_FEATURES])
    Z = encoder.predict(X_scaled, verbose=0)
    anomalies = (iso_forest.predict(Z) == -1).astype(int).tolist()
    return {"predictions": anomalies}

class ForecastInput(BaseModel):
    sequence: List[List[float]]

@app.post("/predict/forecast")
def predict_forecast(payload: ForecastInput):
    if forecast_model is None:
        raise HTTPException(status_code=500, detail="Forecast model not loaded.")
    input_data = np.array(payload.sequence)
    if len(input_data.shape) == 2: input_data = np.expand_dims(input_data, axis=0)
    pred = forecast_model.predict(input_data, verbose=0)
    return {"forecast": pred.tolist()[0]}

class NILMInput(BaseModel):
    sequence: List[List[float]] # [Voltage_V, Current_A, Active_Power_W, Reactive_Power_VAR]

import traceback

@app.post("/predict/nilm")
def predict_nilm(payload: NILMInput):
    try:
        df = pd.DataFrame(payload.sequence, columns=['Voltage_V', 'Current_A', 'Active_Power_W', 'Reactive_Power_VAR'])
        predictions = nilm_engine.predict(df)
        return {"predictions": predictions}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"status": "Smart Meter ML API is running!"}

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=7860)
