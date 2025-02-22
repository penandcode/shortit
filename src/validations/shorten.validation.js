const Joi = require("joi");


const shorten = {
    body: Joi.object().keys({
        url: Joi.string().required(),
        customAlias: Joi.string(),
        topic: Joi.string(),
    }),
};

module.exports = {
    shorten
};
