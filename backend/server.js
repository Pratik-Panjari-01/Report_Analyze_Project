
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import fs from "fs";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

const uploadDir = "/tmp/uploads";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 1. CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://reportanalyzefrontend.vercel.app"
];

// Allow this project's Vercel preview deployments
const vercelPreviewRegex =
  /^https:\/\/reportanalyzefrontend-[a-z0-9]+-pratik-panjaris-projects\.vercel\.app$/i;

const corsOptions = {
  origin: (origin, callback) => {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      vercelPreviewRegex.test(origin)
    ) {
      return callback(null, true);
    }

    console.error("Blocked CORS origin:", origin);
    return callback(new Error("Origin not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// 2. Middleware
app.use(cors(corsOptions));

app.use(
  helmet({
    crossOriginOpenerPolicy: {
      policy: "same-origin-allow-popups"
    }
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// 3. API routes
app.use(
  "/api/auth",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30
  }),
  authRoutes
);

app.use(
  "/api/reports",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30
  }),
  reportRoutes
);

app.use(
  "/api/ai",
  rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 10
  }),
  aiRoutes
);

// 4. Health check
app.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "Report Analyze API"
  });
});

// 5. Error handler
app.use((err, _req, res, _next) => {
  console.error("Server error:", err.message);

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      message: "Maximum file size is 10 MB"
    });
  }

  return res.status(400).json({
    message: err.message || "Request failed"
  });
});

// 6. Start server
const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`API listening on ${port}`);
    });
  })
  .catch((err) => {
    console.error("Startup failed:", err);
    process.exit(1);
  });

export default app;
