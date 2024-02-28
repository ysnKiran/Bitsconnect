const User = require("../models/User");
const admin = require("firebase-admin");
const Project = require("../models/Project");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const decodedToken = await admin.auth().verifyIdToken(authHeader);
    const email = decodedToken.email;
    const user = await User.findOne({ email: email });  
    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.getAppliedProjects = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const decodedToken = await admin.auth().verifyIdToken(authHeader);
    const email = decodedToken.email;
    const user = await User.findOne({ email: email });
    if (user) {
      const appliedProjectIds = user.applied_projects.map(
        (appliedProject) => appliedProject.project_id
      );

      const projects = await Project.find({ _id: { $in: appliedProjectIds } });

      res.status(200).json(projects);
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.getSelectedProjects = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const decodedToken = await admin.auth().verifyIdToken(authHeader);
    const email = decodedToken.email;
    const user = await User.findOne({ email: email });
    if (user) {
      const selectedProjectIds = user.selected_projects.map(
        (selectedProject) => selectedProject.project_id
      );

      const projects = await Project.find({ _id: { $in: selectedProjectIds } });

      res.status(200).json(projects);
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.applyForProject = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const decodedToken = await admin.auth().verifyIdToken(authHeader);
    const email = decodedToken.email;
    const user = await User.findOne({ email: email });
    const { project_id, proposal } = req.body;
    const project = await Project.findOne({ _id: project_id });

    if (user && project) {
      const alreadyApplied = user.applied_projects.some(
        (appliedProject) => appliedProject.project_id.toString() === project_id
      );

      if (alreadyApplied) {
        return res
          .status(400)
          .json({ message: "You have already applied for this project." });
      }

      user.applied_projects.push({ project_id, proposal });
      await user.save(); 
      project.applied_users.push({user_id:user._id});
      await project.save();
      return res.status(200).json({ message: "Applied Successfully" });
    } else {
      return res.status(400).json({ message: "User not found" });
    }
  } catch (err) {
    return res.status(400).json({ message: err });
  }
};

exports.updateDetails = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const decodedToken = await admin.auth().verifyIdToken(authHeader);
    const email = decodedToken.email;
    const user = await User.findOne({ email: email });
    const { name,resume_link } = req.body;
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    user.name = name;

    // Added for Batch year calculation
    user.batch_year=email.substring(1, 5);
    
    user.resume_link = resume_link;
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.removeProject = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const decodedToken = await admin.auth().verifyIdToken(authHeader);
    const email = decodedToken.email;
    const user = await User.findOne({ email: email });
    const { project_id } = req.body;
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const applied_projects = user.applied_projects;
    const index = applied_projects.findIndex(
      (project) => project.project_id.toString() === project_id
    );
    if (index > -1) {
      applied_projects.splice(index, 1);
      await user.save();
      return res.status(200).json(user);
    } else {
      return res.status(400).json({ message: err });
    }
  } catch (err) {
    res.status(400).json({ message: err });
  }
};
