/**
 * Stratégie Passport Google OAuth2 — crée ou récupère l'utilisateur puis émet un JWT via callback
 */
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('./index');
const userRepository = require('../repositories/user.repository');
const { signToken } = require('../utils/token');

function configurePassport() {
  if (!config.google.clientId || !config.google.clientSecret) {
    console.warn('[passport] Google OAuth non configuré (CLIENT_ID / CLIENT_SECRET manquants)');
    return passport;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: config.google.clientId,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackUrl,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('Email Google introuvable'), null);
          }

          let user = await userRepository.findByEmail(email);

          if (!user) {
            user = await userRepository.create({
              email,
              password: null,
              avatar: profile.photos?.[0]?.value || null,
              provider: 'GOOGLE',
            });
          } else if (user.provider !== 'GOOGLE') {
            user = await userRepository.update(user.id, {
              provider: 'GOOGLE',
              avatar: profile.photos?.[0]?.value || user.avatar,
            });
          }

          const token = signToken({ userId: user.id, email: user.email });
          return done(null, { user, token });
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  return passport;
}

module.exports = { configurePassport };
