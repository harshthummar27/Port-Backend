import express from "express";
import Experience from "../models/Experience.js";

const router = express.Router();

// Get all experiences
router.get("/", async (req, res) => {
  const experiences = await Experience.find();
  res.json(experiences);
});

// Add an experience
router.post("/", async (req, res) => {
  const experience = new Experience(req.body);
  await experience.save();
  res.json(experience);
});

// Delete an experience
router.delete("/:id", async (req, res) => {
  await Experience.findByIdAndDelete(req.params.id);
  res.json({ message: "Experience deleted" });
});

export default router;
