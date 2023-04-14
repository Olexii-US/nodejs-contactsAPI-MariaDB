const uuid = require("uuid").v4;
const User = require("../models/userModel");
const sendMail = require("./sendEmail");
const { DEV_URL } = process.env;

const createNewUser = async (body) => {
  try {
    const verifyCode = uuid();
    const newUser = await User.create({
      ...body,
      verificationToken: verifyCode,
    });

    newUser.password = undefined;

    const verifyEmail = {
      to: body.email,
      subject: "Email verification",
      text: `Please verify your email address: ${DEV_URL}/api/users/verify/${verifyCode}`,
      html: `<strong>Please verify your email address:</strong><a target="_blank" href="${DEV_URL}/api/users/verify/${verifyCode}">Click here</a>`,
    };
    await sendMail(verifyEmail);

    return newUser;
  } catch (error) {
    console.log(error);
  }
};

const verifyUserFn = async (verificationToken) => {
  try {
    const user = await User.findOne({ verificationToken });

    if (!user) return;

    return await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });
  } catch (error) {
    console.log(error);
  }
};

const findEmail = async (body) => {
  try {
    const { email } = body;
    const user = await User.findOne({ email });

    return user;
  } catch (error) {
    console.log(error);
  }
};
const resendVerifyEmail = async (user) => {
  try {
    const { email, verificationToken } = user;

    const verifyEmail = {
      to: email,
      subject: "Email verification",
      text: `Please verify your email address: ${DEV_URL}/api/users/verify/${verificationToken}`,
      html: `<strong>Please verify your email address:</strong><a target="_blank" href="${DEV_URL}/api/users/verify/${verificationToken}">Click here</a>`,
    };

    return await sendMail(verifyEmail);
  } catch (error) {
    console.log(error);
  }
};

const loginUserFn = async (body) => {
  try {
    const { email } = body;
    const user = await User.findOne({ email }).select("+password");

    return user;
  } catch (error) {
    console.log(error);
  }
};

const signTokenInBD = async (contactId, updateBody) => {
  try {
    const updatedContact = await User.findByIdAndUpdate(contactId, updateBody, {
      new: true,
    });

    return updatedContact;
  } catch (error) {
    console.log(error);
  }
};

const logoutUserFn = async (userId) => {
  try {
    const logoutUser = await User.findByIdAndUpdate(
      userId,
      { $unset: { token: 1 } },
      // { token: undefined },
      {
        new: true,
      }
    );

    return logoutUser;
  } catch (error) {
    console.log(error);
  }
};

const changeSubsc = async (userId, newSubscription) => {
  try {
    const user = await User.findByIdAndUpdate(userId, newSubscription, {
      new: true,
      runValidators: true,
    });

    return user;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createNewUser,
  verifyUserFn,
  findEmail,
  resendVerifyEmail,
  loginUserFn,
  signTokenInBD,
  logoutUserFn,
  changeSubsc,
};
