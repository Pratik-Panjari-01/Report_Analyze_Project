import { Router } from "express";
import { googleLogin, getMe, logout } from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
const router = Router();
router.post("/google", googleLogin);
router.get("/me", requireAuth, getMe);
router.post("/logout", logout);
export default router;
