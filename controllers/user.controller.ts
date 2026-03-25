// ... existing imports ...
import { Request, Response } from "express";
import User from "../model/user"; // Ensure your User model is imported

export const updateEmail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { email: email },
      { new: true }, // Returns the updated document
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "Email updated successfully.", user });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email is already in use." });
    }
    res.status(500).json({ message: "Server error updating email." });
  }
};

// 🔥 2. UPDATE OFFICE
export const updateOffice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { office } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { office: office },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "Office updated successfully.", user });
  } catch (error) {
    res.status(500).json({ message: "Server error updating office." });
  }
};
