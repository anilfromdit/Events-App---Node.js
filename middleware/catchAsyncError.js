module.exports = (handleAsync) => (req, res, next) => {
  Promise.resolve(handleAsync(req, res, next)).catch(next);
};
