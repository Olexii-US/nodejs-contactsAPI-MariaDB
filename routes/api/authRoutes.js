const express = require("express");

const {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  changeSubscription,
} = require("../../controllers/authControlers");
const { asyncWrapper } = require("../../helpers/tryCatchHelper");
const {
  postRegisterValidation,
  postLoginValidation,
} = require("../../middleware/authValidation");
const { protectedWithToken } = require("../../middleware/isTokenValid");

const authRouter = express.Router();

authRouter.post(
  "/register",
  postRegisterValidation,
  asyncWrapper(registerUser)
);
authRouter.post("/login", postLoginValidation, asyncWrapper(loginUser));

// only for login users
authRouter.post("/logout", protectedWithToken, asyncWrapper(logoutUser));
authRouter.get("/current", protectedWithToken, asyncWrapper(currentUser));
authRouter.patch("/", protectedWithToken, asyncWrapper(changeSubscription));

module.exports = authRouter;
