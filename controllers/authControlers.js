const { signToken } = require("../services/getToken");
const { ImageService } = require("../services/imageService");
const {
  createNewUser,
  verifyUserFn,
  findEmail,
  resendVerifyEmail,
  loginUserFn,
  signTokenInBD,
  logoutUserFn,
  changeSubsc,
  checkPassword,
  changeAvatarFn,
} = require("../utils/authUtiles");

const pool = require("../dbConnection");

const registerUser = async (req, res, next) => {
  const conn = await pool.getConnection();
  const userExists = await conn.query(
    `SELECT * FROM users WHERE email = '${req.body.email}'`
  );
  conn.close();

  if (userExists.length !== 0)
    return res.status(409).json({ message: "Email in use" });

  const { email, subscription } = await createNewUser(req.body);

  res.status(201).json({ user: { email, subscription } });
};

const verifyUser = async (req, res, next) => {
  const { verificationToken } = req.params;

  const isUserVerifyed = await verifyUserFn(verificationToken);

  if (!isUserVerifyed)
    return res.status(404).json({ message: "User not found" });

  res.status(200).json({
    message: "Verification successful",
  });
};

const resendVerifyForUser = async (req, res, next) => {
  const user = await findEmail(req.body);

  if (!user) return res.status(401).json({ message: "User not found" });
  if (user.verify)
    return res.status(400).json({
      message: "Verification has already been passed",
    });

  resendVerifyEmail(user);

  res.status(200).json({
    message: "Verification email sent",
  });
};

const loginUser = async (req, res, next) => {
  const { password } = req.body;

  const user = await loginUserFn(req.body);

  if (!user)
    return res.status(401).json({ message: "Email or password is wrong" });

  if (!user.verify)
    return res.status(401).json({ message: "Email is not verified" });

  const passwordIsValid = await checkPassword(password, user.password);

  if (!passwordIsValid)
    return res.status(401).json({ message: "Email or password is wrong" });

  user.password = undefined;

  const token = signToken(user.id);

  const { email, subscription } = await signTokenInBD(user.id, token);

  res.status(200).json({ token, user: { email, subscription } });
};

const logoutUser = async (req, res, next) => {
  const currentUser = req.user;

  await logoutUserFn(currentUser.id);

  res.sendStatus(204);
};

const currentUser = async (req, res, next) => {
  const { email, subscription } = req.user;

  res.status(200).json({ email, subscription });
};

const changeSubscription = async (req, res, next) => {
  const currentUser = req.user;

  const updateUser = await changeSubsc(currentUser.id, req.body);

  if (!updateUser)
    return res.status(400).json({ message: "Subscription value is wrong" });

  const { email, subscription } = updateUser;

  res.status(200).json({ email, subscription });
};

const changeAvatar = async (req, res, next) => {
  const { file, user } = req;

  if (file) {
    const tmpPath = `./tmp`;
    user.avatarURL = await ImageService.save(
      tmpPath,
      user.id,
      250,
      250
      // "avatars"
    );
  }

  const userAvatar = await changeAvatarFn(user.id, user.avatarURL);

  res.status(200).json({ userAvatar });
};

module.exports = {
  registerUser,
  loginUser,
  verifyUser,
  resendVerifyForUser,
  logoutUser,
  currentUser,
  changeSubscription,
  changeAvatar,
};
