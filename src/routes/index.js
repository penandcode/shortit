const express = require("express");
const router = express.Router();
const shortenRoute = require("./shorten.route");
const analyticsRoute = require("./analytics.route");
const authRoute = require("./auth.route");

router.get("/", (req, res) => {
  res.send("API is running");
});


router.use("/auth", authRoute);
router.use("/shorten", shortenRoute);
router.use("/analytics", analyticsRoute);

module.exports = router;
