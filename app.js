const express = require("express");
const logger = require("morgan");
const cors = require("cors");

//
const fs = require("fs").promises;
const path = require("path");
//

const contactsRouter = require("./routes/api/contacts");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

// middleWare
// checks if contact exist
const contactsPath = path.resolve("./models/contacts.json");
const getParsedContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath);
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
};

app.use("/api/contacts/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contactsData = await getParsedContacts();

    // is array contains id
    const isIdExist = contactsData.find(
      (item) => item.id === contactId.toString()
    );
    if (!isIdExist) {
      return res.status(404).json({ message: "Not found" });
    }
    next();
  } catch (error) {
    console.log(error);
  }
});
// End of middleWare

app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
