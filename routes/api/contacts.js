const express = require("express");
const Joi = require("joi");

const {
  listContacts,
  addContact,
  getContactById,
  removeContact,
  updateContact,
} = require("../../models/contacts");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const contactsList = await listContacts();
  // res.status(200).json(JSON.stringify(contactsList));
  res.status(200).json(contactsList);
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const filteredContact = await getContactById(contactId);

  res.status(200).json(filteredContact);
});

router.post("/", async (req, res, next) => {
  // Joi
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        // tlds: { allow: ["com", "net"] },
      })
      .required(),
    phone: Joi.string()
      .min(3)
      .max(15)
      .pattern(/^[0-9-()+ ]+$/)
      .required(),
  });
  const valodationResult = schema.validate(req.body);

  if (valodationResult.error) {
    return res.status(400).json({ message: "missing required name field" });
  }
  // Joi end

  const { id, name, email, phone } = await addContact(req.body);

  res.status(201).json({
    id,
    name,
    email,
    phone,
  });
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  await removeContact(contactId);

  res.status(200).json({ message: "contact deleted" });
});

router.put("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;

  // Joi
  const schema = Joi.object({
    name: Joi.string().min(3).max(30),
    email: Joi.string().email({
      minDomainSegments: 2,
    }),
    phone: Joi.string()
      .min(3)
      .max(15)
      .pattern(/^[0-9-()+ ]+$/),
  }).min(1);
  const valodationResult = schema.validate(req.body);

  if (valodationResult.error) {
    return res.status(400).json({ message: "missing fields" });
  }
  // Joi end

  const updatedContact = await updateContact(contactId, req.body);

  res.status(200).json(updatedContact);
});

module.exports = router;
