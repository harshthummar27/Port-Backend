import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  link: String,
  technologies: [String],
  image: String, // <-- Add this line
});

export default mongoose.model("Project", projectSchema);
