const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ["Absent", "Late", "Quarrel"],
    require: [true, "Please provide a name for this ticket"],
  },
  date: Date,
  fee: Number,
  status: {
    type: String,
    enum: ["settled", "pending"],
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workforce",
  },
});

const Issue = mongoose.model("Issue", issueSchema);

module.exports = Issue;
