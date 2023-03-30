const Contacts = require("./contactsModel");

const listContacts = async () => {
  try {
    return await Contacts.find().select("-__v");
  } catch (error) {
    console.log(error);
  }
};

const getContactById = async (contactId) => {
  try {
    return await Contacts.findById(contactId);
  } catch (error) {
    console.log(error);
  }
};

const removeContact = async (contactId) => {
  try {
    await Contacts.findByIdAndDelete(contactId);

    return;
  } catch (error) {
    console.log(error);
  }
};

const addContact = async (body) => {
  try {
    const newContact = await Contacts.create(body);

    return newContact;
  } catch (error) {
    console.log(error);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const updatedContact = await Contacts.findByIdAndUpdate(contactId, body, {
      new: true,
    });

    return updatedContact;
  } catch (error) {
    console.log(error);
  }
};

const updateStatusContact = async (contactId, body) => {
  try {
    const updatedFvrtContact = await Contacts.findByIdAndUpdate(
      contactId,
      body,
      {
        new: true,
      }
    );

    return updatedFvrtContact;
  } catch (error) {
    console.log(error);
  }
};

// Pagination and filter contacts
const queryContacts = async (page, limit, favorite) => {
  try {
    const paginationPage = +page || 1;
    const paginationLimit = +limit || 20;
    const skipCount = (paginationPage - 1) * paginationLimit;

    const filteredContacts = await Contacts.find(favorite ? { favorite } : null)
      .select("-__v")
      .skip(skipCount)
      .limit(paginationLimit);

    const countPerPage = filteredContacts.length;
    const total = await Contacts.count();
    const totalFiltered = await Contacts.countDocuments(
      favorite ? { favorite } : null
    );

    return { countPerPage, total, totalFiltered, filteredContacts };
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
  queryContacts,
};
