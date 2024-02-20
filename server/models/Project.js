const mongoose = require("mongoose");

const ProjectSchema = mongoose.Schema({
  alumni_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Alumni",
  },
  pay: {
    type: Number,
    require: true,
  },
  // Will have to check this
  duration: {
    type: Number,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
});

const ProjectModel = mongoose.model("Project", ProjectSchema);
module.exports = ProjectModel;
