const {
  listContacts,
  addContact,
  getContactById,
  removeContact,
  updateContact,
  updateStatusContact,
  queryContacts,
} = require("../models/contacts");

const getContacts = async (req, res, next) => {
  const { page, limit, favorite } = req.query;

  // if req.query
  if (page || limit || favorite) {
    const filteredContacts = await queryContacts(page, limit, favorite);

    return res.status(200).json(filteredContacts);
  }

  const contactsList = await listContacts();
  res.status(200).json(contactsList);
};

const getOneContactById = async (req, res, next) => {
  const { id } = req.params;
  const filteredContact = await getContactById(id);

  res.status(200).json(filteredContact);
};

const postContact = async (req, res, next) => {
  const newContact = await addContact(req.body);

  res.status(201).json(newContact);
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

const patchFavoriteContact = async (req, res, next) => {
  const { id } = req.params;

  const favoriteContact = await updateStatusContact(id, req.body);

  res.status(200).json(favoriteContact);
};

module.exports = {
  getContacts,
  getOneContactById,
  postContact,
  deleteContact,
  putContact,
  patchFavoriteContact,
};
