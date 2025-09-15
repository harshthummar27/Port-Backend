import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import projectRoutes from "./routes/projectRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import authenticate from "./middleware/auth.js";

dotenv.config();
const app = express();
app.use(express.json());

// ✅ Move CORS middleware BEFORE your routes!
app.use(cors({
  // origin: 'http://localhost:5173',
   origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use('/uploads', express.static('uploads'));
app.use('/api/projects',projectRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

// mongoose.connect(process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));


app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
