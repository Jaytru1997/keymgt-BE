const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title for your report e.g dd/mm/yyyy"],
  },
  date: {
    type: Date,
  },
  body: {
    type: String,
    required: [true, "Your report description cannot be empty"],
  },
  status: {
    type: String,
    required: true,
    enum: ["vetted", "unvetted"],
    default: "unvetted",
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide an author name for this report"],
  },
});

reportSchema.pre("save", function (next) {
  this.date = Date.now() - 1000;
  next();
});

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
