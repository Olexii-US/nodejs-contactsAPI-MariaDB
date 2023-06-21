const {
  listContacts,
  addContact,
  getContactById,
  removeContact,
  updateContact,
  updateStatusContact,
  queryContacts,
} = require("../utils/contacts");

// --------------on MariaDB---------------
const getContacts = async (req, res, next) => {
  const { id } = req.user;

  const { page, limit, favorite } = req.query;

  console.log("req.query---------", req.query);

  // if req.query
  if (page || limit || favorite) {
    const filteredContacts = await queryContacts(
      id,
      page,
      Number(limit),
      favorite
    );

    if (filteredContacts.filteredContacts.length === 0)
      return res.status(200).json({
        message: `Sorry, there are no contacts matching your request`,
      });

    return res.status(200).json(filteredContacts);
  }

  // if No req.query
  const contactsList = await listContacts(id);
  res.status(200).json(contactsList);
};

const getOneContactById = async (req, res, next) => {
  const contactId = Number(req.params.id);
  const userId = req.user.id;

  const contactById = await getContactById(contactId, userId);

  if (!contactById)
    return res.status(200).json({
      message: `This user does not have contact with id: ${contactId}`,
    });

  res.status(200).json(contactById);
};

const postContact = async (req, res, next) => {
  const { id } = req.user;
  const newContact = await addContact(req.body, id);

  res.status(201).json(newContact);
};

const deleteContact = async (req, res, next) => {
  const { id } = req.params;

  const delatedContacts = await removeContact(id, req.user);

  if (!delatedContacts)
    return res
      .status(200)
      .json({ message: `This user does not have contact with id: ${id}` });

  res.status(200).json({ message: "contact deleted" });
};

const putContact = async (req, res, next) => {
  const contactId = Number(req.params.id);
  const user = req.user;

  const updatedContact = await updateContact(contactId, req.body, user);
  if (!updatedContact)
    return res.status(200).json({
      message: `This user does not have contact with id: ${contactId}`,
    });

  res.status(200).json(updatedContact);
};

const patchFavoriteContact = async (req, res, next) => {
  const contactId = Number(req.params.id);
  const user = req.user;

  const favoriteContact = await updateStatusContact(contactId, req.body, user);

  if (!favoriteContact)
    return res.status(200).json({
      message: `This user does not have contact with id: ${contactId}`,
    });

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
