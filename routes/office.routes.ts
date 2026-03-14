import { Router } from "express";
import {
  createOffice,
  deleteOffice,
  getAllOffices,
  getAvailableSlots,
  updateOffice,
} from "../controllers/office.controller";

const router = Router();

router.get("/", getAllOffices);
router.get("/slots", getAvailableSlots);

router.post("/", createOffice);
router.put("/:id", updateOffice);
router.delete("/:id", deleteOffice);

export default router;
