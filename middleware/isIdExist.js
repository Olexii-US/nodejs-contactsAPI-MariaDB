const { Types } = require("mongoose");
const Contacts = require("../models/contactsModel");

const isContactIdExist = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const idIsValid = Types.ObjectId.isValid(contactId);
    if (!idIsValid) {
      return res.status(404).json({ message: "Not found" });
    }

    const isIdExist = await Contacts.exists({ _id: contactId });
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
