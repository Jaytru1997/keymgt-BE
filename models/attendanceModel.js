const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
  },
  present: [
    {
      person: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workforce",
      },
      time: Date,
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
