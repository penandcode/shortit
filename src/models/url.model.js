const mongoose = require("mongoose");

const urlSchema = mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
            trim: true,
        },
        alias: {
            type: String,
            required: true,
            trim: true,
        },
        customAlias: {
            type: String,
            trim: true,
            default: null
        },
        topic: {
            type: String,
            trim: true,
            default: null
        },
        userId: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
    }
);

const URL = mongoose.model("URL", urlSchema);

module.exports = URL;
