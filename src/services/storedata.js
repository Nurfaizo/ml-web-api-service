
const admin = require('firebase-admin');


admin.initializeApp({
    credential: admin.credential.cert(require('../submissionmlgc-nurfaiz-firebase-adminsdk-vcht5-0716665f84.json')), 
    databaseURL: 'https://submissionmlgc-nurfaiz.firebaseio.com' 
});

const db = admin.firestore();
const collectionName = 'predictions'; 

async function storeData(id, data) {
    try {
        const docRef = db.collection(collectionName).doc(id); 
        await docRef.set(data); 
        return { id, ...data };
    } catch (error) {
        console.error('Error storing data in Firestore:', error);
        throw new Error('Failed to store data');
    }
}


async function getAllData() {
    try {
        const snapshot = await db.collection(collectionName).get(); 
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); 
        return data;
    } catch (error) {
        console.error('Error fetching data from Firestore:', error);
        throw new Error('Failed to fetch data');
    }
}

module.exports = { storeData, getAllData };
