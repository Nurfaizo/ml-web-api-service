const { loadModel } = require('./loadmodel');
const tf = require('@tensorflow/tfjs-node');

const classifyImage = async (imageBuffer) => {
    try {
        if (!Buffer.isBuffer(imageBuffer) || imageBuffer.length === 0) {
            throw new Error('Invalid image data');
        }

        const model = await loadModel();
        const tensor = tf.node.decodeJpeg(imageBuffer)
            .resizeNearestNeighbor([224, 224])
            .toFloat()
            .expandDims();

        const prediction = model.predict(tensor);
        const result = await prediction.data(); 
        const confidenceScore = Math.max(...result) * 100;

        tensor.dispose(); 
        return confidenceScore;
    } catch (error) {
        console.error('Error during image classification:', error.message);
        throw new Error('Error during image classification');
    }
};

module.exports = { classifyImage };
