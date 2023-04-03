const jwt = require("jsonwebtoken");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });

const tokenDecoder = (token) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = {
  signToken,
  tokenDecoder,
};
