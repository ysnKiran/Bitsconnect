const mongoose = require("mongoose");

const SkillSchema = mongoose.Schema({
  skill_name: {
    type: String,
    require: true,
  },
});

const SkillModel = mongoose.model("Skill", SkillSchema);
module.exports = SkillModel;
