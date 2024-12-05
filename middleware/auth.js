const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get the token from the Authorization header

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token with your secret key
    req.user = decoded; // Attach the user payload to the request object
    next();
  } catch (err) {
    res
      .status(403)
      .json({ message: "Invalid or expired token", error: err.message });
  }
};

module.exports = authenticateUser;
