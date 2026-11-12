import { Router } from "express";
import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";
import { requireAuth } from "../middleware/authMiddleware.js";
import { uploadReport, listReports, getReport, deleteReport } from "../controllers/reportController.js";

const router = Router();
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/"),
  filename: (_req, file, cb) => cb(null, `${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`)
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["application/pdf", "image/jpeg", "image/png"];
    cb(allowed.includes(file.mimetype) ? null : new Error("Only PDF, JPG and PNG files are allowed"), allowed.includes(file.mimetype));
  }
});
router.use(requireAuth);
router.post("/", upload.single("report"), uploadReport);
router.get("/", listReports);
router.get("/:id", getReport);
router.delete("/:id", deleteReport);
export default router;
