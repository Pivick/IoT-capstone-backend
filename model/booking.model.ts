/* eslint-disable */
import mongoose, { Document, Schema } from "mongoose";

// -----------------------------
// TypeScript Interface
// -----------------------------
export interface IBooking extends Document {
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  category: string;

  // Logistics
  office: string;
  purpose: string;
  bookingDate: string; // YYYY-MM-DD

  // Identity & OCR
  idCategory: string;
  idType: string;
  idFront: string; // Base64
  idBack: string; // Base64
  ocrFront?: string;
  ocrBack?: string;

  // Biometrics
  faceEmbedding: number[];

  // Status
  status:
    | "Pending"
    | "Approved"
    | "Rejected"
    | "On Campus"
    | "Completed"
    | "Cancelled";

  // 🔥 AUDIT TRAIL FIELDS (Timestamps)
  timeIn?: Date;
  transactionTime?: Date;
  timeOut?: Date;
  hours?: number; // Duration in hours

  // 🔥 GRANULAR SECURITY LOGS (Who did what?)
  actionBy?: string; // General creation source (e.g., "SELF-REGISTRATION")
  timeInBy?: string; // Name of Guard who scanned Entry
  transactionBy?: string; // Name of Staff who scanned Transaction
  timeOutBy?: string; // Name of Guard who scanned Exit

  // Notification Tracking
  smsSent?: boolean;

  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------
// Mongoose Schema
// -----------------------------
const BookingSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phoneNumber: { type: String, required: true },

    category: {
      type: String,
      enum: [
        "Student",
        "Alumni",
        "Parent/Guardian",
        "Supplier",
        "Applicant Student",
        "Applicant Employee",
        "Guest",
        "Merchant",
        "Regular",
        "Senior Citizen", // Added based on your Manual Entry options
        "PWD", // Added based on your Manual Entry options
      ],
      required: true,
    },

    office: { type: String, required: true },
    purpose: { type: String, required: true },
    bookingDate: { type: String, required: true },

    // 🔥 IDENTITY DOCUMENTS
    idCategory: { type: String, required: true },
    idType: { type: String, required: true },
    idFront: { type: String, required: true },
    idBack: { type: String, required: true },
    ocrFront: { type: String, default: "" },
    ocrBack: { type: String, default: "" },

    // 🔥 BIOMETRICS
    faceEmbedding: {
      type: [Number],
      required: true,
      validate: (arr: number[]) => Array.isArray(arr) && arr.length > 0,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "Rejected",
        "On Campus",
        "Completed",
        "Cancelled",
      ],
      default: "Approved",
    },

    // ---------------------------------------------
    // 🔥 AUDIT TRAIL IMPLEMENTATION
    // ---------------------------------------------
    // 1. Timestamps
    timeIn: { type: Date, default: null },
    transactionTime: { type: Date, default: null },
    timeOut: { type: Date, default: null },
    hours: { type: Number, default: 0 },

    // 2. Actors (Who did it?)
    actionBy: { type: String }, // Creation Source
    timeInBy: { type: String, default: null }, // Guard Name
    transactionBy: { type: String, default: null }, // Staff Name
    timeOutBy: { type: String, default: null }, // Guard Name

    smsSent: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

// Prevent model overwrite in hot-reload environments
const Booking =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
