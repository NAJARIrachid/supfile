/**
 * Enveloppe les handlers async Express pour propager les erreurs vers next(err)
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
