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
  },
  { timestamps: true },
);

// Pre-save hook to hash password
userSchema.pre("save", async function (this: IUser) {
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

// Create model
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
