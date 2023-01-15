const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
  },
  present: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workforce",
    },
  ],
  absent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workforce",
    },
  ],
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
