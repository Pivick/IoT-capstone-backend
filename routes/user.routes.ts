import express, { Request, Response } from "express";
import User from "../model/user";

const router = express.Router();

/**
 * @route   GET /api/users
 * @desc    Get all staff members for the management list
 * @access  Private (Admin Only)
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    // We sort by newest first and hide passwords
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (err) {
    console.error("Fetch Users Error:", err);
    res.status(500).json({ message: "Failed to retrieve user list" });
  }
});

/**
 * @route   PATCH /api/users/:id/role
 * @desc    Update a staff member's role (Admin, Guard, Office, Super-Admin)
 * @access  Private (Admin Only)
 */
router.patch("/:id/role", async (req: Request, res: Response) => {
  const { role } = req.body;
  const { id } = req.params;

  // 1. Validate that the role is allowed based on your model enum
  const validRoles = ["admin", "guard", "office", "super-admin"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role assignment" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: `Role updated to ${role} successfully`,
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update Role Error:", err);
    res.status(500).json({ message: "Server error during role update" });
  }
});

/**
 * @route   DELETE /api/users/:id
 * @desc    Remove a staff account from the system
 * @access  Private (Admin Only)
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Staff account deleted successfully" });
  } catch (err) {
    console.error("Delete User Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
