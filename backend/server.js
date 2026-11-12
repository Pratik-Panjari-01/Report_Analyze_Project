import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import fs from "node:fs";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();
fs.mkdirSync("uploads", { recursive: true });

app.use(
  helmet({
    crossOriginOpenerPolicy: {
      policy: "same-origin-allow-popups",
    },
  })
);
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, limit: 30 }), authRoutes);
app.use("/api/reports", rateLimit({ windowMs: 15 * 60 * 1000, limit: 30 }), reportRoutes);
app.use("/api/ai", rateLimit({ windowMs: 60 * 60 * 1000, limit: 10 }), aiRoutes);

app.get("/", (_req, res) => res.json({ ok: true, service: "Report Analyze API" }));
app.use((err, _req, res, _next) => {
  console.error(err.message);
  if (err.code === "LIMIT_FILE_SIZE") return res.status(413).json({ message: "Maximum file size is 10 MB" });
  return res.status(400).json({ message: err.message || "Request failed" });
});

const port = process.env.PORT || 5000;
connectDB().then(() => app.listen(port, () => console.log(`API listening on ${port}`)))
  .catch(err => { console.error("Startup failed:", err); process.exit(1); });
