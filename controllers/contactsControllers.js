const {
  listContacts,
  addContact,
  getContactById,
  removeContact,
  updateContact,
} = require("../models/contacts");

const getContacts = async (req, res, next) => {
  const contactsList = await listContacts();
  // res.status(200).json(JSON.stringify(contactsList));
  res.status(200).json(contactsList);
};

const getOneContactById = async (req, res, next) => {
  const { id } = req.params;
  const filteredContact = await getContactById(id);

  res.status(200).json(filteredContact);
};

const postContact = async (req, res, next) => {
  const { id, name, email, phone } = await addContact(req.body);

  res.status(201).json({
    id,
    name,
    email,
    phone,
  });
};

const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  await removeContact(id);

  res.status(200).json({ message: "contact deleted" });
};

const putContact = async (req, res, next) => {
  const { id } = req.params;

  const updatedContact = await updateContact(id, req.body);

  res.status(200).json(updatedContact);
};

module.exports = {
  getContacts,
  getOneContactById,
  postContact,
  deleteContact,
  putContact,
};
