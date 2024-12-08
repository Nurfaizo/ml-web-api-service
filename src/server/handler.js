// src/server/handler.js
const { classifyImage } = require('../services/inferenceService');
const crypto = require('crypto');
const { storeData, getAllData } = require('../services/storeData');
const ClientError = require('../errors/clienterrors'); // Import custom error class

const postPredictHandler = async (request, h) => {
    const { image } = request.payload;

    try {
        if (!image) {
            throw new ClientError('No image data provided.');
        }

        if (!(Buffer.isBuffer(image) || (typeof image === 'string' && image.length > 0))) {
            throw new ClientError('Invalid image data provided.');
        }

        
        const confidenceScore = await classifyImage(image);
        const label = confidenceScore > 50 ? 'Cancer' : 'Non-cancer';
        const suggestion = label === 'Cancer' ? "Segera periksa ke dokter!" : "Penyakit kanker tidak terdeteksi.";

        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        const data = {
            id,
            result: label,
            suggestion,
            createdAt
        };

        await storeData(id, data);

        return h.response({
            status: 'success',
            message: 'Model is predicted successfully',
            data
        }).code(201);
    } 
    catch (error) {
        console.error('Error during prediction:', error);

        if (error instanceof ClientError) {
            return h.response({
                status: 'fail',
                message: error.message,
            }).code(error.statusCode || 400);
        }

        return h.response({
            status: 'fail',
            message: 'Terjadi kesalahan dalam melakukan prediksi'
        }).code(400);
    }
};

async function postPredictHistoriesHandler(request, h) {
    const allData = await getAllData();

    const formattedData = allData.map(data => ({
        id: data.id,
        history: {
            result: data.result,
            createdAt: data.createdAt,
            suggestion: data.suggestion,
            id: data.id
        }
    }));

    return h.response({
        status: 'success',
        data: formattedData
    }).code(200);
}

module.exports = { postPredictHandler, postPredictHistoriesHandler };
