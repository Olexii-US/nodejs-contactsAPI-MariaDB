const express = require("express");
const logger = require("morgan");
const cors = require("cors");
// const mongoose = require("mongoose");
require("dotenv").config();
const app = express();

const contactsRouter = require("./routes/api/contacts");
const { isContactIdExist } = require("./middleware/isIdExist");
const authRouter = require("./routes/api/authRoutes");

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

// mongoose
//   .connect(process.env.MONGO_URL)
//   .then((connection) => {
//     console.log("Database connection successful");
//   })
//   .catch((err) => {
//     console.log(err);

//     process.exit(1);
//   });
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

// Static folder connect
app.use(express.static("public"));

// ------authRouter om MariaDB----------
app.use("/api/users", authRouter);
// -----EXIT---- MariaDB----------

// middleWare
// checks if contact exist
// TO--Doooo on Maria DB
// app.use("/api/contacts/:contactId", isContactIdExist);

// ------contactsRouter om MariaDB----------
app.use("/api/contacts", contactsRouter);
// -----EXIT---- MariaDB----------

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
