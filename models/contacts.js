const fs = require("fs").promises;
const path = require("path");
const uuid = require("uuid").v4;

const contactsPath = path.resolve("./models/contacts.json");
const getParsedContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath);
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
};

const listContacts = async () => {
  try {
    return await getParsedContacts();
  } catch (error) {
    console.log(error);
  }
};

const getContactById = async (contactId) => {
  try {
    const contactsData = await getParsedContacts();

    const filteredContact = contactsData.find(
      (item) => item.id === contactId.toString()
    );

    return filteredContact;
  } catch (error) {
    console.log(error);
  }
};

const removeContact = async (contactId) => {
  try {
    const contactsData = await getParsedContacts();

    const filteredContact = contactsData.filter(
      (item) => item.id !== contactId.toString()
    );
    await fs.writeFile(contactsPath, JSON.stringify(filteredContact));

    return;
  } catch (error) {
    console.log(error);
  }
};

const addContact = async (body) => {
  try {
    const { name, email, phone } = body;
    const contactsData = await getParsedContacts();

    const newContact = { id: uuid(), name, email, phone };
    contactsData.push(newContact);

    await fs.writeFile(contactsPath, JSON.stringify(contactsData));

    return newContact;
  } catch (error) {
    console.log(error);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const { name, email, phone } = body;
    const contactsData = await getParsedContacts();

    const updatedContact = contactsData.find(
      (item) => item.id === contactId.toString()
    );

    contactsData.forEach((item) => {
      if (item.id === contactId.toString()) {
        if (name) {
          item.name = name;
        }
        if (email) {
          item.email = email;
        }
        if (phone) {
          item.phone = phone;
        }
      }
    });

    await fs.writeFile(contactsPath, JSON.stringify(contactsData));

    return updatedContact;
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
};
