const catchAsync = require("../utils/catchAsync");
const analyticsService = require("../services/analytics.service");
const ApiError = require("../utils/ApiError");
const { default: status } = require("http-status");

const getAnalytics = catchAsync(async (req, res) => {
    const { alias } = req.params;
    const userId = req.user._id;
    if (!alias) {
        throw new ApiError(status.NOT_ACCEPTABLE, "Alias is required");
    }
    return res.send(await analyticsService.getAnalytics(alias, userId));

})

const getAnalyticsByTopic = catchAsync(async (req, res) => {
    const { topic } = req.params;
    const userId = req.user._id;
    return res.send(await analyticsService.getAnalyticsByTopic(topic, userId));

})

const getAllAnalytics = catchAsync(async (req, res) => {
    const userId = req.user.id;
    return res.send(await analyticsService.getAllAnalytics(userId));

})

module.exports = {
    getAnalytics,
    getAnalyticsByTopic,
    getAllAnalytics
}