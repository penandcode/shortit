const dotenv = require('dotenv');

dotenv.config();

const url = process.env.MONGODB_URL;



module.exports = {
    port: process.env.port,
    env: process.env.NODE_ENV,
    backendUrl: process.env.BACKEND_URL,
    mongoose: {
        url: url
    },
    google: {
        clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
        clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET
    },
    jwt: {
        secret: process.env.JWT_SECRET
    }
}
