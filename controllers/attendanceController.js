const Attendance = require("../models/attendanceModel");
const Service = require("../models/serviceModel");
const Workforce = require("../models/workforceModel");
const AppError = require("../utilities/appError");
const { asyncWrapper } = require("../utilities/async");
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
  await service?.addAttendance(attendance._id);
  createRes(attendance, 201, res);
});

exports.clockInWorkforceMember = asyncWrapper(async (req, res, next) => {
  const workforceID = req.body.workforceID;
  const attendanceID = req.params.id;
  const attendance = await Attendance.findById(attendanceID).exec();
  const workforce = await Workforce.findById(workforceID).exec();
  const time = Date.now() - 1000;
  if (!attendance) {
    return next(new AppError("Attendance could not be found", 404));
  }
  if (!workforce) {
    return next(new AppError("Workforce could not be found", 404));
  }
  const clockedIn = await attendance.clockIn({ person: workforceID, time });
  if (clockedIn) {
    await workforce
      .clockIn(attendanceID)
      .then((data) => createRes(attendance.present, 200, res));
  } else {
    return next(new AppError("Workforce already clocked In", 401));
  }
});

exports.clockOutWorkforceMember = asyncWrapper(async (req, res, next) => {
  const workforceID = req.body.workforceID;
  const attendanceID = req.params.id;
  const attendance = await Attendance.findById(attendanceID).exec();
  const workforce = await Workforce.findById(workforceID).exec();
  const time = Date.now() - 1000;
  if (!attendance) {
    return next(new AppError("Attendance could not be found", 404));
  }
  if (!workforce) {
    return next(new AppError("Workforce could not be found", 404));
  }
  await attendance
    ?.clockOut({ workforce, time })
    .then((data) => createRes(attendance.clockout, 200, res));
});

exports.getAttendance = asyncWrapper(async (req, res, next) => {
  const id = req.params.id;
  const attendance = await Attendance.findById(id).exec();
  if (!attendance) {
    return next(new AppError("Attendance member not found", 404));
  } else {
    createRes(attendance, 200, res);
  }
});

exports.getAllAttendances = asyncWrapper(async (req, res, next) => {
  const attendance = await Attendance.find();
  if (!attendance) {
    return next(new AppError("Attendance members not found", 404));
  }
  createRes(attendance, 200, res);
});
