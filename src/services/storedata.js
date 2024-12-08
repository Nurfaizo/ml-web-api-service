const { Firestore } = require('@google-cloud/firestore');


const db = new Firestore();

async function storeData(id, data) {
    try {
        const predictCollection = db.collection('predictions');
        await predictCollection.doc(id).set(data); 
        return { id, ...data };
    } catch (error) {
        console.error('Error storing data in Firestore:', error);
        throw new Error('Failed to store data');
    }
}


async function getAllData() {
    try {
        const predictCollection = db.collection('predictions');
        const snapshot = await predictCollection.get(); 
        if (snapshot.empty) {
            console.log('No predictions found.');
            return []; 
        }
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); 
    } catch (error) {
        console.error('Error fetching data from Firestore:', error);
        throw new Error('Failed to fetch data');
    }
}


module.exports = { storeData, getAllData };
