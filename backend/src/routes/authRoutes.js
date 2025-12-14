const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
      role: "USER",
    });

    res.json({ message: "User registered" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not set");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const userRole = user.role ? user.role.toUpperCase() : "USER";

    const token = jwt.sign(
      { id: user.id, role: userRole },
      process.env.JWT_SECRET
    );

    res.json({ token, role: userRole });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error during login", error: error.message });
  }
});

// CREATE ADMIN USER (for initial setup - can be removed after creating admin)
router.post("/create-admin", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      // Update existing user to admin
      existingUser.role = "ADMIN";
      const hashedPassword = await bcrypt.hash(password, 10);
      existingUser.password = hashedPassword;
      await existingUser.save();
      return res.json({ message: "User updated to admin" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
      role: "ADMIN",
    });

    res.json({ message: "Admin user created" });
  } catch (error) {
    console.error("Create admin error:", error);
    res.status(500).json({ message: "Error creating admin user", error: error.message });
  }
});

module.exports = router;
