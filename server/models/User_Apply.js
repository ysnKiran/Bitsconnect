const mongoose = require("mongoose");

const User_Apply_Schema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  proposal: {
    type: String,
    require: true,
  },
});

const User_Apply_Model = mongoose.model("User_Apply", User_Apply_Schema);
module.exports = User_Apply_Model;
