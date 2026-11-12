import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { analyzeReport } from "../controllers/aiController.js";
const router = Router();
router.post("/:id", requireAuth, analyzeReport);
export default router;
