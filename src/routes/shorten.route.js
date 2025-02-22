const express = require("express");
const shortenController = require("../controllers/shorten.controller");
const validate = require("../middlewares/validate")
const shortenValidation = require("../validations/shorten.validation")
const auth = require("../middlewares/auth")

const router = express.Router();

/** POST Method */
/**
 * @openapi
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * '/api/shorten/':
 *  post:
 *     tags:
 *     - Shorten Routes
 *     summary: Shorten a long url.
 *     security:
 *      - BearerAuth: []
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - url
 *            properties:
 *              url:
 *                type: string
 *                default: 'https://www.google.com'
 *              customAlias:
 *                type: string
 *                default: google
 *              topic:
 *                type: string
 *                default: searchEngine
 *     responses:
 *      201:
 *        description: Created
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server Error
 */

router.post("/", auth, validate(shortenValidation.shorten), shortenController.shorten);


/**
 * @openapi
 * '/api/shorten/{alias}':
 *  get:
 *      tags:
 *      - Shorten Routes
 *      summary: Get long URL using the alias.
 *      parameters:
 *        - in: path
 *          name: alias
 *          required: true
 *          schema:
 *            type: string
 *          description: The alias of the shortened URL
 *      responses:
 *        200:
 *          description: Ok
 *        400:
 *          description: Bad Request
 *        401:
 *          description: Unauthorized
 *        404:
 *          description: Not Found
 *        500:
 *          description: Server Error
 */
router.get("/:alias", shortenController.getUrl);

module.exports = router;
