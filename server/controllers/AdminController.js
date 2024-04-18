exports.login = (req, res) => {
  const { username, password } = req.body;

  // Check if username and password match
  if (username === "admin" && password === "admin") {
    // If match, send a JSON response with OK status
    res.status(200).json({ message: "Valid" });
  } else {
    // If not match, send a JSON response with Unauthorized status
    res.status(401).json({ error: "Invalid credentials" });
  }
};
