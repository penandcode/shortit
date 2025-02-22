const URL = require("../models/url.model");
const ApiError = require("../utils/ApiError");
const { status } = require('http-status');
const { createID } = require("../utils/createId")

/**
 * Checks if a given alias already exists in the database
 * @param {string} alias - The alias to check
 * @returns {Promise<boolean>} True if alias exists, false otherwise
 */
const aliasExists = async (alias) => {

    const aliasExists = await URL.findOne({ alias: alias });
    if (!aliasExists) {
        return false;
    }
    return true;
}


/**
 * Creates a new shortened URL entry in the database
 * @param {string} url - The original URL to be shortened
 * @param {string} [customAlias] - Optional custom alias for the URL
 * @param {string} [topic] - Optional topic/category for the URL
 * @param {string} userId - The ID of the user creating the shortened URL
 * @returns {Promise<Object>} The created URL document
 */
const shorten = async (url, customAlias, topic, userId) => {


    const urlExists = await URL.findOne({ url });
    if (urlExists) {
        return urlExists;
    }
    const alias = customAlias ? customAlias : await createID(8)
    return await URL.create({
        url,
        alias: alias,
        customAlias: customAlias || null,
        topic: topic || null,
        userId: userId
    });
};


/**
 * Retrieves the original URL associated with a given alias
 * @param {string} alias - The alias to look up
 * @returns {Promise<Object>} Object containing the original URL
 */
const getUrl = async (alias) => {

    const url = await URL.findOne({ alias: alias }).select("url");
    if (!url) {
        throw new ApiError("Alias not found");
    }
    return { url: url.url };


}

module.exports = {
    aliasExists, shorten, getUrl
}
