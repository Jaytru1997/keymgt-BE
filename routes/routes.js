const express = require("express");
const path = require("path");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Uploads is the Upload_folder_name
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
    // + ".jpg"
  },
});

// Define the maximum size for uploading
// picture i.e. 1 MB. it is optional
const maxSize = 1 * 1000 * 1000;

const upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: function (req, file, cb) {
    // Set the filetypes, it is optional
    var filetypes = /jpeg|jpg|png/;
    var mimetype = filetypes.test(file.mimetype);

    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      let submit = cb(null, true);
      return submit;
    }

    cb(
      "Error: File upload only supports the " +
        "following filetypes - " +
        filetypes
    );
  },
});

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
} = require("../controllers/workforceController");

//AUTH ROUTES
router.route("/register").post(register);
router.route("/login").post(login);

//WORKFORCE
router
  .route("/workforce")
  .get()
  .post(protect, addWorkforce)
  .patch(protect)
  .delete(protect, restrictTo(["lp"]));
router
  .route("/workforce/:id/upload-image")
  .put(protect, upload.single("image"), addWorkforceImage);
router.route("/workforce:id").get().patch().delete();

//SERVICE
router.route("/services").get().post();
router.route("/service:id").get().patch().delete();

//ISSUE
router.route("/issues").get().post();
router.route("/issue:id").get().patch().delete();

//REPORT
router.route("/reports").get().post();
router.route("/report:id").get().patch().delete();

//ADMIN ROUTES

module.exports = router;
