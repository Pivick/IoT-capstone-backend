import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../model/user";

// Extend Express Request
export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // 🔴 FIX: Explicitly check if token is undefined
      if (!token) {
        res.status(401).json({ message: "Not authorized, no token found" });
        return;
      }

      // 🔴 FIX: Ensure Secret is defined
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error("JWT_SECRET is not defined in .env");
      }

      // Verify token
      // logic: We checked !token above, so TS knows it's a string here
      const decoded = jwt.verify(token, secret) as JwtPayload;

      // Get user from the token
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        res.status(401).json({ message: "Not authorized, user not found" });
        return;
      }

      next();
    } catch (error) {
      console.error("Auth Middleware Error:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
      return;
    }
  }

  // If we didn't enter the if block above
  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        message: `User role '${req.user?.role}' is not authorized to access this route.`,
      });
      return;
    }
    next();
  };
};
