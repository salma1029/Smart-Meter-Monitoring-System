const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } = require('firebase/firestore');
const fs = require('fs');

const firebaseConfig = {
    apiKey: "AIzaSyDs7m1x0Thkg9xah2mHGrpSaovNq2n7CLE",
    authDomain: "smart-meter-3c44b.firebaseapp.com",
    projectId: "smart-meter-3c44b",
    storageBucket: "smart-meter-3c44b.firebasestorage.app",
    messagingSenderId: "431202806532",
    appId: "1:431202806532:web:45a1081b3c566564c4fe51",
    measurementId: "G-JYT5E4XYMD"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function parseCSV(filePath, delimiter = ',', limit = 400) {
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
            // We inject an exact numerical order index so we can sort it perfectly in the mobile app
            obj.orderIndex = i; 
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

async function clearAndUpload() {
    const colRef = collection(db, 'data_nilm');

    console.log("1. Deleting old jumbled data from Firebase...");
    const snapshot = await getDocs(colRef);
    let deletedCount = 0;
    for (const document of snapshot.docs) {
        await deleteDoc(doc(db, 'data_nilm', document.id));
        deletedCount++;
    }
    console.log(`Deleted ${deletedCount} old records.`);

    console.log("2. Uploading fresh continuous 20-second wave...");
    const csvPath = '../nilm_sample_continuous.csv'; 
    if (!fs.existsSync(csvPath)) {
        console.log(`File not found: ${csvPath}`);
        return;
    }

    const records = parseCSV(csvPath, ',', 400); 
    for (const record of records) {
        await addDoc(colRef, record);
    }
    console.log(`Successfully uploaded ${records.length} perfectly ordered records!`);
}

clearAndUpload().then(() => {
    console.log("Done! You can press Ctrl+C to exit.");
}).catch(console.error);
