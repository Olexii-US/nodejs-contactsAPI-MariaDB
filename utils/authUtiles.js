const uuid = require("uuid").v4;
// const User = require("../models/userModel");
const sendMail = require("./sendEmail");
const { DEV_URL } = process.env;
const pool = require("../dbConnection");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// --------------on MariaDB---------------
const createNewUser = async (body) => {
  try {
    const verifyCode = uuid();
    // for hashedPassword;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);
    // for temp avatar logic
    const emailHash = crypto.createHash("md5").update(body.email).digest("hex");
    const avatarURL = `https://www.gravatar.com/avatar/${emailHash}.jpg?d=wavatar`;

    // Maria DB
    const conn = await pool.getConnection();

    await conn.query(
      `INSERT INTO users(password, email, verificationToken, avatarURL) VALUES('${hashedPassword}', '${body.email}', '${verifyCode}', '${avatarURL}')`
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
  } catch (error) {
    console.log(error);
  }
};

const changeSubsc = async (userId, body) => {
  const { subscription } = body;
  try {
    const conn = await pool.getConnection();

    await conn.query(
      `UPDATE users
      SET subscription='${subscription}'
      WHERE id=${userId}`
    );

    const user = await conn.query(`SELECT * FROM users WHERE id = ${userId}`);
    conn.close();

    return user[0];
  } catch (error) {
    console.log(error);
  }
};

const changeAvatarFn = async (userId, avatarURL) => {
  try {
    const conn = await pool.getConnection();

    // have to add '\\' manually, because ImageService, folePath with MySQL gives bug
    await conn.query(
      `UPDATE users
      SET avatarURL='avatars\\\\${avatarURL}'
      WHERE id=${userId}`
    );

    const userAvatar = await conn.query(
      `SELECT avatarURL FROM users WHERE id = ${userId}`
    );
    conn.close();

    return userAvatar[0];
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
  changeAvatarFn,
};
