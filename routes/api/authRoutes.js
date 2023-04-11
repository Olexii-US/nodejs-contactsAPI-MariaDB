const express = require("express");

const {
  registerUser,
  loginUser,
  verifyUser,
  logoutUser,
  currentUser,
  changeSubscription,
  changeAvatar,
} = require("../../controllers/authControlers");
const { asyncWrapper } = require("../../helpers/tryCatchHelper");
const {
  postRegisterValidation,
  postLoginValidation,
  patchSubscriptionValidation,
  patchAvatarValidation,
} = require("../../middleware/authValidation");
const { protectedWithToken } = require("../../middleware/isTokenValid");
const { uploadUserAvatar } = require("../../middleware/userUpdate");

const authRouter = express.Router();

authRouter.post(
  "/register",
  postRegisterValidation,
  asyncWrapper(registerUser)
);
authRouter.post("/login", postLoginValidation, asyncWrapper(loginUser));
authRouter.get("/verify/:verificationToken", asyncWrapper(verifyUser));

// only for login users
authRouter.post("/logout", protectedWithToken, asyncWrapper(logoutUser));
authRouter.get("/current", protectedWithToken, asyncWrapper(currentUser));
authRouter.patch(
  "/",
  patchSubscriptionValidation,
  protectedWithToken,
  asyncWrapper(changeSubscription)
);

authRouter.patch(
  "/avatars",
  patchAvatarValidation,
  protectedWithToken,
  uploadUserAvatar,
  asyncWrapper(changeAvatar)
);

module.exports = authRouter;
