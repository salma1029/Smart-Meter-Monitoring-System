import pandas as pd
import requests
import json

def test_api():
    print("Reading CSV...")
    df = pd.read_csv("nilm_sample_continuous.csv")
    
    # Take first 400 rows
    df = df.head(400)
    
    # Format sequence
    sequence = df[['Voltage_V', 'Current_A', 'Active_Power_W', 'Reactive_Power_VAR']].values.tolist()
    
    url = "https://habebamostafa-smart-meter-api.hf.space/predict/nilm"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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"
    }
    
    print(f"Sending sequence of shape ({len(sequence)}, 4) to {url}...")
    try:
        response = requests.post(url, headers=headers, json={"sequence": sequence})
        if response.status_code == 200:
            print("\nAPI Response:")
            print(json.dumps(response.json(), indent=2))
        else:
            print(f"\nError {response.status_code}: {response.text}")
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    test_api()
