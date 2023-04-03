const { asyncWrapper } = require("../helpers/tryCatchHelper");
const User = require("../models/userModel");
const { tokenDecoder } = require("../services/getToken");

const protectedWithToken = asyncWrapper(async (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith("Bearer") &&
    req.headers.authorization.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Not authorized" });

  let decodedToken;

  try {
    decodedToken = tokenDecoder(token);
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Not authorized" });
  }

  const currentUser = await User.findById(decodedToken.id);

  if (!currentUser) return res.status(401).json({ message: "Not authorized" });

  req.user = currentUser;

  next();
});

module.exports = {
  protectedWithToken,
};
