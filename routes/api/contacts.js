const express = require("express");
// controllers //
const {
  getContacts,
  getOneContactById,
  postContact,
  deleteContact,
  putContact,
  patchFavoriteContact,
} = require("../../controllers/contactsControllers");
const { asyncWrapper } = require("../../helpers/tryCatchHelper");
const { protectedWithToken } = require("../../middleware/isTokenValid");

// middleware //
const {
  postContactValidation,
  putContactValidation,
  favoriteContactValidation,
  queryContactValidation,
} = require("../../middleware/validationMdlw");

const router = express.Router();

router.use(protectedWithToken);

router.get("/", queryContactValidation, asyncWrapper(getContacts));

router.get("/:id", asyncWrapper(getOneContactById));

router.post("/", postContactValidation, asyncWrapper(postContact));

router.delete("/:id", asyncWrapper(deleteContact));

router.put("/:id", putContactValidation, asyncWrapper(putContact));

router.patch(
  "/:id/favorite",
  favoriteContactValidation,
  asyncWrapper(patchFavoriteContact)
);

module.exports = router;
