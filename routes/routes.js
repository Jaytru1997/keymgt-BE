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
  deleteWorkforce,
} = require("../controllers/workforceController");

const {
  addService,
  editService,
  getService,
  getAllServices,
  getServicesByFilter,
} = require("../controllers/serviceController");

//AUTH ROUTES
router.route("/register").post(register);
router.route("/login").post(login);

//WORKFORCE
router
  .route("/workforce")
  .get(protect, getAllWorkforce)
  .post(protect, addWorkforce);
router.route("/workforce/:filter").get(protect, getWorkforceByFilter);
router
  .route("/workforce/:id/upload-image")
  .put(protect, upload.single("image"), addWorkforceImage);
router
  .route("/workforce/:id")
  .get(protect, getWorkforce)
  .patch()
  .delete(protect, restrictTo(["lp", "assoc"]), deleteWorkforce);

//SERVICE
router
  .route("/services")
  .get(protect, getAllServices)
  .post(protect, addService);
router.route("/services/:filter").get(protect, getServicesByFilter);
router
  .route("/service/:id")
  .get(protect, getService)
  .patch(protect, editService)
  .delete(protect);

//ISSUE
router.route("/issues").get().post();
router.route("/issue/:id").get().patch().delete();

//REPORT
router.route("/reports").get().post();
router.route("/report/:id").get().patch().delete();

//ADMIN ROUTES

module.exports = router;
