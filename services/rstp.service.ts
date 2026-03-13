import dotenv from "dotenv";
const Stream = require("node-rtsp-stream");
dotenv.config();

let cam1Stream: any = null;
let cam2Stream: any = null;

export const initSurveillanceGrid = () => {
  console.log("🛡️ Initializing RTU AI Surveillance Grid...");

  // MAIN GATE CAMERA (Port 9999)
  if (process.env.CAMERA_1_URL) {
    cam1Stream = new Stream({
      name: process.env.CAMERA_1_NAME || "Main Gate",
      streamUrl: process.env.CAMERA_1_URL, // e.g., rtsp://admin:pass@192.168.5.46:554/stream2
      wsPort: 9999, // The WebSocket port the frontend will connect to
      ffmpegOptions: {
        "-rtsp_transport": "tcp",
        "-stats": "",
        "-r": 30,
        "-q:v": 3, // Video Quality
      },
    });
    console.log("📺 Camera 1 (Main Gate) Broadcasting on ws://localhost:9999");
  }

  // REGISTRAR CAMERA (Port 9998)
  if (process.env.CAMERA_2_URL) {
    cam2Stream = new Stream({
      name: process.env.CAMERA_2_NAME || "Registrar Office",
      streamUrl: process.env.CAMERA_2_URL,
      wsPort: 9998,
      ffmpegOptions: {
        "-stats": "",
        "-r": 30,
        "-q:v": 3,
      },
    });
    console.log("📺 Camera 2 (Registrar) Broadcasting on ws://localhost:9998");
  }
};
