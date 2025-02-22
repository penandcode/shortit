const Analytics = require("../models/analytics.model");
const axios = require("axios")
const UAParser = require('ua-parser-js');
const dayjs = require("dayjs");
const URL = require("../models/url.model");
const ApiError = require("../utils/ApiError");
const { default: status } = require("http-status");

const getGeolocation = async (ip) => {
    try {
        const response = await axios.get(`http://ipinfo.io/${ip}/json`);
        return response.data;
    } catch (error) {
        console.error('Error fetching geolocation:', error);
        return null;
    }
};


const addAnalytics = async (alias, userAgent, ipAddress) => {
    const geolocation = await getGeolocation(ipAddress);
    const timestamp = new Date().toISOString();
    const parser = new UAParser();
    parser.setUA(userAgent);
    const os = parser.getOS()

    const osName = os.name;
    const osVersion = os.version;
    const deviceType = parser.getDevice();
    const analyticsData = new Analytics({
        alias,
        timestamp,
        userAgent,
        ipAddress,
        geolocation,
        osName,
        osVersion,
        deviceType: deviceType || "Desktop"
    });
    await analyticsData.save();
    return analyticsData;

}

const getAnalytics = async (alias, userId) => {
    const totalClicks = await Analytics.countDocuments({ alias: alias, userId: userId });
    const uniqueUsers = await Analytics.distinct('ipAddress', { alias: alias, userId: userId }).length;

    const clicksByDate = await Analytics.aggregate([
        {
            $match: {
                alias: alias,
                userId: userId,
                timestamp: { $gte: dayjs().subtract(6, 'days').toDate() },
            },
        },
        {
            $project: {
                day: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
            },
        },
        {
            $group: {
                _id: "$day",
                clickCount: { $sum: 1 },
            },
        },
        {
            $sort: { _id: 1 },
        },
    ]);


    const osType = await Analytics.aggregate([
        { $match: { alias: alias, userId: userId } },
        {
            $group: {
                _id: "$osName",
                uniqueClicks: { $sum: 1 },
                uniqueUsers: { $addToSet: "$ipAddress" },
            },
        },
        {
            $project: {
                osName: "$_id",
                uniqueClicks: 1,
                uniqueUsers: { $size: "$uniqueUsers" },
            },
        },
    ]);


    const deviceType = await Analytics.aggregate([
        { $match: { alias: alias, userId: userId } },
        {
            $group: {
                _id: "$deviceType",
                uniqueClicks: { $sum: 1 },
                uniqueUsers: { $addToSet: "$ipAddress" },
            },
        },
        {
            $project: {
                deviceName: "$_id",
                uniqueClicks: 1,
                uniqueUsers: { $size: "$uniqueUsers" },
            },
        },
    ]);

    return {
        totalClicks,
        uniqueUsers,
        clicksByDate,
        osType,
        deviceType,
    };
}

const getAnalyticsByTopic = async (topic, userId) => {
    const urlsInTopic = await URL.find({ topic, userId });

    if (urlsInTopic.length === 0) {
        throw new ApiError(status.NOT_FOUND, "No URLs found under this topic.")
    }

    const urlAliases = urlsInTopic.map(url => url.alias);


    const totalClicks = await Analytics.countDocuments({ userId, alias: { $in: urlAliases } });
    const uniqueUsers = await Analytics.distinct('ipAddress', { userId, alias: { $in: urlAliases } }).length;


    const clicksByDate = await Analytics.aggregate([
        {
            $match: {
                alias: { $in: urlAliases },
                userId,
                timestamp: {
                    $gte: dayjs().subtract(6, 'days').startOf('day').toDate(),
                    $lte: dayjs().endOf('day').toDate()
                },
            },
        },
        {
            $project: {
                day: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
            },
        },
        {
            $group: {
                _id: "$day",
                clickCount: { $sum: 1 },
            },
        },
        {
            $sort: { _id: 1 },
        },
    ]);


    const urls = await Promise.all(urlsInTopic.map(async (url) => {
        const totalClicksForUrl = await Analytics.countDocuments({ alias: url.alias });
        const uniqueUsersForUrl = await Analytics.distinct('ipAddress', { alias: url.alias }).length;

        return {
            alias: url.alias,
            totalClicks: totalClicksForUrl,
            uniqueUsers: uniqueUsersForUrl,
        };
    }));


    const response = {
        totalClicks,
        uniqueUsers,
        clicksByDate,
        urls,
    };

    return response;
}

const getAllAnalytics = async (userId) => {


    const userUrls = await URL.find({ userId });

    if (userUrls.length === 0) {
        throw new ApiError(status.NOT_FOUND, 'No URLs found for this user.')
    }

    const urlAliases = userUrls.map(url => url.alias);




    const totalClicks = await Analytics.countDocuments({ shortUrl: { $in: urlAliases } });


    const uniqueUsers = await Analytics.distinct('ipAddress', { shortUrl: { $in: urlAliases } }).length;


    const clicksByDate = await Analytics.aggregate([
        {
            $match: {
                shortUrl: { $in: urlAliases },
                timestamp: {
                    $gte: dayjs().subtract(6, 'days').startOf('day').toDate(),
                    $lte: dayjs().endOf('day').toDate()
                },
            },
        },
        {
            $project: {
                day: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
            },
        },
        {
            $group: {
                _id: "$day",
                clickCount: { $sum: 1 },
            },
        },
        {
            $sort: { _id: 1 },
        },
    ]);


    const osType = await Analytics.aggregate([
        { $match: { shortUrl: { $in: urlAliases } } },
        {
            $group: {
                _id: "$osName",
                uniqueClicks: { $sum: 1 },
                uniqueUsers: { $addToSet: "$ipAddress" },
            },
        },
        {
            $project: {
                osName: "$_id",
                uniqueClicks: 1,
                uniqueUsers: { $size: "$uniqueUsers" },
            },
        },
    ]);

    const deviceType = await Analytics.aggregate([
        { $match: { shortUrl: { $in: urlAliases } } },
        {
            $group: {
                _id: "$deviceType",
                uniqueClicks: { $sum: 1 },
                uniqueUsers: { $addToSet: "$ipAddress" },
            },
        },
        {
            $project: {
                deviceName: "$_id",
                uniqueClicks: 1,
                uniqueUsers: { $size: "$uniqueUsers" },
            },
        },
    ]);


    const response = {
        totalUrls: userUrls.length,
        totalClicks,
        uniqueUsers,
        clicksByDate,
        osType,
        deviceType,
    };


    return response;

}

module.exports = {
    addAnalytics,
    getAnalytics,
    getAnalyticsByTopic,
    getAllAnalytics
}