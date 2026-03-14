import express from "express";
import {
  createBooking,
  deleteBooking,
  getAllBookings,
  getVisitorDetails,
  scanQR,
  scanTransaction,
} from "../controllers/booking.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", createBooking);
router.get("/", getAllBookings);
router.get("/:id", getVisitorDetails);
router.delete("/:id", deleteBooking);

router.post("/scan", protect, scanQR);
router.post("/scan/transaction", protect, scanTransaction);

export default router;
