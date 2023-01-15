const multer = require("multer");

// var upload = multer({ dest: "Upload_folder_name" })

exports.uploader = function () {
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Uploads is the Upload_folder_name
      cb(null, "public/uploads");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now());
      // + ".jpg"
    },
  });

  // https://${req.get("host")}/public/uploads/

  // Define the maximum size for uploading
  // picture i.e. 1 MB. it is optional
  const maxSize = 1 * 1000 * 1000;

  multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb) {
      // Set the filetypes, it is optional
      var filetypes = /jpeg|jpg|png/;
      var mimetype = filetypes.test(file.mimetype);

      var extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
      );

      if (mimetype && extname) {
        let submit = cb(null, true);
        console.log(submit);
        return submit;
      }

      cb(
        "Error: File upload only supports the " +
          "following filetypes - " +
          filetypes
      );
    },

    //req.file holds the file uploaded
  }).single("userPhoto");
};
