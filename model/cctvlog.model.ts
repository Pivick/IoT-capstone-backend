// backend/model/cctvLog.model.ts
import mongoose from "mongoose";

const cctvLogSchema = new mongoose.Schema({
  visitorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  }, // Added required flag
  visitorName: { type: String, required: true },
  cameraName: { type: String, required: true },
  confidence: { type: Number, required: true },

  // screenshotBase64 is NOT required, so empty OUT logs save successfully
  screenshotBase64: { type: String, default: "" },

  status: { type: String, enum: ["IN", "OUT"], required: true, default: "IN" },

  // 🚀 NEW: Explicit Date Field
  date: { type: String, required: true },

  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("CCTVLog", cctvLogSchema);
