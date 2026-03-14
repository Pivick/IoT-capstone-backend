/* eslint-disable */
import { Request, Response } from "express";
import { Office } from "../model/Office"; // Ensure path is correct
import Booking from "../model/booking.model"; // Ensure path is correct

// 1. Get all offices
export const getAllOffices = async (_req: Request, res: Response) => {
  try {
    const offices = await Office.find().sort({ createdAt: -1 });
    return res.status(200).json(offices);
  } catch (error: any) {
    console.error("❌ getAllOffices error:", error.message);
    return res.status(500).json({ message: "Failed to fetch offices" });
  }
};

// 2. Create a new office
export const createOffice = async (req: Request, res: Response) => {
  try {
    const { name, defaultMaxSlots } = req.body;
    const newOffice = new Office({ name, defaultMaxSlots, customLimits: [] });
    await newOffice.save();
    res.status(201).json(newOffice);
  } catch (error) {
    res.status(400).json({ message: "Office name already exists" });
  }
};

// 3. Update office (Handles both name/limit AND date overrides)
export const updateOffice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedOffice = await Office.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedOffice)
      return res.status(404).json({ message: "Office not found" });

    res.json(updatedOffice);
  } catch (error) {
    res.status(400).json({ message: "Update failed" });
  }
};

// 4. Delete office
export const deleteOffice = async (req: Request, res: Response) => {
  try {
    await Office.findByIdAndDelete(req.params.id);
    res.json({ message: "Office removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};

// 🔥 FIX 2: Optimized getAvailableSlots for bookingDate
export const getAvailableSlots = async (req: Request, res: Response) => {
  try {
    const { date, office } = req.query;

    console.log("📊 Capacity Query:", req.query);

    if (!date || !office) {
      return res.status(400).json({
        error: "Date and office are required",
      });
    }

    const officeDoc = await Office.findOne({ name: office as string });

    if (!officeDoc) {
      return res.status(404).json({ error: "Office not found" });
    }

    const override = officeDoc.customLimits?.find(
      (cl: any) => cl.date === date,
    );

    const maxSlots =
      override !== undefined ? override.limit : officeDoc.defaultMaxSlots;

    const count = await Booking.countDocuments({
      bookingDate: date,
      office: office as string,
      status: { $nin: ["Rejected", "Cancelled"] },
    });

    console.log("📊 Capacity Result:", { current: count, max: maxSlots });

    return res.status(200).json({
      current: count,
      max: maxSlots,
    });
  } catch (error: any) {
    console.error("❌ Capacity Error:", error.message);
    return res.status(500).json({ error: "Failed to fetch capacity" });
  }
};
