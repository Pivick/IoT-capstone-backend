import { Router } from "express";
import { deleteAuditLog, getAuditTrail } from "../controllers/audit.controller"; // Import deleteAuditLog

const router = Router();

// Endpoint: GET /api/audit
router.get("/", getAuditTrail);

// 🔥 NEW: DELETE /api/audit/:id
router.delete("/:id", deleteAuditLog);

export default router;
