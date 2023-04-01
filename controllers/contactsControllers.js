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
  const { _id } = req.user;

  const { page, limit, favorite } = req.query;

  // if req.query
  if (page || limit || favorite) {
    const filteredContacts = await queryContacts(_id, page, limit, favorite);

    return res.status(200).json(filteredContacts);
  }

  // if No req.query
  const contactsList = await listContacts(_id);
  console.log("contactsList", contactsList);

  res.status(200).json(contactsList);
};

const getOneContactById = async (req, res, next) => {
  const { id } = req.params;
  const { _id } = req.user;

  const filteredContact = await getContactById(id, _id);

  if (!filteredContact)
    return res
      .status(200)
      .json({ message: `This user does not have contact with id: ${id}` });

  res.status(200).json(filteredContact);
};

const postContact = async (req, res, next) => {
  const { _id } = req.user;
  const newContact = await addContact(req.body, _id);

  res.status(201).json(newContact);
};

const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  const { _id } = req.user;

  const delatedContacts = await removeContact(id, _id);

  if (!delatedContacts)
    return res
      .status(200)
      .json({ message: `This user does not have contact with id: ${id}` });

  res.status(200).json({ message: "contact deleted" });
};

const putContact = async (req, res, next) => {
  const { id } = req.params;
  const { _id } = req.user;

  const updatedContact = await updateContact(id, req.body, _id);
  if (!updatedContact)
    return res
      .status(200)
      .json({ message: `This user does not have contact with id: ${id}` });

  res.status(200).json(updatedContact);
};

const patchFavoriteContact = async (req, res, next) => {
  const { id } = req.params;
  const { _id } = req.user;

  const favoriteContact = await updateStatusContact(id, req.body, _id);
  if (!favoriteContact)
    return res
      .status(200)
      .json({ message: `This user does not have contact with id: ${id}` });

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
