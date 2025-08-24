import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, provider: "local" });
    await user.save();

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.provider === "google") {
      return res.status(400).json({ message: "This account was created with Google. Please sign in using Google." });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Google login
router.post("/google-login", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub, email, name } = payload;

    let user = await User.findOne({ email });

    if (user && user.provider === "local") {
      return res.status(400).json({ message: "This account was created with local login. Please sign in using password." });
    }

    if (!user) {
      user = new User({ googleId: sub, email, name, provider: "google" });
      await user.save();
    }

    res.status(200).json({ message: "Google login successful", user });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(400).json({ error: "Invalid Google token" });
  }
});

export default router;
