const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');
const User = require('../models/user.model');
const { google, backendUrl } = require('../config/config');


const passportStrategy = new Strategy(
    {
        clientID: google.clientId,
        clientSecret: google.clientSecret,
        callbackURL: `${backendUrl}/api/auth/google/redirect`,
    },
    async (accessToken, refreshToken, profile, done) => {
        try {

            let user = await User.findOne({ googleToken: profile.id });

            if (!user) {

                user = new User({
                    googleToken: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,

                });
                await user.save();
            }


            done(null, user);
        } catch (err) {
            done(err, null);
        }
    }
)

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

module.exports = passportStrategy