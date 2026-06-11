/**
 * Middleware de validation Zod — parse req.body ou req.query selon la source
 */
const AppError = require('../utils/AppError');

function validate(schema, source = 'body') {
  return (req, _res, next) => {
    const data = source === 'query' ? req.query : req.body;
    const result = schema.safeParse(data);
    if (!result.success) {
      const message = result.error.errors.map((e) => e.message).join(', ');
      return next(new AppError(message, 400, 'VALIDATION_ERROR'));
    }
    if (source === 'query') {
      req.validatedQuery = result.data;
    } else {
      req.validatedBody = result.data;
    }
    next();
  };
}

module.exports = validate;
