const Contacts = require("../models/contactsModel");
const pool = require("../dbConnection");

// --------------on MariaDB---------------
const listContacts = async (owner) => {
  try {
    const conn = await pool.getConnection();

    const getAllContacts = await conn.query(
      `SELECT * FROM contacts where owner = ${owner}`
    );
    conn.close();
    return getAllContacts;
  } catch (error) {
    console.log(error);
  }
};

const getContactById = async (contactId, owner) => {
  try {
    const conn = await pool.getConnection();

    const getOneContact = await conn.query(
      `SELECT * FROM contacts where owner = ${owner} and id = ${contactId}`
    );
    conn.close();

    return getOneContact[0];
  } catch (error) {
    console.log(error);
  }
};

const removeContact = async (contactId, user) => {
  try {
    const conn = await pool.getConnection();

    const deleteContactById = await conn.query(
      `DELETE FROM contacts WHERE id = ${contactId} AND owner = ${user.id}`
    );

    conn.close();

    return deleteContactById.affectedRows;
  } catch (error) {
    console.log(error);
  }
};

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

const updateContact = async (contactId, body, user) => {
  try {
    const conn = await pool.getConnection();
    const { name, email, phone } = body;
    const contactBeforeUpdate = await getContactById(contactId, user.id);

    const newName = !name ? contactBeforeUpdate.name : name;
    const newEmail = !email ? contactBeforeUpdate.email : email;
    const newPhone = !phone ? contactBeforeUpdate.phone : phone;

    console.log("body data-------", name, email, phone);
    console.log("new body data-------", newName, newEmail, newPhone);
    console.log(
      "mariadbbbbbb",
      contactBeforeUpdate.name,
      contactBeforeUpdate.email,
      contactBeforeUpdate.phone
    );

    await conn.query(
      `UPDATE contacts 
     SET name='${newName}', email='${newEmail}', phone='${newPhone}'
      WHERE
      owner = ${user.id} and id = ${contactId}`
    );

    const updatedContact = await conn.query(
      `SELECT name, email, phone, favorite FROM contacts  WHERE
      owner = ${user.id} and id = ${contactId}`
    );
    conn.close();

    return updatedContact[0];
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
