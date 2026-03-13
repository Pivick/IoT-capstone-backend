import express from "express";
import {
  createBooking,
  getAllBookings,
  getSlots,
  getVisitorDetails,
  scanQR,
  scanTransaction,
} from "../controllers/booking.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

// Public Routes
router.get("/slots", getSlots);
router.post("/", createBooking);
router.get("/", getAllBookings);

// 🔥 2. ADD THIS ROUTE (Required for Transaction Scan Preview)
router.get("/:id", getVisitorDetails);

// 🚀 SCANNERS
router.post("/scan", protect, scanQR);
router.post("/scan/transaction", protect, scanTransaction);

export default router;
