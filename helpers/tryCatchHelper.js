const asyncWrapper = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => next(err));
};

module.exports = {
  asyncWrapper,
};
