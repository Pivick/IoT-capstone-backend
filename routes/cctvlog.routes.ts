import express from "express";
import {
  createLog,
  getLogs,
  getLogsByVisitor,
} from "../controllers/cctvlog.controller";

const router = express.Router();

router.get("/", getLogs);
router.post("/", createLog);
router.get("/visitor/:visitorId", getLogsByVisitor);

export default router;
