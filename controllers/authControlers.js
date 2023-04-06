const User = require("../models/userModel");
const { signToken } = require("../services/getToken");
const { ImageService } = require("../services/imageService");
const {
  createNewUser,
  loginUserFn,
  signTokenInBD,
  logoutUserFn,
  changeSubsc,
} = require("../utils/authUtiles");

const registerUser = async (req, res, next) => {
  const userExists = await User.exists({ email: req.body.email });

  if (userExists) return res.status(409).json({ message: "Email in use" });

  const { email, subscription } = await createNewUser(req.body);

  res.status(201).json({ user: { email, subscription } });
};

// registerUser without preSave midelware
// const registerUser = async (req, res, next) => {
//   const userExists = await User.exists({ email: req.body.email });
//   const { password, ...restData } = req.body;

//   if (userExists) return res.status(409).json({ message: "Email in use" });

//   const salt = await bcrypt.genSalt(10);
//   const hashedPassword = await bcrypt.hash(password, salt);
//   const { email, subscription } = await createNewUser({
//     ...restData,
//     password: hashedPassword,
//   });

//   res.status(201).json({ user: { email, subscription } });
// };

const loginUser = async (req, res, next) => {
  const { password } = req.body;

  const user = await loginUserFn(req.body);

  if (!user)
    return res.status(401).json({ message: "Email or password is wrong" });

  const passwordIsValid = await user.checkPassword(password, user.password);

  if (!passwordIsValid)
    return res.status(401).json({ message: "Email or password is wrong" });

  user.password = undefined;

  const token = signToken(user.id);
  const { email, subscription } = await signTokenInBD(user.id, { user, token });

  res.status(200).json({ token, user: { email, subscription } });
};

// loginUser without preSave midelware
// const loginUser = async (req, res, next) => {
//   const { password } = req.body;

//   const user = await loginUserFn(req.body);

//   if (!user)
//     return res.status(401).json({ message: "Email or password is wrong" });

//   const passwordIsValid = await bcrypt.compare(password, user.password);

//   if (!passwordIsValid)
//     return res.status(401).json({ message: "Email or password is wrong" });

//   user.password = undefined;

//   const token = signToken(user.id);
//   const { email, subscription } = await signTokenInBD(user.id, { user, token });

//   res.status(200).json({ token, user: { email, subscription } });
// };

const logoutUser = async (req, res, next) => {
  const currentUser = req.user;

  await logoutUserFn(currentUser.id);

  res.sendStatus(204);
};

const currentUser = async (req, res, next) => {
  const { email, subscription } = req.user;

  res.status(200).json({ email, subscription });
};

//
const changeSubscription = async (req, res, next) => {
  const newSubscription = req.body;
  const currentUser = req.user;

  const updateUser = await changeSubsc(currentUser.id, newSubscription);

  if (!updateUser)
    return res.status(400).json({ message: "Subscription value is wrong" });

  const { email, subscription } = updateUser;

  res.status(200).json({ email, subscription });
};

const changeAvatar = async (req, res, next) => {
  const { file, user } = req;

  if (file) {
    user.avatarURL = await ImageService.save(
      file,
      250,
      250,
      "avatars",
      `userId_${user.id}`
    );
  }

  const updatedUser = await user.save();
  res.status(200).json({ avatarURL: updatedUser.avatarURL });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  changeSubscription,
  changeAvatar,
};
