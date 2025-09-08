import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  duration: String,
  description: String,
});

export default mongoose.model("Experience", experienceSchema);
