// routes/notes.js
import express from "express";
import Note from "../models/Note.js";

const router = express.Router();

// Create note
router.post("/", async (req, res) => {
  try {
    const { title, content, email } = req.body;
    if (!title || !content || !email) return res.status(400).json({ error: "Title, content, and email required" });

    const note = new Note({
      title,
      content,
      email // store email instead of user ID
    });

    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get notes for a specific email
router.get("/:email", async (req, res) => {
  try {
    const notes = await Note.find({ email: req.params.email }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update note by ID and email
router.put("/:id", async (req, res) => {
  try {
    const { email, title, content } = req.body;
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, email },
      { title, content },
      { new: true }
    );
    if (!note) return res.status(404).json({ error: "Note not found or not authorized" });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete note by ID and email
router.delete("/:id", async (req, res) => {
  try {
    const { email } = req.body;
    const note = await Note.findOneAndDelete({ _id: req.params.id, email });
    if (!note) return res.status(404).json({ error: "Note not found or not authorized" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
