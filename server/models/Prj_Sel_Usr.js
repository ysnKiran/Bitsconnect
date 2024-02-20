const mongoose = require("mongoose");

const Prj_Sel_UsrSchema = mongoose.Schema({
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },

  user_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Prj_Sel_Usr_Model = mongoose.model("Prj_Sel_Usr", Prj_Sel_UsrSchema);
module.exports = Prj_Sel_Usr_Model;
