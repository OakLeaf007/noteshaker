import mongoose from "mongoose";

const userSchema =  new mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    password: { type: String },
    googleId: { type: String},
    provider: { type: String, enum: ["local", "google"], default: "local" }
});
const User = mongoose.model("User", userSchema);
export default User;
