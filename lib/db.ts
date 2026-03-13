
import mongoose from "mongoose";
import { MONGODB_URI } from "../config/env";



export const connectDB = async () => {
  try {
    if (!MONGODB_URI) {
      console.warn("⚠️ MONGODB_URI is not defined in .env - server will continue without DB");
      return;
    }

    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB connected successfully!");
  } catch (error: any) {
    console.error("❌ MongoDB connection failed:", error.message);
    console.log("⚠️ Server will continue running without database connection");
    // Don't exit - let the server continue running
  }
};

