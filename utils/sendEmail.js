const sgMail = require("@sendgrid/mail");
require("dotenv");

const { SENDGRID_API_KEY } = process.env;
console.log(SENDGRID_API_KEY);

sgMail.setApiKey(SENDGRID_API_KEY);

const sendMail = async (data) => {
  try {
    const email = { ...data, from: "ghostmail@meta.ua" };
    await sgMail.send(email);
    console.log("email in send Email", email);

    return true;
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendMail;

// const email = {
//   to: "nividel938@duiter.com", // Change to your recipient
//   from: "test@example.com", // Change to your verified sender
//   subject: "Test email",
//   text: "and easy to do anywhere, even with Node.js",
//   html: "<strong>and easy to do anywhere, even with Node.js</strong>",
// };

// sgMail
//   .send(msg)
//   .then(() => {
//     console.log("Email sent");
//   })
//   .catch((error) => {
//     console.error(error);
//   });
