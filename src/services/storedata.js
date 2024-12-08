// src/services/storeData.js
let predictions = [];

async function storeData(id, data) {
    predictions.push({ id, ...data });
    return { id, ...data };
}

async function getAllData() {
    return predictions;
}

module.exports = { storeData, getAllData };
