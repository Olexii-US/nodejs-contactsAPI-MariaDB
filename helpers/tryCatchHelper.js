// Код Кіріла
// const asyncWrapper = (controller) => {
//   return (req, res, next) => {
//     controller(req, res).catch(next);
//   };
// };

// Код Сергія
const asyncWrapper = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => next(err));
};

module.exports = {
  asyncWrapper,
};
