  import express from "express";
  import bcrypt from "bcryptjs";
  import jwt from "jsonwebtoken";
  import Admin from "../models/admin.js";

  const router = express.Router();
  const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

  // ✅ Admin Login
  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      const admin = await Admin.findOne({ email });
      if (!admin) return res.status(401).json({ message: "Invalid credentials" });

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: admin._id, email: admin.email }, JWT_SECRET, { expiresIn: "2h" });

      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // ✅ Change Admin credentials (protected)
  router.put("/update", async (req, res) => {
    try {
      const { email, password } = req.body;

      const admin = await Admin.findOne();
      if (!admin) return res.status(404).json({ message: "Admin not found" });

      if (email) admin.email = email;
      if (password) admin.password = await bcrypt.hash(password, 10);

      await admin.save();

      res.json({ message: "Admin updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  export default router;
