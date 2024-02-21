const express = require("express");
const router = express.Router();
const ProjectController = require("../controllers/ProjectController");

router.get("/projects", ProjectController.getAllProjects);
router.post("/newProject", ProjectController.createProject);
router.get("/myProjects", ProjectController.getProjectsByUser);

module.exports = router;
