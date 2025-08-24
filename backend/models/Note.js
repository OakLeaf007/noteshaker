// models/Note.js
import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  email: { type: String, required: true } // using email instead of userId
}, { timestamps: true });

const Note = mongoose.model("Note", noteSchema);
export default Note;
