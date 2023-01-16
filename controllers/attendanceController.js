const Attendance = require("../models/attendanceModel");
const Service = require("../models/serviceModel");
const { asyncWrapper } = require("../utilities/async");
const AppError = require("../utilities/appError");
const { createRes } = require("../utilities/responses");

exports.addAttendance = asyncWrapper(async (req, res, next) => {
  const attendance = await Attendance.create({
    service: req.body.service,
  });
  const serviceID = req.body.service;
  const service = await Service.findById(serviceID);
  if (!attendance) {
    return next(new AppError("Attendance could not be created", 404));
  }
  if (!service) {
    return next(new AppError("Service not found", 404));
  }
  await service.addAttendance(attendance._id);
  createRes(attendance, 201, res);
});
