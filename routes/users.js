var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
var User = require("../models/Users");

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await users.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err });
  }
});

// Create a new user
router.post("/", async (req, res) => {
  try {
    const { name, email, password, user_name } = req.body;

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      user_name,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Respond with the saved user (exclude the password in the response)
    res.status(201).json({
      id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      user_name: savedUser.user_name,
    });
  } catch (err) {
    console.error("Error creating user:", err);
    res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
});

module.exports = router;
