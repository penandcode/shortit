const swaggerJsDoc = require("swagger-jsdoc");
const path = require("path");
const { backendUrl } = require("../config/config");

const options = {
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Enter your bearer token in the format **Bearer <token>**',
            },
        },
    },

    definition: {
        openapi: "3.0.0",
        info: {
            title: "Shortit",
            version: "1.0.0",
            description: "API documentation for Shortit URL shortener service",
        },
        servers: [
            {
                url: `${backendUrl}`,
            },
        ],
    },
    apis: [path.join(__dirname, "../routes/*.js")],
};

const swaggerSpecs = swaggerJsDoc(options);
module.exports = swaggerSpecs;
