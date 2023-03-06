const express = require("express");
const {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();

router.use(validateToken);

router.route("/").get(getContacts).post(createContact);
router
  .route("/:id")
  .put(updateContact)
  .delete(deleteContact)
  .get(getContactById);

module.exports = router;
