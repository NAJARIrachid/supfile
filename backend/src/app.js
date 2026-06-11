/**
 * Application Express — middlewares de sécurité et montage des routes
 */
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const passport = require('passport');
const config = require('./config');
const { configurePassport } = require('./config/passport');
const routes = require('./routes');
const { apiLimiter } = require('./middleware/rateLimit.middleware');
const { notFoundHandler, errorHandler } = require('./middleware/error.middleware');
const fileStorage = require('./utils/fileStorage');

const app = express();

// Initialise le dossier uploads au démarrage
fileStorage.ensureUploadDir('_system');

configurePassport();
app.use(passport.initialize());

app.use(helmet());
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(apiLimiter);

app.use(config.apiPrefix, routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
