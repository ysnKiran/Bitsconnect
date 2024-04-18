const mongoose = require("mongoose");

const ReportSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  user_name: {
    type: String,
  },
  report: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  completed: {
    type: Boolean,
  },
});

const ReportModel = mongoose.model("Report", ReportSchema);
module.exports = ReportModel;
