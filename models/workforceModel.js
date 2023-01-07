const mongoose = require("mongoose");
const validator = require("validator");

const workforceSchema = new mongoose.Schema({
  image: String,
  phone: {
    type: String,
    required: [true, "Please enter a valid phone number"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: [validator.isEmail, "Please provide a valid email"],
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
    required: [true, "Please provide the department of this workforce member"],
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
    count: Number,
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
  serviceCount: Number,
});

workforceSchema.pre("save", function (next) {
  let initials;
  Number(this.middleName) > 0
    ? (initials = `${this.middleName.charAt(0)}.`)
    : (initials = "");
  this.name = `${this.firstName} ${initials} ${this.lastName}`;
  next();
});

// workforceSchema.pre("save", function(next){
//multerImage() will return a url to the save path of user image;
//   this.image = multerImage();
// })

const Workforce = mongoose.model("Workforce", workforceSchema);

module.exports = Workforce;
