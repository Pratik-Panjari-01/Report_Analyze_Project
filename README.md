# Report Analyze Project

A full-stack MVP for securely uploading medical reports, extracting text, and generating educational AI summaries.

## Stack
- React + Vite + Tailwind CSS (plain CSS styling)
- Express + MongoDB Atlas + Mongoose
- Google Identity Services ID-token verification
- HttpOnly JWT session cookie
- PDF and image uploads (PDF text extraction; images stored for future OCR)
- OpenAI API for cautious, non-diagnostic explanations

## Requirements
Node.js 20+, MongoDB Atlas cluster, Google OAuth Web Client ID, OpenAI API key (optional until AI analysis is used).

## Setup

### 1. Backend
```bash
cd backend
cp .env.example .env
# Fill in MONGODB_URI, GOOGLE_CLIENT_ID, JWT_SECRET, FRONTEND_URL, OPENAI_API_KEY
npm install
npm run dev
```

### 2. Frontend
```bash
cd frontend
cp .env.example .env
# Set VITE_GOOGLE_CLIENT_ID to the same Google Web Client ID
npm install
npm run dev
```

Open http://localhost:5173.

## Google OAuth configuration
In Google Cloud Console, create an OAuth client of type **Web application**.
- Authorized JavaScript origin: `http://localhost:5173`
- Add your production frontend origin when deployed.
- This app uses Google Identity Services popup credential flow. No redirect URI is needed for this flow.
- The Google Client ID is public; never put a Google Client Secret in frontend code.

## Atlas
Create a database user with read/write access and add your development IP under Network Access. Use the Atlas connection string in `backend/.env`. URL-encode special characters in the database password. Do not use `0.0.0.0/0` permanently.

## Safety and privacy
- This app is an educational report explainer, not a diagnostic service.
- AI output can be wrong. Users should consult a qualified clinician, especially for critical or concerning results.
- Do not upload reports without appropriate consent. Medical documents contain sensitive personal information.
- For production, add private object storage, malware scanning, encryption/key management, retention/deletion controls, audit logging, stricter rate limits, backups, and a privacy/legal review.
- Uploaded files are stored locally in `backend/uploads` in this MVP. Do not deploy this storage design as-is for production.
- Session cookie is HttpOnly, Secure in production, SameSite=Lax. Configure HTTPS in production.
