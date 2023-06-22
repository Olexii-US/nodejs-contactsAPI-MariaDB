const sgMail = require("@sendgrid/mail");
require("dotenv");

const { SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendMail = async (data) => {
  try {
    const email = { ...data, from: "ghostmail@meta.ua" };
    await sgMail.send(email);

    return true;
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendMail;
