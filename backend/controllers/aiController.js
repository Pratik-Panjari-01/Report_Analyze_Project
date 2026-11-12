
import { GoogleGenAI } from "@google/genai";
import Report from "../models/Report.js";

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function generateWithRetry(prompt) {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
  });

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          temperature: 0.2
        }
      });
    } catch (error) {
      const status = Number(error.status || error.code);

      const retryable = [429, 500, 502, 503, 504].includes(status);

      if (!retryable || attempt === 2) {
        throw error;
      }

      await sleep(1000 * Math.pow(2, attempt));
    }
  }
}

export async function analyzeReport(req, res) {
  try {
    // Check API configuration
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        message: "Gemini API key is missing. Check backend/.env."
      });
    }

    // Find report belonging to logged-in user
    const report = await Report.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!report) {
      return res.status(404).json({
        message: "Report not found"
      });
    }

    // Check extracted text
    if (!report.extractedText?.trim()) {
      return res.status(422).json({
        message: "No readable text found. OCR is required for scanned reports."
      });
    }

    const prompt = `
You are a medical laboratory report explanation assistant.

Explain the following medical report in simple language
for educational purposes only.

STRICT RULES:
- Do not diagnose any disease.
- Do not prescribe medication.
- Never recommend changing medication.
- Never invent missing values or reference ranges.
- Clearly distinguish reported findings from general context.
- Mention missing units or reference ranges.
- Explain that reference ranges vary by laboratory and patient context.
- Highlight explicitly marked critical results.
- Recommend contacting a clinician for concerning findings.
- For severe symptoms, advise emergency services.

Use these headings:

1. Summary
2. Values and what they generally mean
3. Abnormal values
4. Questions to ask a clinician
5. Limitations

Be cautious, accurate and concise.

MEDICAL REPORT:

${report.extractedText.slice(0, 30000)}
`;

    // Generate Gemini analysis
    const response = await generateWithRetry(prompt);

    const analysis = response.text;

    if (!analysis) {
      return res.status(502).json({
        message: "Gemini returned an empty response. Please try again."
      });
    }

    // Save analysis in MongoDB
    report.analysis = analysis;
    report.status = "analyzed";

    await report.save();

    return res.status(200).json({
      analysis: report.analysis,
      status: report.status
    });

  } catch (error) {
    console.error("========== GEMINI ANALYSIS ERROR ==========");
    console.error("Message:", error.message);
    console.error("Status:", error.status || error.code);
    console.error("Details:", error);
    console.error("============================================");

    const status = Number(error.status || error.code);

    if (status === 429) {
      return res.status(429).json({
        message: "Gemini API quota exceeded. Please try again later."
      });
    }

    if (status === 503 || status === 502 || status === 504) {
      return res.status(503).json({
        message: "Gemini is temporarily unavailable. Please try again later."
      });
    }

    return res.status(500).json({
      message: "Medical report analysis failed. Please try again.",
      error: process.env.NODE_ENV === "development"
        ? error.message
        : undefined
    });
  }
}
