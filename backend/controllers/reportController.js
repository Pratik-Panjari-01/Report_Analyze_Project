
import fs from "node:fs/promises";
import path from "node:path";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import Report from "../models/Report.js";

// Extract text from PDF
async function extractPdfText(buffer) {
  const pdfDocument = await getDocument({
    data: new Uint8Array(buffer),
    useSystemFonts: true,
    isEvalSupported: false
  }).promise;

  try {
    let extractedText = "";

    const maxPages = Math.min(pdfDocument.numPages, 100);

    for (let pageNumber = 1; pageNumber <= maxPages; pageNumber++) {
      const page = await pdfDocument.getPage(pageNumber);
      const content = await page.getTextContent();

      const pageText = content.items
        .map(item => "str" in item ? item.str : "")
        .filter(Boolean)
        .join(" ");

      extractedText += pageText + "\n";

      page.cleanup();
    }

    return extractedText.trim().slice(0, 50000);

  } finally {
    await pdfDocument.destroy();
  }
}

// Upload report
export async function uploadReport(req, res) {
  if (!req.file) {
    return res.status(400).json({
      message: "Choose a PDF, JPG, or PNG file"
    });
  }

  try {
    let extractedText = "";

    if (req.file.mimetype === "application/pdf") {
      const buffer = await fs.readFile(req.file.path);
      extractedText = await extractPdfText(buffer);
    }

    const report = await Report.create({
      user: req.user._id,
      originalName: req.file.originalname,
      storedName: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size,
      extractedText,
      status: extractedText ? "extracted" : "uploaded"
    });

    return res.status(201).json({
      report: {
        id: report._id,
        originalName: report.originalName,
        mimeType: report.mimeType,
        size: report.size,
        status: report.status,
        createdAt: report.createdAt,
        textAvailable: Boolean(extractedText)
      }
    });

  } catch (error) {
    await fs.unlink(req.file.path).catch(() => {});

    console.error("Upload error:", error);

    return res.status(500).json({
      message: "Could not process this report"
    });
  }
}

// List reports
export async function listReports(req, res) {
  const reports = await Report.find({
    user: req.user._id
  })
    .select("-extractedText -analysis -storedName")
    .sort({ createdAt: -1 })
    .limit(100);

  return res.json({ reports });
}

// Get report
export async function getReport(req, res) {
  const report = await Report.findOne({
    _id: req.params.id,
    user: req.user._id
  }).select("-storedName");

  if (!report) {
    return res.status(404).json({
      message: "Report not found"
    });
  }

  return res.json({ report });
}

// Delete report
export async function deleteReport(req, res) {
  const report = await Report.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!report) {
    return res.status(404).json({
      message: "Report not found"
    });
  }

  await fs.unlink(
    path.resolve("uploads", report.storedName)
  ).catch(() => {});

  await report.deleteOne();

  return res.json({
    message: "Report deleted"
  });
}
