import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import readline from "readline";
import Admin from "../models/admin.js";

dotenv.config();

// Setup readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to ask question
const ask = (query) => new Promise((resolve) => rl.question(query, resolve));

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Ask for email and password
    const email = await ask("Enter admin email: ");
    const password = await ask("Enter admin password: ");

    rl.close();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if admin already exists
    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log("⚠️ Admin with this email already exists.");
      process.exit(0);
    }

    await Admin.create({ email, password: hashedPassword });
    console.log("✅ Admin created successfully");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  }
};

run();
