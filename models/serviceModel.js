const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title for your service e.g Empowerment"],
  },
  date: {
    type: Date,
  },
  day: {
    type: String,
    enum: [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ],
    required: [true, "Please provide a day for your service"],
  },
  time: {
    type: String,
    required: [true, "Please provide a valid service time e.g 12:00 PM"],
  },
  reports: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
    },
  ],
  attendance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Attendance",
  },
});

// serviceSchema.pre("save", function (next) {
//   this.time = Date.now() - 1000;
//   next();
// });

serviceSchema.methods.addAttendance = async function (id) {
  this.attendance = await id;
  this.save({ validateBeforeSave: false });
};

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
