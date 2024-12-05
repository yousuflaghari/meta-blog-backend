const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const bcrypt = require("bcrypt"); // For password hashing
const jwt = require("jsonwebtoken"); // For generating access tokens

const User = require("./models/Users");
const blogRoutes = require("./routes/blog"); // Adjust path as necessary
const userRoutes = require("./routes/users"); // Adjust path as necessary

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.use("/blogs", blogRoutes);
app.use("/users", userRoutes);

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/blog-db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare provided password with stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate an access token
    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      "process.env.JWT_SECRET", // Make sure to set this in your environment variables
      { expiresIn: "1h" }
    );

    // Respond with user data and token
    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name, // Assuming `name` exists in the schema
      },
      accessToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Start the server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

module.exports = app;
