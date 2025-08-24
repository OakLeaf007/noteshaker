import express from "express";

import dotenv from "dotenv";


dotenv.config();


import cors from "cors";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";




const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// this one checkes if mongo uri loaded. testing purpose only
console.log('Mongo URI:', process.env.mongouri); 

// MongoDB connection
mongoose.connect(process.env.mongouri)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

// For frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend","index.html"));
});

const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
