const express = require("express");
const { upload } = require("../services/fileUpload");

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

const {
  addWorkforce,
  addWorkforceImage,
  getWorkforce,
  getAllWorkforce,
  getWorkforceByFilter,
} = require("../controllers/workforceController");

//AUTH ROUTES
router.route("/register").post(register);
router.route("/login").post(login);

//WORKFORCE
router
  .route("/workforce")
  .get(protect, getAllWorkforce)
  .post(protect, addWorkforce)
  .patch(protect)
  .delete(protect, restrictTo(["lp"]));
router.route("/workforce/:filter").get(protect, getWorkforceByFilter);
router
  .route("/workforce/:id/upload-image")
  .put(protect, upload.single("image"), addWorkforceImage);
router.route("/workforce/:id").get(protect, getWorkforce).patch().delete();

//SERVICE
router.route("/services").get().post();
router.route("/service/:id").get().patch().delete();

//ISSUE
router.route("/issues").get().post();
router.route("/issue/:id").get().patch().delete();

//REPORT
router.route("/reports").get().post();
router.route("/report/:id").get().patch().delete();

//ADMIN ROUTES

module.exports = router;
