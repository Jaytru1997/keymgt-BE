const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    unique: true,
    required: [true, "Create a service first before making an attendance"],
  },
  present: [
    {
      person: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workforce",
        unique: true,
      },
      time: Date,
    },
  ],
  absent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workforce",
      unique: true,
    },
  ],
  clockout: [
    {
      person: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workforce",
        unique: true,
      },
      time: Date,
    },
  ],
});

attendanceSchema.pre(/^find/, function (next) {
  this.populate(["present.person", "absent", "clockout.person"]);
  next();
});

attendanceSchema.methods.filterWorkforce = async function (array, object, key) {
  let newArray = array.filter((el) => el[key] == object[key]);
  return newArray;
};

attendanceSchema.methods.clockIn = async function (data) {
  try {
    let isDuplicate = await this.filterWorkforce(this.present, data, "person");
    // console.log(isDuplicate);
    if (isDuplicate.length > 0) {
      return 0;
    } else {
      await this.present.push(data);
      this.save({ validateBeforeSave: false });
      return 1;
    }
  } catch (error) {
    return false, error;
  }
};

attendanceSchema.methods.clockOut = async function (data) {
  try {
    await this.clockout.push(data);
    this.save({ validateBeforeSave: false });
  } catch (error) {
    return false, error;
  }
};

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
