const jwt = require("jsonwebtoken");
const { default: status } = require("http-status");
const ApiError = require("../utils/ApiError");
const config = require("../config/config");

function auth(req, res, next) {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
        return next(new ApiError(status.UNAUTHORIZED, "Unauthorized"));
    }

    jwt.verify(token, config.jwt.secret, (err, decoded) => {
        if (err) {
            return next(new ApiError(status.UNAUTHORIZED, "Unauthorized"));
        }
        req.user = decoded;
        next();
    });
}

module.exports = auth;
