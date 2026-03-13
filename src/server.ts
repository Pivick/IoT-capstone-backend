import cors from "cors";
import "dotenv/config";
import express from "express";
import { PORT } from "../config/env";
import { sendOTP, verifyOTP } from "../controllers/booking.controller";
import startOverstayMonitor from "../jobs/overstayMonitor";
import { connectDB } from "../lib/db";
import auditRoutes from "../routes/audit.routes";
// Ensure this path matches your actual file name (auth.routes.ts vs auth.ts)
import authRoutes from "../routes/auth";
import bookingRoutes from "../routes/booking.routes";
import cctvLogRoutes from "../routes/cctvlog.routes";
import officeRoutes from "../routes/office.routes";
import streamRoutes from "../routes/stream.routes";

import userRoutes from "../routes/user.routes";
import { initSurveillanceGrid } from "../services/rstp.service";

const app = express();

// 1. MIDDLEWARE
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  }),
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// 2. ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/offices", officeRoutes);
app.use("/api/audit-trail", auditRoutes);

app.post("/api/send-otp", sendOTP);
app.post("/api/verify-otp", verifyOTP);

app.use("/api/cctv-logs", cctvLogRoutes);
app.use("/api/stream", streamRoutes);

// Health check
app.get("/", (_req, res) => {
  res.send("UniVentry Backend Running");
});

// 🔥 START THE MONITOR
startOverstayMonitor();

// 3. DATABASE & SERVER START
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📁 Office Registry: http://localhost:${PORT}/api/offices`);
      console.log(
        `📊 Slot System: http://localhost:${PORT}/api/bookings/slots`,
      );
      initSurveillanceGrid();
    });
  } catch (err) {
    console.error("Failed to start system:", err);
  }
};
startServer();
