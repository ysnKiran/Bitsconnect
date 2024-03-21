const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

router.get("/users", UserController.getAllUsers);
router.get("/myAppliedProjects", UserController.getAppliedProjects);
router.get("/mySelectedProjects", UserController.getSelectedProjects);
router.get("/myRejectedProjects", UserController.getRejectedProjects);
router.post("/apply", UserController.applyForProject);
router.put("/updateDetails", UserController.updateDetails);
router.get("/getUserByID", UserController.getUserById);
router.post("/removeProject", UserController.removeProject);
router.delete("/deleteApplication/:project_id",UserController.deleteApplication);

module.exports = router;
