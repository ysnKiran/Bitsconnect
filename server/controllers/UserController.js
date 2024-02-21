const User = require("../models/User");
const admin = require("firebase-admin");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
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
      const applied_projects = user.applied_projects;
      res.status(200).json(applied_projects);
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
      const selected_projects = user.selected_projects;
      res.status(200).json(selected_projects);
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

    if (user) {
      const { project_id, proposal } = req.body;
      const alreadyApplied = user.applied_projects.some(
        (appliedProject) => appliedProject.project_id.toString() === project_id
      );

      if (alreadyApplied) {
        return res
          .status(400)
          .json({ message: "You have already applied for this project." });
      }

      user.applied_projects.push({ project_id, proposal });
      await user.save(); // Save the updated user document
      return res.status(200).json({ message: "Applied Successfully" });
    } else {
      return res.status(400).json({ message: "User not found" });
    }
  } catch (err) {
    return res.status(400).json({ message: err });
  }
};
