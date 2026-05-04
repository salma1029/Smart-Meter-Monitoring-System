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
function parseCSV(filePath, delimiter = ',', limit = 500) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].trim().split(delimiter);
    const data = [];

    const maxLines = Math.min(lines.length, limit + 1);

    for (let i = 1; i < maxLines; i++) {
        const row = lines[i].trim().split(delimiter);
        if (row.length === headers.length) {
            const obj = {};
            headers.forEach((header, index) => {
                let value = row[index].trim();
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
async function uploadNilmData() {
    console.log("Uploading NILM Dataset Sample...");
    // Update this path to wherever you save nilm_sample_continuous.csv
    const csvPath = '../nilm_sample_continuous.csv'; 
    if (!fs.existsSync(csvPath)) {
        console.log(`File not found: ${csvPath}`);
        console.log("Please make sure you put nilm_sample_continuous.csv in the Smart-Meter-Monitoring-System folder.");
        return;
    }

    // We will upload 400 rows to simulate the required 20 seconds of 20Hz data for the model
    const records = parseCSV(csvPath, ',', 400); 
    const colRef = collection(db, 'data_nilm');

    for (const record of records) {
        try {
            await addDoc(colRef, record);
        } catch (e) {
            console.error("Error adding NILM document: ", e);
        }
    }
    console.log(`Successfully uploaded ${records.length} NILM records to Firebase.`);
}

// Run the uploads
async function run() {
    await uploadNilmData();
    console.log("Finished uploading NILM samples! Press Ctrl+C to exit.");
}

run();
