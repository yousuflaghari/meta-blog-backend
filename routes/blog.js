var express = require("express");
var router = express.Router();

const Blog = require("../models/Blogs"); // Import your Blog model
const authenticateUser = require("../middleware/auth");

// Get all blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().populate("userId", "name email");
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err });
  }
});

// Delete a blog by ID
router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params; // Extract blog ID from request parameters
    const userId = req.user.id; // Extract user ID from the authenticated request

    // Find the blog by ID
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check if the logged-in user is the owner of the blog
    if (blog.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this blog" });
    }

    // Delete the blog
    const deletedBlog = await Blog.findByIdAndDelete(id);

    res.status(200).json({
      message: "Blog deleted successfully",
      blog: deletedBlog,
    });
  } catch (err) {
    console.error("Error deleting blog:", err);
    res.status(500).json({
      message: "Error deleting blog",
      error: err.message,
    });
  }
});

// Get a single blog by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params; // Extract id from request parameters
    const blog = await Blog.findById(id); // Use findById for better readability

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(blog);
  } catch (err) {
    console.error("Error fetching blog:", err);
    res
      .status(500)
      .json({ message: "Error fetching blog", error: err.message });
  }
});

// Create a new blog
router.post("/", authenticateUser, async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id; // Extract user ID from the authenticated request

    const newBlog = new Blog({ title, content, userId });
    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (err) {
    res.status(500).json({ message: "Error creating blog", error: err });
  }
});

module.exports = router;
