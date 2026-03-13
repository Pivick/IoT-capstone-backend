/* eslint-disable */
import { Request, Response } from "express";
import Booking from "../model/booking.model";

export const getAuditTrail = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });

    const auditLogs = bookings.map((log: any) => {
      // Type as any to access old 'date' field

      // Duration Logic
      let calculatedHours = 0;
      if (log.timeIn && log.timeOut) {
        const start = new Date(log.timeIn).getTime();
        const end = new Date(log.timeOut).getTime();
        calculatedHours = (end - start) / (1000 * 60 * 60);
      } else if (log.timeIn && !log.timeOut) {
        const start = new Date(log.timeIn).getTime();
        calculatedHours = (Date.now() - start) / (1000 * 60 * 60);
      }

      return {
        _id: log._id,
        firstName: log.firstName,
        lastName: log.lastName,
        email: log.email,
        phoneNumber: log.phoneNumber,
        category: log.category,
        office: log.office,
        purpose: log.purpose,

        // 🔥 FIX: Check bookingDate first, fallback to old 'date', fallback to today
        bookingDate:
          log.bookingDate || log.date || new Date().toISOString().split("T")[0],

        status: log.status,
        timeIn: log.timeIn,
        transactionTime: log.transactionTime,
        timeOut: log.timeOut,
        hours: calculatedHours,
        actionBy: log.actionBy || "SYSTEM",

        idCategory: log.idCategory,
        idType: log.idType,
        idFront: log.idFront,
        idBack: log.idBack,
        ocrFront: log.ocrFront,
        ocrBack: log.ocrBack,
        faceEmbedding: log.faceEmbedding,
      };
    });

    res.status(200).json(auditLogs);
  } catch (error) {
    console.error("Audit Controller Error:", error);
    res.status(500).json({ message: "Server error fetching audit logs" });
  }
};

export const deleteAuditLog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Booking.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Log not found" });
    }

    res.status(200).json({ message: "Audit log removed permanently" });
  } catch (error) {
    res.status(500).json({ message: "Server error during deletion" });
  }
};
