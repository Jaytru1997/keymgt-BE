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

attendanceSchema.pre("save", async function (next) {
  this.present.forEach((entry) => {
    entry.time = Date.now() - 1000;
  });
  next();
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
