require('dotenv').config();
const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const InputError = require('../errors/inputerrors'); 

const server = Hapi.server({
    port: 8000,
    host: process.env.HOST || '0.0.0.0', 
    routes: {
        cors: {
            origin: ['*'], 
        },
    },
});

 
server.ext('onPreResponse', (request, h) => {
    const response = request.response;

    if (response.isBoom) {
        const { output } = response;

        if (output.statusCode === 413) {
            return h.response({
                status: 'fail',
                message: 'Payload content length greater than maximum allowed: 1000000',
            }).code(413);
        }

        if (response instanceof InputError) {
            const newResponse = h.response({
                status: 'fail',
                message: `${response.message}`
            });
            newResponse.code(response.statusCode);
            return newResponse;
        }

        if (output.statusCode === 400) {
            return h.response({
                status: 'fail',
                message: 'Bad Request: Invalid input or missing parameters',
            }).code(400);
        }
    }

    return h.continue;
});

const init = async () => {
    server.route(routes);
    await server.start();
    console.log(`Server running on ${server.info.uri}`);
};

// process.on('unhandledRejection', (err) => {
//     console.error('Unhandled Rejection:', err);
//     process.exit(1);
// });

init();
