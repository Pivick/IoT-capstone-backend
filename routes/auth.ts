import express from "express";
import jwt from "jsonwebtoken";
import User from "../model/user";

const router = express.Router();

// ----------------------
// LOGIN ENDPOINT (DEBUG VERSION)
// ----------------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("-----------------------------------------");
  console.log("🔐 LOGIN ATTEMPT:", email);

  // 1. Check Input
  if (!email || !password) {
    console.log("❌ Missing inputs");
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // 2. Find User
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found in DB");
      return res.status(400).json({ message: "Invalid email or password" });
    }
    console.log("✅ User Found:", user.name);

    // 3. Check Password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log(
        "❌ Password Mismatch. Hash in DB:",
        user.password.substring(0, 10) + "...",
      );
      return res.status(400).json({ message: "Invalid email or password" });
    }
    console.log("✅ Password Matched");

    // 4. Check Config
    if (!process.env.JWT_SECRET) {
      console.error(
        "🔥 CRITICAL ERROR: JWT_SECRET is missing in .env or server.ts!",
      );
      throw new Error("Server Misconfiguration: JWT_SECRET missing");
    }

    // 5. Generate Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    console.log("✅ Token Generated");

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: any) {
    console.error("🔥 SERVER CRASH DURING LOGIN:", err.message);
    return res.status(500).json({ message: "Server error: " + err.message });
  }
});

const handleSignup = async (req: express.Request, res: express.Response) => {
  const { name, email, password, role } = req.body;

  console.log("-----------------------------------------");
  console.log("📝 SIGNUP ATTEMPT:", email, "Role:", role);

  try {
    // 1. Validate input
    if (!name || !email || !password || !role) {
      console.log("❌ Missing fields");
      return res.status(400).json({ message: "All fields are required." });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ Email already in use");
      return res.status(400).json({ message: "Email is already registered." });
    }

    // 3. Create the new user
    // (Assuming your User model handles password hashing automatically in a pre-save hook)
    const newUser = new User({
      name,
      email,
      password,
      role,
    });

    // 4. Save to database
    await newUser.save();
    console.log("✅ User Successfully Created:", newUser.name);

    // 5. SEND RESPONSE BACK TO FRONTEND (This stops the infinite loading spinner!)
    return res.status(201).json({
      message: "User registered successfully!",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err: any) {
    console.error("🔥 SERVER CRASH DURING SIGNUP:", err.message);
    return res.status(500).json({
      message: "Server error during registration.",
      error: err.message,
    });
  }
};

router.post("/signup", handleSignup);

export default router;
