const Report = require("../models/Report"); // Corrected model import
const User = require("../models/User");
const admin = require("firebase-admin"); // Assuming you have initialized Firebase Admin SDK elsewhere

exports.postReport = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const decodedToken = await admin.auth().verifyIdToken(authHeader);
    const email = decodedToken.email;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
    }

    const { report } = req.body; // Corrected field name
    const user_id = user._id;
    const user_name = user.name;
    const completed = false;

    const newReport = new Report({
      user_id,
      user_name,
      report,
      completed,
    });

    await newReport.save();
    return res.status(201).json(newReport);
  } catch (err) {
    console.error("Error in postReview:", err); // Log the error for debugging
    res.status(500).json({ message: "Internal Server Error" }); // Generic error response
  }
};

exports.getPendingReports = async (req, res) => {
  try {
    const pendingReports = await Report.find({ completed: false })
      .sort({ timestamp: -1 }) // Sorting by timestamp in descending order
      .exec();

    return res.status(200).json(pendingReports);
  } catch (err) {
    console.error("Error in getPendingReviews:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.markReportCompleted = async (req, res) => {
  try {
    const { reviewId } = req.params; // Assuming the reviewId is passed as a parameter in the route

    const updatedReport = await Report.findByIdAndUpdate(
      reviewId,
      { completed: true },
      { new: true } // To return the updated document
    );

    if (!updatedReport) {
      return res.status(404).json({ message: "Review not found" });
    }

    return res.status(200).json(updatedReport);
  } catch (err) {
    console.error("Error in markReviewCompleted:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
