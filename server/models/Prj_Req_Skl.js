const mongoose = require("mongoose");

const Prj_Req_SklSchema = mongoose.Schema({
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  skill_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
    },
  ],
});

const Prj_Req_Skl_Model = mongoose.model("Prj_Req_Skl", Prj_Req_SklSchema);
module.exports = Prj_Req_Skl_Model;
