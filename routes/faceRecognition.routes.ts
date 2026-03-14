import { Router } from "express";
import Booking from "../model/booking.model";

const router = Router();

router.get("/face-recognition/visitors", async (_req, res) => {
  try {
    const visitors = await Booking.find({
      faceEmbedding: { $exists: true, $ne: null },
    }).select("_id firstName lastName faceEmbedding status");

    return res.status(200).json({
      success: true,
      count: visitors.length,
      data: visitors,
    });
  } catch (error) {
    console.error("Failed to load face-recognition visitors:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load face vectors",
    });
  }
});

export default router;
