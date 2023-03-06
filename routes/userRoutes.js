const express = require("express");

const router = express.Router();

const {
  registerUser,
  currentUser,
  loginUser,
} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.get("/current",validateToken,currentUser);

module.exports = router;
