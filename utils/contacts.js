const Contacts = require("../models/contactsModel");
const pool = require("../dbConnection");

const listContacts = async (owner) => {
  try {
    return await Contacts.find({ owner }).select("-__v");
  } catch (error) {
    console.log(error);
  }
};

const getContactById = async (contactId, owner) => {
  try {
    return await Contacts.findOne({ _id: contactId, owner });
    // return await Contacts.findById(contactId);
  } catch (error) {
    console.log(error);
  }
};

const removeContact = async (contactId, owner) => {
  try {
    await Contacts.findOneAndDelete({ _id: contactId, owner });
    // await Contacts.findByIdAndDelete(contactId);

    return;
  } catch (error) {
    console.log(error);
  }
};

// --------------on MariaDB---------------
const addContact = async (body, owner) => {
  try {
    const { name, email, phone } = body;
    const conn = await pool.getConnection();

    const addContact = await conn.query(
      `INSERT INTO contacts(name, email, phone, owner) VALUES('${name}', '${email}', '${phone}', ${owner})`
    );

    // const newContact = await conn.query(
    //   `SELECT * FROM contacts where id = LAST_INSERT_ID()`
    // );
    const newContact = await conn.query(
      `SELECT * FROM contacts where id = ${addContact.insertId}`
    );
    conn.close();

    return newContact[0];
  } catch (error) {
    console.log(error);
  }
};
// --------------END of--- MariaDB---------------

const updateContact = async (contactId, body, owner) => {
  try {
    const updatedContact = await Contacts.findOneAndUpdate(
      { _id: contactId, owner },
      body,
      {
        new: true,
      }
    );
    // Логіка без прив'язки до юзерів
    // const updatedContact = await Contacts.findByIdAndUpdate(contactId, body, {
    //   new: true,
    // });

    return updatedContact;
  } catch (error) {
    console.log(error);
  }
};

const updateStatusContact = async (contactId, body, owner) => {
  try {
    const updatedFvrtContact = await Contacts.findOneAndUpdate(
      { _id: contactId, owner },
      body,
      {
        new: true,
      }
    );
    // const updatedFvrtContact = await Contacts.findByIdAndUpdate(
    //   contactId,
    //   body,   { new: true }
    // );

    return updatedFvrtContact;
  } catch (error) {
    console.log(error);
  }
};

// Pagination and filter contacts
const queryContacts = async (owner, page, limit, favorite) => {
  try {
    const paginationPage = +page || 1;
    const paginationLimit = +limit || 20;
    const skipCount = (paginationPage - 1) * paginationLimit;

    const query = favorite ? { owner, favorite } : { owner };

    const filteredContacts = await Contacts.find(query)
      .select("-__v")
      .skip(skipCount)
      .limit(paginationLimit);

    const countPerPage = filteredContacts.length;
    const total = await Contacts.count();
    const totalFiltered = await Contacts.countDocuments(query);

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
