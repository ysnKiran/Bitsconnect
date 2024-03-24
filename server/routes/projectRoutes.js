const express = require("express");
const router = express.Router();
const ProjectController = require("../controllers/ProjectController");

router.get("/projects", ProjectController.getAllProjects);
router.post("/newProject", ProjectController.createProject);
router.get("/myProjects", ProjectController.getProjectsByUser);
router.get("/getApplicationsByProject/:project_id", ProjectController.getApplicationsByProject);
router.get("/getSelectedApplicationsByProject/:project_id",ProjectController.getSelectedApplicationsByProject);
router.post("/applyUser",ProjectController.changeSelectToApply);
router.post("/rejectUser",ProjectController.changeSelectToReject);
router.put("/updateProject/:project_id", ProjectController.updateProject);
router.delete("/deleteProject/:project_id", ProjectController.deleteProject);
router.post('/filter', ProjectController.filterProjects);

module.exports = router;
