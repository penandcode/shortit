const shortenService = require("../services/shorten.service");
const ApiError = require("../utils/ApiError");
const { status } = require("http-status");
const catchAsync = require("../utils/catchAsync")
const analyticsService = require("../services/analytics.service");

const shorten = catchAsync(async (req, res) => {

    const url = req.body.url;
    const customAlias = req.body.customAlias;
    const topic = req.body.topic;
    const userId = req.user.id;
    const aliasExists = await shortenService.aliasExists(customAlias);
    if (aliasExists) {
        throw new ApiError(status.BAD_REQUEST, "Alias is already taken.");
    }
    const shorten = await shortenService.shorten(url, customAlias, topic, userId)
    return res.send(shorten).status(status.CREATED);
})

/**
 * Retrieves the original URL for a given alias and logs analytics
 * @param {Object} req - Express request object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.alias - The alias to look up
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} The original URL object
 */
const getUrl = catchAsync(async (req, res) => {

    const { alias } = req.params;
    if (!alias) {
        throw new ApiError(status.BAD_REQUEST, "Alias is required.");
    }
    analyticsService.addAnalytics(alias, req.get('User-Agent'), req.ip)
    return res.send(await shortenService.getUrl(alias));
})

module.exports = {
    shorten,
    getUrl
}
