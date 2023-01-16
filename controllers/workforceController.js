const Workforce = require("../models/workforceModel");
const { asyncWrapper } = require("../utilities/async");
const AppError = require("../utilities/appError");
const { createRes } = require("../utilities/responses");

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
    return next(new AppError("Workforce member could not be added", 404));
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
    return next(new AppError("Workforce member not found", 404));
  } else {
    const upload = await workforce.addImage(image);
    await workforce.save({ validateBeforeSave: false });
    if (upload) {
      return res.status(200).json({
        path: image,
      });
    }
  }
});

exports.getWorkforce = asyncWrapper(async (req, res, next) => {
  const id = req.params.id;
  // console.log(id);
  const workforce = await Workforce.findById(id).exec();
  if (!workforce) {
    return next(new AppError("Workforce member not found", 404));
  } else {
    res.status(200).json({ workforce });
  }
});

exports.getAllWorkforce = asyncWrapper(async (req, res, next) => {
  const workforce = await Workforce.find();
  if (!workforce) {
    return next(new AppError("Workforce members not found", 404));
  }
  createRes(workforce, 200, res);
});

exports.getWorkforceByFilter = asyncWrapper(async (req, res, next) => {
  const filter = req.params.filter;
  const workforce = await Workforce.find({
    $or: [
      { group: filter },
      { department: filter },
      { heirarchy: filter },
      { title: filter },
    ],
  });
  if (!workforce) {
    return next(new AppError("Workforce members not found", 404));
  } else {
    res.status(200).json({ workforce });
  }
});
