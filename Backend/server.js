import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

// Import Routes
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";
import categoryRoutes from "./routes/category.route.js";

// Import Category model
import Category from "./models/category.js";

dotenv.config();

const app = express();

// Middleware - MUST come before routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
  })
);

// ENHANCED DEBUG MIDDLEWARE - Log all incoming requests
app.use((req, res, next) => {
  console.log("\n" + "=".repeat(60));
  console.log(`📨 ${req.method} ${req.url}`);
  console.log("📋 Content-Type:", req.headers['content-type'] || 'Not specified');
  console.log("📦 Body exists:", !!req.body);
  console.log("📝 Body type:", typeof req.body);
  console.log("🔍 Body content:", req.body);
  console.log("=".repeat(60) + "\n");
  next();
});

// ⭐ AUTO-SEED CATEGORIES FUNCTION ⭐
const seedCategories = async () => {
  try {
    console.log("\n🌱 Starting category seeding...");
    
    // Define all categories from the enum
    const categoryEnums = [
      "Technology",
      "Travel",
      "Food",
      "Lifestyle",
      "Health & Fitness",
      "Fashion",
      "Education",
      "Business",
      "Entertainment",
      "Sports",
      "Art & Design",
      "Science",
      "Personal Development",
      "News",
      "Opinion"
    ];

    // Delete ALL existing categories to start fresh
    const deleteResult = await Category.deleteMany({});
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing categories`);

    // Create categories ONE BY ONE to trigger pre-save hooks
    const createdCategories = [];
    for (const name of categoryEnums) {
      const category = new Category({ name });
      await category.save();
      createdCategories.push(category);
    }
    
    console.log(`✅ Successfully created ${createdCategories.length} categories:`);
    createdCategories.forEach((cat, index) => {
      console.log(`   ${index + 1}. ${cat.name} (slug: ${cat.slug})`);
    });
    console.log("🎉 All categories are ready!\n");
    
  } catch (error) {
    console.error("❌ Error seeding categories:", error.message);
  }
};

// Verify env variables are loaded
console.log("=".repeat(50));
console.log("PORT:", process.env.PORT);
console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
console.log("JWT_SECRET_KEY exists:", !!process.env.JWT_SECRET_KEY);
console.log("=".repeat(50));

// Test route
app.get("/test", (req, res) => {
  res.json({ message: "Blog Platform API is working!" });
});

// Test JSON parsing route
app.post("/test-json", (req, res) => {
  res.json({ 
    message: "JSON parsing test successful",
    receivedBody: req.body,
    bodyType: typeof req.body,
    bodyKeys: Object.keys(req.body || {})
  });
});

// API Routes - MUST come after middleware
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/categories", categoryRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("Blog Platform API is running!");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(500).json({ 
    message: err.message || "Internal server error",
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Set mongoose options
mongoose.set('strictQuery', false);

console.log("Attempting to connect to MongoDB...");

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(async () => {
    console.log("✅ Connected to MongoDB for Blog Platform successfully!");
    
    // ⭐ RUN SEED FUNCTION AFTER CONNECTION ⭐
    await seedCategories();
    
    const server = app.listen(process.env.PORT || 4000, () => {
      console.log(`✅ Server is running on port ${process.env.PORT || 4000}`);
      console.log(`✅ Test routes:`);
      console.log(`   - GET  http://localhost:${process.env.PORT || 4000}/test`);
      console.log(`   - POST http://localhost:${process.env.PORT || 4000}/test-json`);
      console.log(`   - GET  http://localhost:${process.env.PORT || 4000}/api/categories`);
      console.log(`   - POST http://localhost:${process.env.PORT || 4000}/api/categories`);
      console.log(`   - POST http://localhost:${process.env.PORT || 4000}/api/auth/register`);
    });
    server.on("error", (error) => {
      console.error("❌ Server error:", error);
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${process.env.PORT || 4000} is already in use`);
      }
    });
  })
  .catch((error) => {
    console.error("❌ Database connection FAILED!");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    
    if (error.message.includes('authentication')) {
      console.error("\n💡 SOLUTION: Check your MongoDB username and password in .env file");
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('ETIMEDOUT')) {
      console.error("\n💡 SOLUTION: Check your internet connection and MongoDB Atlas network access");
      console.error("💡 Try: Restart your WiFi or disconnect VPN");
      console.error("💡 Add your IP to MongoDB Atlas whitelist");
    } else if (error.message.includes('bad auth')) {
      console.error("\n💡 SOLUTION: Your MongoDB password is incorrect. Reset it in MongoDB Atlas");
    } else if (error.message.includes('IP')) {
      console.error("\n💡 SOLUTION: Add your IP address to MongoDB Atlas Network Access");
      console.error("💡 Go to: https://cloud.mongodb.com → Network Access → Add IP Address");
    }
    
    console.error("\nFull error:", error);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Promise Rejection:', error);
});