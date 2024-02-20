const User = require("../models/User");

exports.Auth = async (req, res) => {
  try {
    const { name, email } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      console.log("No User found");
      batch_year = 2020;
      resume_link = "hello";
      user = new User({
        name,
        email,
        batch_year,
        resume_link,
      });
      await user.save();
    } else {
      console.log(`User with ${email} found`);
    }

    // Respond with a success message
    res.status(200).json({ message: "User authenticated successfully" });
  } catch (error) {
    // If an error occurs, respond with an error message
    console.error("Error in authentication:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
