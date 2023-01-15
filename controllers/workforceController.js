const Workforce = require("../models/workforceModel");
const { asyncWrapper } = require("../utilities/async");
const AppError = require("../utilities/appError");

exports.addWorkforce = asyncWrapper(async (req, res, next) => {
  const workforce = await Workforce.create({
    phone: req.body.phone,
    title: req.body.title,
    email: req.body.email,
    dob: req.body.dob,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    middleName: req.body.middleName,
    department: req.body.department,
    group: req.body.group,
    heirarchy: req.body.heirarchy,
  });
  if (!workforce) {
    res.status(400).json({
      message: "Workforce member could not be added",
    });
  }
  res.status(201).json({
    status: "success",
    data: { workforce },
  });
  next();
});

exports.addWorkforceImage = asyncWrapper(async (req, res, next) => {
  const id = req.params.id;
  const image = `https://${req.get("host")}/${req.file.path}`;
  const workforce = await Workforce.findById(id).exec();
  if (!workforce) {
    return res.status(404).json({
      message: "Workforce member not found",
    });
  } else {
    const upload = await workforce.addImage(image);
    if (upload) {
      return res.status(200).json({
        path: image,
      });
    }
  }
});
