const mongoose = require("mongoose");
const validator = require("validator");

const workforceSchema = new mongoose.Schema({
  image: {
    type: String,
    default: "image",
  },
  phone: {
    type: String,
    required: [true, "Please enter a valid phone number"],
  },
  title: {
    type: String,
    required: [true, "Please select a status for this workforce member"],
    enum: ["Pst.", "Mr.", "Mrs.", "Master", "Ms.", "Dr.", "Min."],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  dob: {
    type: String,
    required: [
      true,
      "Please provide the date of birth of this workforce member e.g DD-MM-YYYY",
    ],
  },
  firstName: {
    type: String,
    required: [true, "Please provide the first name of this workforce member"],
  },
  lastName: {
    type: String,
    required: [true, "Please provide the last name of this workforce member"],
  },
  middleName: String,
  name: String,
  department: {
    type: String,
    default: "evangelism",
  },
  group: {
    type: String,
    required: [true, "Please provide the group of this workforce member"],
  },
  heirarchy: {
    type: String,
    enum: ["Member", "Dept. H", "Group H", "Pastor"],
  },
  tickets: {
    count: {
      type: Number,
      default: 0,
    },
    issues: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Issue",
      },
    ],
  },
  excuse: {
    status: {
      type: Boolean,
      default: false,
    },
    description: String,
    begin: Date,
    end: Date,
    duration: Number,
  },
  services: {
    count: {
      type: Number,
      default: 0,
    },
    attendance: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attendance",
        unique: true,
      },
    ],
  },
});

workforceSchema.pre("save", function (next) {
  let initials;
  if (this.heirarchy === "Group H") this.department = "all";
  this.middleName !== ""
    ? (initials = `${this.middleName.charAt(0)}.`)
    : (initials = "");
  this.name = `${this.firstName} ${initials} ${this.lastName}`;
  next();
});

workforceSchema.methods.addImage = async function (image) {
  try {
    this.image = await image;
    return true;
  } catch (error) {
    return false, error;
  }
};

workforceSchema.methods.clockIn = async function (id) {
  try {
    await this.services.attendance.push(id);
    this.services.count++;
    this.save({ validateBeforeSave: false });
  } catch (error) {
    return false, error;
  }
};

const Workforce = mongoose.model("Workforce", workforceSchema);

module.exports = Workforce;
