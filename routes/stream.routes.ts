import express from "express";

const router = express.Router();

router.get("/config", (req, res) => {
  res.json([
    {
      id: "1",
      name: process.env.CAMERA_1_NAME || "Main Gate",
      streamUrl: "http://localhost:9000/api/stream/1",
    },
    {
      id: "2",
      name: process.env.CAMERA_2_NAME || "Registrar Office",
      streamUrl: "http://localhost:9000/api/stream/2",
    },
  ]);
});

// ⚠️ MOCK ENDPOINT to prevent 404s until we build FFmpeg
router.get("/:cameraId", (req, res) => {
  // We will replace this with actual FFmpeg MJPEG streaming soon.
  // For now, redirect to a generic CCTV static placeholder image,
  // or just return a 200 OK so the browser stops complaining.
  res.redirect(
    "https://via.placeholder.com/640x360.png?text=AWAITING+CCTV+FEED",
  );
});

export default router;
