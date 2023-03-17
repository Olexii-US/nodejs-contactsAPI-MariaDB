const express = require("express");
// controllers //
const {
  getContacts,
  getOneContactById,
  postContact,
  deleteContact,
  putContact,
} = require("../../controllers/contactsControllers");
const { asyncWrapper } = require("../../helpers/tryCatchHelper");

// middleware //
const {
  postContactValidation,
  putContactValidation,
} = require("../../middleware/validationMdlw");

const router = express.Router();

router.get("/", asyncWrapper(getContacts));

router.get("/:id", asyncWrapper(getOneContactById));

router.post("/", postContactValidation, asyncWrapper(postContact));

router.delete("/:id", asyncWrapper(deleteContact));

router.put("/:id", putContactValidation, asyncWrapper(putContact));

module.exports = router;
