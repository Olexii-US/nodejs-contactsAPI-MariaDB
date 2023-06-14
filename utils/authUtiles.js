const uuid = require("uuid").v4;
const User = require("../models/userModel");
const sendMail = require("./sendEmail");
const { DEV_URL } = process.env;
const pool = require("../dbConnection");
const bcrypt = require("bcrypt");

// --------------on MariaDB---------------
const createNewUser = async (body) => {
  try {
    const verifyCode = uuid();
    // for hashedPassword;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    const conn = await pool.getConnection();

    await conn.query(
      `INSERT INTO users(password, email, verificationToken) VALUES('${hashedPassword}', '${body.email}', '${verifyCode}')`
    );

    const newUser = await conn.query(
      `SELECT * FROM users WHERE email = '${body.email}'`
    );
    conn.close();

    newUser[0].password = undefined;

    const verifyEmail = {
      to: body.email,
      subject: "Email verification",
      text: `Please verify your email address: ${DEV_URL}/api/users/verify/${verifyCode}`,
      html: `<strong>Please verify your email address:</strong><a target="_blank" href="${DEV_URL}/api/users/verify/${verifyCode}">Click here</a>`,
    };
    await sendMail(verifyEmail);

    return newUser[0];
  } catch (error) {
    console.log(error);
  }
};

const verifyUserFn = async (verificationToken) => {
  try {
    const conn = await pool.getConnection();

    const user = await conn.query(
      `SELECT * FROM users WHERE verificationToken='${verificationToken}'`
    );
    if (user.length === 0) return false;

    await conn.query(
      `UPDATE users
      SET verify = true, verificationToken = null
      WHERE verificationToken='${verificationToken}'`
    );

    conn.close();
    return true;
  } catch (error) {
    console.log(error);
  }
};

const findEmail = async (body) => {
  try {
    const { email } = body;
    const conn = await pool.getConnection();

    const user = await conn.query(`SELECT * FROM users WHERE email='${email}'`);
    conn.close();

    return user[0];
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
    const conn = await pool.getConnection();

    const user = await conn.query(
      `SELECT * FROM users WHERE email = '${email}'`
    );
    conn.close();

    return user[0];
  } catch (error) {
    console.log(error);
  }
};

const signTokenInBD = async (contactId, token) => {
  try {
    const conn = await pool.getConnection();

    await conn.query(
      `UPDATE users
      SET token='${token}'
      WHERE id=${contactId}`
    );

    const updatedContact = await conn.query(
      `SELECT email, subscription FROM users WHERE id = ${contactId}`
    );
    conn.close();

    return updatedContact[0];
  } catch (error) {
    console.log(error);
  }
};

const checkPassword = (candidate, hash) => bcrypt.compare(candidate, hash);

// перевірити!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const logoutUserFn = async (userId) => {
  try {
    const conn = await pool.getConnection();

    await conn.query(
      `UPDATE users
      SET token = null
      WHERE id=${userId}`
    );
    conn.close();
    return;

    //
    // const logoutUser = await User.findByIdAndUpdate(
    //   userId,
    //   { $unset: { token: 1 } },
    //   // { token: undefined },
    //   {
    //     new: true,
    //   }
    // );

    // return logoutUser;
  } catch (error) {
    console.log(error);
  }
};
// --------------End---------------

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
  checkPassword,
};
