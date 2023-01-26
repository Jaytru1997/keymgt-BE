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

const {
  addAttendance,
  clockInWorkforceMember,
  clockOutWorkforceMember,
  getAttendance,
  getAllAttendances,
} = require("../controllers/attendanceController");

//AUTH ROUTES
router.route("/register").post(register);
router.route("/login").post(login);

//WORKFORCE
router
  .route("/workforce")
  .get(protect, getAllWorkforce)
  .post(protect, addWorkforce);
router
  .route("/workforce/:id/upload-image")
  .put(protect, upload.single("image"), addWorkforceImage);
router
  .route("/workforce/:filter")
  .get(protect, getWorkforceByFilter)
  .patch()
  .delete(protect, restrictTo(["lp", "assoc"]), deleteWorkforce);

//SERVICE
router
  .route("/services")
  .get(protect, getAllServices)
  .post(protect, addService);
router
  .route("/service/:filter")
  .get(protect, getServicesByFilter)
  .patch(protect, editService)
  .delete(protect);

//ATTENDANCE
router
  .route("/attendances")
  .get(protect, getAllAttendances)
  .post(protect, addAttendance);
router
  .route("/attendance/:id")
  .get(protect, getAttendance)
  .post(protect)
  .put(protect, clockInWorkforceMember)
  .patch(protect, clockOutWorkforceMember);

//ISSUE
router.route("/issues").get().post();
router.route("/issue/:id").get().patch().delete();

//REPORT
router.route("/reports").get().post();
router.route("/report/:id").get().patch().delete();

//ADMIN ROUTES

module.exports = router;
