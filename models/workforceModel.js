const mongoose = require("mongoose");
const validator = require("validator");

const workforceSchema = new mongoose.Schema({
  image: String,
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
    type: Date,
    required: [
      true,
      "Please provide the date of birth of this workforce member",
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
  services: [
    {
      title: {
        type: String,
        required: [
          true,
          "Please provide a title for your service e.g Empowerment",
        ],
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
        required: [true, "Please provide a valid time e.g 12:00 PM"],
      },
    },
  ],
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
