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

// STATIC ROUTES

//AUTH ROUTES

//ADMIN ROUTES

module.exports = router;
