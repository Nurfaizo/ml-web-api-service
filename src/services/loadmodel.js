// src/services/loadmodel.js
const tf = require('@tensorflow/tfjs-node');
const path = require('path');

async function loadModel() {
    try {
        // Load the model from a local path
        const modelPath = path.join(__dirname, '../../models/model.json');
        return await tf.loadGraphModel(`file://${modelPath}`);
    } catch (error) {
        console.error('Error loading the model:', error);
        throw new Error('Failed to load the model');
    }
}

module.exports = { loadModel };
