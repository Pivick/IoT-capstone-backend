import { Router } from "express";
import {
  createOffice,
  deleteOffice,
  getAllOffices,
  getAvailableSlots,
  updateOffice,
} from "../controllers/office.controller";

const router = Router();

// --- Static Routes ---
router.get("/", getAllOffices); // GET /api/offices

// 🔥 2. Add this route (MUST be above /:id)
// This enables: GET /api/offices/slots?date=...&office=...
router.get("/slots", getAvailableSlots);

// --- Parameterized Routes ---
router.post("/", createOffice); // POST /api/offices
router.put("/:id", updateOffice); // PUT /api/offices/:id
router.delete("/:id", deleteOffice); // DELETE /api/offices/:id

export default router;
