import { Request, Response } from "express";
import CCTVLog from "../model/cctvlog.model"; // Ensure this path matches your actual file structure

// GET /api/cctv-logs -> Fetch the latest 20 detections
export const getLogs = async (req: Request, res: Response) => {
  try {
    const logs = await CCTVLog.find().sort({ timestamp: -1 }).limit(20);
    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching CCTV Logs:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// POST /api/cctv-logs -> Save a new AI facial recognition hit
export const createLog = async (req: Request, res: Response) => {
  try {
    const {
      visitorId,
      visitorName,
      cameraName,
      confidence,
      screenshotBase64,
      status, // 🚀 Added missing field
      date, // 🚀 Added missing field
      timestamp,
    } = req.body;

    const newLog = new CCTVLog({
      visitorId,
      visitorName,
      cameraName,
      confidence,
      screenshotBase64,
      status, // 🚀 Save to database
      date, // 🚀 Save to database
      timestamp: timestamp || new Date(), // Enforces precise time of detection
    });

    await newLog.save();
    res.status(201).json(newLog);
  } catch (error) {
    console.error("Error saving CCTV Log:", error);
    res.status(500).json({ message: "Failed to save CCTV log" });
  }
};

export const getLogsByVisitor = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { visitorId } = req.params;
    const { name } = req.query;

    const logs = await CCTVLog.find({
      $or: [{ visitorId: visitorId as any }, { visitorName: name as any }],
    }).sort({ timestamp: -1 });

    return res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching visitor CCTV Logs:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
