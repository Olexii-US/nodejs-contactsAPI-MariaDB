const User = require("../models/userModel");

const createNewUser = async (body) => {
  try {
    const newUser = await User.create(body);
    newUser.password = undefined;

    return newUser;
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
  loginUserFn,
  signTokenInBD,
  logoutUserFn,
  changeSubsc,
};
