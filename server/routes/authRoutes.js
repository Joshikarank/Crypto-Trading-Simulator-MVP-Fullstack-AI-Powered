// server/routes/authRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// 🔹 Signup Route
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// 🔹 Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    
    res.json({ token, name: user.name, userId: user._id });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// 🔹 Get Current User (Protected Route)
router.get("/me", auth, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    
    res.json(user);
  } catch (error) {
    console.error("Get User Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// 🔹 Update User (Protected Route)
router.put("/:id", auth, async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Check if the user is updating their own profile
    if (req.params.id !== req.userId.toString()) {
      return res.status(403).json({ error: "Not authorized to update this user" });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Update fields
    user.name = name || user.name;
    user.email = email || user.email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// 🔹 Delete User (Protected Route)
router.delete("/:id", auth, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Check if the user is deleting their own account
    if (req.params.id !== req.userId.toString()) {
      return res.status(403).json({ error: "Not authorized to delete this user" });
    }

    const user = await User.findByIdAndDelete(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;