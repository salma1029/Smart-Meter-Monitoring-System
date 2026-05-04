const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');
const fs = require('fs');

// ==========================================
// 1. YOUR FIREBASE CONFIGURATION HERE
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyDs7m1x0Thkg9xah2mHGrpSaovNq2n7CLE",
    authDomain: "smart-meter-3c44b.firebaseapp.com",
    projectId: "smart-meter-3c44b",
    storageBucket: "smart-meter-3c44b.firebasestorage.app",
    messagingSenderId: "431202806532",
    appId: "1:431202806532:web:45a1081b3c566564c4fe51",
    measurementId: "G-JYT5E4XYMD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ==========================================
// 2. HELPER TO PARSE CSV
// ==========================================
function parseCSV(filePath, delimiter = ',', limit = 50) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].trim().split(delimiter);
    const data = [];

    // Limit the number of lines we process
    const maxLines = Math.min(lines.length, limit + 1);

    for (let i = 1; i < maxLines; i++) {
        const row = lines[i].trim().split(delimiter);
        if (row.length === headers.length) {
            const obj = {};
            headers.forEach((header, index) => {
                let value = row[index].trim();
                // Try converting numbers
                if (!isNaN(value) && value !== '') {
                    value = Number(value);
                }
                obj[header] = value;
            });
            data.push(obj);
        }
    }
    return data;
}

// ==========================================
// 3. UPLOAD FUNCTIONS
// ==========================================
async function uploadAnomalyData() {
    console.log("Uploading Anomaly Dataset Sample...");
    // Path to your anom/anom/train.csv
    const csvPath = '../anom/anom/train.csv'; 
    if (!fs.existsSync(csvPath)) {
        console.log(`File not found: ${csvPath}`);
        return;
    }

    const records = parseCSV(csvPath, ',', 50); // Get 50 records
    const colRef = collection(db, 'data_anomaly');

    for (const record of records) {
        try {
            await addDoc(colRef, record);
        } catch (e) {
            console.error("Error adding anomaly document: ", e);
        }
    }
    console.log(`Successfully uploaded ${records.length} anomaly records.`);
}

async function uploadForecastData() {
    console.log("Uploading Forecast Dataset Sample...");
    // Path to your last_forcast/last_forcast/D202.csv
    const csvPath = '../last_forcast/last_forcast/D202.csv'; 
    if (!fs.existsSync(csvPath)) {
        console.log(`File not found: ${csvPath}`);
        return;
    }

    const records = parseCSV(csvPath, ',', 50); // Get 50 records
    const colRef = collection(db, 'data_forecast');

    for (const record of records) {
        try {
            await addDoc(colRef, record);
        } catch (e) {
            console.error("Error adding forecast document: ", e);
        }
    }
    console.log(`Successfully uploaded ${records.length} forecast records.`);
}

// Run the uploads
async function run() {
    await uploadAnomalyData();
    await uploadForecastData();
    console.log("Finished uploading samples! Press Ctrl+C to exit.");
}

run();
