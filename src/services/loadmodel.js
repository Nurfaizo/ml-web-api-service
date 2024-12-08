const tf = require('@tensorflow/tfjs-node');
const { Storage } = require('@google-cloud/storage');
const path = require('path');

async function loadModel() {
    try {

        const storage = new Storage({
            keyFilename: path.join(__dirname, '../../submissionmlgc-nurfaiz-cfd2d511e676.json'), 
        });

        const bucketName = 'ml-web-storage-model'; 
        const modelJsonFile = 'models/model.json'; 
        const [modelJsonUrl] = await storage
            .bucket(bucketName)
            .file(modelJsonFile)
            .getSignedUrl({
                action: 'read',
                expires: Date.now() + 15 * 60 * 1000, 
            });

        console.log(`Generated signed URL for model.json: ${modelJsonUrl}`);

        const model = await tf.loadGraphModel(modelJsonUrl);
        console.log('Model successfully loaded from GCS');
        return model;
    } catch (error) {
        console.error('Error loading the model from GCS:', error);
        throw new Error('Failed to load the model from GCS');
    }
}

module.exports = { loadModel };
