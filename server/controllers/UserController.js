const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
  const users = await User.find({});
  const size = users.length;
  console.log(`${size} Users Found`);
  res.status(200).json(users);
};
