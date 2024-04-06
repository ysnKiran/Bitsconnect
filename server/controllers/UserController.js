const User = require("../models/User");
const admin = require("firebase-admin");
const Project = require("../models/Project");
const sendEmail = require("../service/transporter");

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

exports.getRejectedProjects = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const decodedToken = await admin.auth().verifyIdToken(authHeader);
    const email = decodedToken.email;
    const user = await User.findOne({ email: email });
    if (user) {
      const rejectedProjectIds = user.rejected_projects.map(
        (rejectedProject) => rejectedProject.project_id
      );

      const projects = await Project.find({ _id: { $in: rejectedProjectIds } });

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
    const projectName = project.title;
    const email2 = project.alumni_email;
    const alumni = project.alumni_name;

    if (user && project) {
      const alreadyApplied = user.applied_projects.some(
        (appliedProject) => appliedProject.project_id.toString() === project_id
      );

      const alreadySelected = user.selected_projects.some(
        (selectedProject) =>
          selectedProject.project_id.toString() === project_id
      );

      if (alreadyApplied || alreadySelected) {
        return res.status(400).json({ message: "Applied or selected" });
      }

      user.applied_projects.push({ project_id, proposal });
      await user.save();
      project.applied_users.push({ user_id: user._id });
      await project.save();

      const subject = "Application Successful";
      const body = `Dear ${user.name},\n\nWe're pleased to inform you that your application for the project: ${projectName} has been successfully submitted.Thank you for your interest in the project.\n\n${alumni} will review your application and get back to you soon.\n\nBest regards,\nBITSConnect`;

      await sendEmail(email, subject, body);

      const subject2 = "New Application";
      const body2 = `Dear ${project.alumni_name},\n\nYou have a new application for your project: ${projectName}.\n\nPlease review the application and take appropriate action.\n\nBest regards,\nBITSConnect`;
      console.log("Subject:", subject2);

      await sendEmail(email2, subject2, body2);

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
    console.log(req);
    const authHeader = req.headers.authorization;
    const decodedToken = await admin.auth().verifyIdToken(authHeader);
    const email = decodedToken.email;
    const user = await User.findOne({ email: email });
    const { name, resume_link } = req.body;
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    user.name = name;

    // Added for Batch year calculation
    const batchYear = parseInt(email.substring(1, 5), 10);
    user.batch_year = isNaN(batchYear) ? 0 : batchYear;

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
      //console.log(user._id);

      // Remove user from the applied_users array of the project
      const project = await Project.findOne({ _id: project_id });
      // console.log(project);
      if (!project) {
        return res.status(400).json({ message: "Project not found" });
      }

      const appliedUsersIndex = project.applied_users.findIndex(
        (appliedUser) => appliedUser.user_id.toString() === user._id.toString()
      );

      // console.log(appliedUsersIndex);
      if (appliedUsersIndex > -1) {
        project.applied_users.splice(appliedUsersIndex, 1);
        await project.save();
      }

      return res.status(200).json(user);
    } else {
      return res
        .status(400)
        .json({ message: "Project not found in applied projects" });
    }
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const decodedToken = await admin.auth().verifyIdToken(authHeader);
    const email = decodedToken.email;
    const user = await User.findOne({ email: email });
    const user_id = user._id;
    const { project_id } = req.params;

    if (user) {
      // Remove project_id from applied_projects of user
      await User.findByIdAndUpdate(user_id, {
        $pull: { applied_projects: { project_id: project_id } },
      });

      // Remove user_id from applied_users of project
      await Project.findByIdAndUpdate(project_id, {
        $pull: { applied_users: { user_id: user_id } },
      });

      return res
        .status(200)
        .json({ message: "Application deleted successfully" });
    }
    res.status(400).json({ message: "User Not found" });
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
