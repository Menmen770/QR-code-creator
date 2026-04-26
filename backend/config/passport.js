const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/User");
const { BACKEND_URL } = require("./env");

const oauthCallback = (provider) => async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value?.toLowerCase();
    const fullName = profile.displayName || profile.name?.givenName || "User";
    if (!email) return done(new Error("אימייל לא התקבל מהספק"));

    let user = await User.findOne({
      $or: [{ email }, { oauthProvider: provider, oauthId: profile.id }],
    });

    if (user) {
      if (!user.oauthProvider) {
        user.oauthProvider = provider;
        user.oauthId = profile.id;
        await user.save();
      }
    } else {
      user = await User.create({
        fullName,
        email,
        passwordHash: null,
        oauthProvider: provider,
        oauthId: profile.id,
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
};

function registerPassportStrategies() {
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: `${BACKEND_URL}/api/auth/google/callback`,
        },
        oauthCallback("google"),
      ),
    );
  }

  if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    passport.use(
      new FacebookStrategy(
        {
          clientID: process.env.FACEBOOK_APP_ID,
          clientSecret: process.env.FACEBOOK_APP_SECRET,
          callbackURL: `${BACKEND_URL}/api/auth/facebook/callback`,
          profileFields: ["id", "displayName", "emails"],
        },
        oauthCallback("facebook"),
      ),
    );
  }
}

module.exports = { registerPassportStrategies };
