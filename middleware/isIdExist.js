// middleWare
// checks if contact exist
const fs = require("fs").promises;
const path = require("path");

const contactsPath = path.resolve("./models/contacts.json");

const getParsedContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath);
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
};

const isContactIdExist = async (req, res, next) => {
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
};

module.exports = {
  isContactIdExist,
};
