const express = require("express");
const analyticsController = require("../controllers/analytics.controller");
const auth = require("../middlewares/auth");

const router = express.Router();

/**
 * @openapi
 * '/api/analytics/overall':
 *  get:
 *      tags:
 *      - Analytics Routes
 *      summary: Get overall analytics data.
 *      security:
 *      - BearerAuth: []
 *      responses:
 *        200:
 *          description: Ok
 *        401:
 *          description: Unauthorized
 *        500:
 *          description: Server Error
 */
router.get("/overall", auth, analyticsController.getAllAnalytics);

/**
 * @openapi
 * '/api/analytics/topic/{topic}':
 *  get:
 *      tags:
 *      - Analytics Routes
 *      summary: Get analytics data by topic.
 *      security:
 *        - BearerAuth: []
 *      parameters:
 *        - in: path
 *          name: topic
 *          required: true
 *          schema:
 *            type: string
 *          description: The topic for which analytics data is requested
 *      responses:
 *        200:
 *          description: Ok
 *        400:
 *          description: Bad Request
 *        401:
 *          description: Unauthorized
 *        500:
 *          description: Server Error
 */
router.get("/topic/:topic", auth, analyticsController.getAnalyticsByTopic);

/**
 * @openapi
 * '/api/analytics/{alias}':
 *  get:
 *      tags:
 *      - Analytics Routes
 *      summary: Get analytics data using the alias.
 *      security:
 *      - BearerAuth: []
 *      parameters:
 *        - in: path
 *          name: alias
 *          required: true
 *          schema:
 *            type: string
 *          description: The alias for which analytics data is requested
 *      responses:
 *        200:
 *          description: Ok
 *        400:
 *          description: Bad Request
 *        404:
 *          description: Not Found
 *        401:
 *          description: Unauthorized
 *        500:
 *          description: Server Error
 */
router.get("/:alias", auth, analyticsController.getAnalytics);

module.exports = router;
