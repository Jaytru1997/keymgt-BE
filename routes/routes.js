const express = require("express");
const router = express.Router();
const {
  register,
  login,
  protect,
  restrictTo,
  restrictUser,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require("../controllers/authController");

//AUTH ROUTES
router.route("/register").post(register);
router.route("/login").post(login);

//ADMIN ROUTES

module.exports = router;
