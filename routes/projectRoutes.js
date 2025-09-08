import express from "express";
import Project from "../models/Project.js";
import multer from "multer";
import path from "path";
import authenticate from "../middleware/auth.js";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Save files to uploads folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({ storage: storage });

// CREATE Project (with image upload)
router.post("/", authenticate, upload.single("image"), async (req, res) => {
  try {
    const project = new Project({
      name: req.body.name,
      technologies: req.body.technologies
        ? JSON.parse(req.body.technologies)
        : [],
      image: req.file ? `/uploads/${req.file.filename}` : "",
    });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET all Projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE Project (with optional image upload)
router.put("/:id", authenticate, upload.single("image"), async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      technologies: req.body.technologies
        ? JSON.parse(req.body.technologies)
        : [],
    };
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!updatedProject)
      return res.status(404).json({ message: "Project not found" });
    res.json(updatedProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE Project
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject)
      return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

