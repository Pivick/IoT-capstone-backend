import express from "express";
import {
  createLog,
  deleteLog,
  getLogs,
  getLogsByVisitor,
} from "../controllers/cctvlog.controller";

const router = express.Router();

router.get("/", getLogs);
router.post("/", createLog);
router.get("/visitor/:visitorId", getLogsByVisitor);

// 2. Add the DELETE route using the ID parameter
router.delete("/:id", deleteLog);

export default router;
