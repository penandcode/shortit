const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    alias: { type: String, required: true },
    timestamp: { type: String, required: true },
    userAgent: { type: String, required: true },
    ipAddress: { type: String, required: true },
    geolocation: {
        city: { type: String },
        region: { type: String },
        country: { type: String },
        loc: { type: String },
    },
    osName: { type: String },
    osVersion: { type: String },
    getDevice: { type: String }
});

const Analytics = mongoose.model('Analytics', analyticsSchema);

module.exports = Analytics;
