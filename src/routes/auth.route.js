const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const config = require("../config/config");

const router = express.Router();

function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, config.jwt.secret, {
    expiresIn: '1h',
  });
}

/**
 * @openapi
 * '/api/auth/google':
 *  get:
 *      tags:
 *      - Auth Routes
 *      summary: Initiate Google authentication.
 *      responses:
 *        302:
 *          description: Redirect to Google for authentication
 */
router.get("/google", passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

/**
 * @openapi
 * '/api/auth/google/redirect':
 *  get:
 *      tags:
 *      - Auth Routes
 *      summary: Handle Google authentication redirect.
 *      responses:
 *        200:
 *          description: Successfully authenticated
 *        401:
 *          description: Unauthorized
 */
router.get("/google/redirect",
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user);
    return res.send({ user: req.user, token });
  }
);

module.exports = router;
