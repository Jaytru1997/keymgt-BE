const Service = require("../models/serviceModel");
const { asyncWrapper } = require("../utilities/async");
const AppError = require("../utilities/appError");
const { createRes } = require("../utilities/responses");

exports.addService = asyncWrapper(async (req, res, next) => {
  const service = await Service.create({
    title: req.body.title,
    date: req.body.date,
    day: req.body.day,
    time: req.body.time,
  });
  if (!service) {
    return next(new AppError("Service could not be added", 404));
  }
  createRes(service, 201, res);
});

exports.editService = asyncWrapper(async (req, res, next) => {
  const id = req.params.id;
  const service = await Service.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  }).exec();
  await service.save({ validateBeforeSave: false });
  if (!service) {
    return next(new AppError("Service not found", 404));
  } else {
    createRes(service, 200, res);
  }
});

exports.getService = asyncWrapper(async (req, res, next) => {
  const id = req.params.id;
  // console.log(id);
  const service = await Service.findById(id).exec();
  if (!service) {
    return next(new AppError("Service member not found", 404));
  } else {
    createRes(service, 200, res);
  }
});

exports.getAllServices = asyncWrapper(async (req, res, next) => {
  const service = await Service.find();
  if (!service) {
    return next(new AppError("Service members not found", 404));
  }
  createRes(service, 200, res);
});

exports.getServicesByFilter = asyncWrapper(async (req, res, next) => {
  const filter = req.params.filter;
  const service = await Service.find({
    $or: [{ title: filter }, { day: filter }, { time: filter }],
  });
  if (!service) {
    return next(new AppError("Services not found", 404));
  } else if (service.length === 0) {
    return next(new AppError("No services match your search", 404));
  } else {
    createRes(service, 200, res);
  }
});
