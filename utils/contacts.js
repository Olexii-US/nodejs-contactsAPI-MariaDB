const pool = require("../dbConnection");

// --------------on MariaDB---------------
const listContacts = async (ownerId) => {
  try {
    const conn = await pool.getConnection();

    const getAllContacts = await conn.query(
      `SELECT * FROM contacts where owner = ${ownerId}`
    );
    conn.close();

    return getAllContacts;
  } catch (error) {
    console.log(error);
  }
};

const getContactById = async (contactId, ownerId) => {
  try {
    const conn = await pool.getConnection();

    const getOneContact = await conn.query(
      `SELECT id, name, email, phone, favorite FROM contacts where owner = ${ownerId} and id = ${contactId}`
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

const addContact = async (body, ownerID) => {
  try {
    const { name, email, phone } = body;
    const conn = await pool.getConnection();

    const addContact = await conn.query(
      `INSERT INTO contacts(name, email, phone, owner) VALUES('${name}', '${email}', '${phone}', ${ownerID})`
    );
    // const newContact = await conn.query(
    //   `SELECT * FROM contacts where id = LAST_INSERT_ID()`
    // );

    const newContact = await getContactById(addContact.insertId, ownerID);

    conn.close();

    return newContact;
  } catch (error) {
    console.log(error);
  }
};

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

    const updatedContact = await getContactById(contactId, user.id);

    return updatedContact;
  } catch (error) {
    console.log(error);
  }
};

const updateStatusContact = async (contactId, body, user) => {
  try {
    const conn = await pool.getConnection();

    await conn.query(
      `UPDATE contacts 
     SET favorite=${body.favorite} WHERE owner = ${user.id} and id = ${contactId}`
    );

    const updatedFvrtContact = await getContactById(contactId, user.id);

    conn.close();

    return updatedFvrtContact;
  } catch (error) {
    console.log(error);
  }
};

// Pagination and filter contacts
const queryContacts = async (ownerId, page, limit, favorite) => {
  try {
    const conn = await pool.getConnection();
    const offset = (page - 1) * limit;

    let query;
    let countQuery;

    if (favorite === undefined) {
      query = `SELECT * FROM contacts where owner = ${ownerId} LIMIT ${limit} OFFSET ${offset}`;
      countQuery = `SELECT COUNT(*) FROM contacts where owner = ${ownerId}`;
    } else {
      query = `SELECT * FROM contacts where owner = ${ownerId} and favorite = ${favorite} LIMIT ${limit} OFFSET ${offset};`;
      countQuery = `SELECT COUNT(*) FROM contacts where owner = ${ownerId} and favorite = ${favorite}`;
    }

    const filteredContacts = await conn.query(`${query}`);

    // ---- additional pagination / filter info ----
    const totalRows = await conn.query(`SELECT COUNT(*) FROM contacts`);
    const totalContacts = Number(Object.values(totalRows[0]));

    const totalFiltered = await conn.query(`${countQuery}`);
    const totalFilteredContacts = Number(Object.values(totalFiltered[0]));

    const countPerPage = filteredContacts.length;
    conn.close();

    return {
      countPerPage,
      totalContacts,
      totalFilteredContacts,
      filteredContacts,
    };
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
