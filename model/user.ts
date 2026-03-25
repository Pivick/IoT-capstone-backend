/* eslint-disable */
import bcrypt from "bcrypt";
import mongoose, { Document, Model, Schema } from "mongoose";

// Interface for User document
// In this system, only staff (admin, guard, office, superadmin) have accounts.
// Visitors do NOT get user accounts – they only submit appointment forms.
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "guard" | "office" | "super-admin";
  office?: string; // 🔥 NEW: Ties office staff to a specific department
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Schema definition
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "guard", "office", "super-admin"],
      required: true,
    },
    // 🔥 NEW: Explicitly define the field in Mongoose so it accepts updates
    office: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

// Pre-save hook to hash password
userSchema.pre("save", async function (this: IUser) {
  // If the password hasn't been changed, just return (no next needed)
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create model (Prevent overwrite error in hot-reload)
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
