import mongoose, { Document, Schema } from "mongoose";

// Structure for Date Overrides
interface ICustomLimit {
  date: string; // Format: YYYY-MM-DD
  limit: number;
}

export interface IOffice extends Document {
  name: string;
  defaultMaxSlots: number;
  customLimits: ICustomLimit[];
}

const OfficeSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    defaultMaxSlots: {
      type: Number,
      default: 30,
    },
    // This is where your date overrides are stored
    customLimits: [
      {
        date: { type: String, required: true },
        limit: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true },
);

export const Office = mongoose.model<IOffice>("Office", OfficeSchema);
