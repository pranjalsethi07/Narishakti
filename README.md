# NariShakti Assistant

NariShakti Assistant is a women-focused support platform built with React and Express. It combines an AI assistant, OCR-based document simplifier, and community discussion features in one dashboard so users can ask questions, understand reports, and get practical guidance in a safe space.

## Core Purpose

The project is designed to help users with:
- Health, finance, and safety support through conversational AI
- Easy understanding of complex medical/finance documents
- Anonymous community posting with helpful and reply interactions
- Language-friendly experience (English and Hindi)

## Key Features

### 1. Ask AI
- Chat interface powered by OpenRouter API
- Practical, concise responses for women-focused concerns
- Timeout and error handling for stable responses

### 2. Document Simplifier (OCR)
- Upload PDF or images (JPG/PNG/WEBP)
- OCR extraction using `tesseract.js` and `pdfjs-dist`
- Detects medical/finance keywords
- Generates:
	- Easy summary
	- Keyword meanings with normal ranges
	- Actionable next-step advice
- Output medium support:
	- English
	- Hindi (Devanagari)

### 3. Didi Connect Community
- Anonymous post creation
- Category filtering (All, Health, Finance, Safety)
- Helpful toggle per post
- Reply thread toggle and reply submission
- Local persistence using browser storage

## Tech Stack

- Frontend: React, Vite, React Router
- Backend: Express, CORS
- AI Provider: OpenRouter Chat Completions API
- OCR/Parsing: tesseract.js, pdfjs-dist
- Icons/UI: lucide-react

## Project Structure

- Frontend app: `src/`
- Dashboard pages: `src/pages/dashboard/`
- Main OCR page: `src/pages/dashboard/Scanner.jsx`
- Community page: `src/pages/dashboard/Community.jsx`
- AI backend: `server.js`

## Environment Variables

Create a `.env` file in the project root and add:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
# OR use Gemini directly:
# GEMINI_API_KEY=your_gemini_api_key
# Optional:
OPENROUTER_MODEL=openrouter/auto
GEMINI_MODEL=gemini-2.0-flash
PORT=3001

# Optional frontend API base (use when frontend is not served from same host as backend)
# Example: VITE_API_BASE_URL=https://your-backend-url.trycloudflare.com
VITE_API_BASE_URL=

# WhatsApp (Twilio Sandbox) optional but recommended for bot integration
TWILIO_WHATSAPP_NUMBER=14155238886
TWILIO_SANDBOX_JOIN_CODE=your-sandbox-join-code
PUBLIC_BASE_URL=https://your-public-url.ngrok-free.app
```

The backend supports these key names (first available wins):
- `OPEN_ROUTER_API_KEY`
- `OPENROUTER_KEY`
- `GROQ_API_KEY` (legacy fallback)
- `GEMINI_API_KEY`
- `GOOGLE_API_KEY`
- `VITE_OPENROUTER_API_KEY`
- `VITE_GEMINI_API_KEY`

## WhatsApp Bot Setup (Twilio Sandbox)

1. Create or open your Twilio WhatsApp Sandbox.
2. Expose local backend using ngrok (or any public tunnel):
	- Example: `ngrok http 3001`
3. Set `PUBLIC_BASE_URL` in `.env` to your tunnel URL.
4. In Twilio Sandbox, set incoming webhook URL to:
	- `https://<your-public-url>/api/whatsapp/webhook`
5. Keep method as `HTTP POST`.
6. From your phone WhatsApp, send:
	- `join <your-sandbox-join-code>`
   to the sandbox number.
7. Now send any question on WhatsApp. Twilio forwards message to your backend and AI reply is sent back automatically.

## Run Locally

Install dependencies:

```bash
npm install
```

Start backend:

```bash
npm run server
```

Start frontend:

```bash
npm run dev
```

Optional combined dev command:

```bash
npm run dev:full
```

If frontend is opened from a different origin (for example Vercel/Netlify or a tunnel), set `VITE_API_BASE_URL` to your backend public URL and restart Vite.

## Available Scripts

- `npm run dev` - Start Vite frontend
- `npm run server` - Start Express backend
- `npm run dev:full` - Start backend and frontend together
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Endpoints

- `GET /api/health`
	- Health check endpoint
- `GET /api/provider-status`
	- Returns active AI provider + key availability
- `POST /api/chat`
	- Request body: `{ "message": "..." }`
	- Response: `{ "reply": "..." }`
- `GET /api/whatsapp/status`
	- Returns WhatsApp integration readiness + webhook URL
- `POST /api/whatsapp/test`
	- Request body: `{ "message": "..." }`
	- Returns AI reply used by WhatsApp flow for local testing
- `POST /api/whatsapp/webhook`
	- Twilio incoming WhatsApp webhook endpoint (form-encoded)
	- Responds with TwiML message

## Current Focus of the Project

This version focuses on practical support for real users:
- Simple and understandable AI output
- Domain-specific OCR explanations (medical and finance)
- Action-oriented recommendations
- Safer and more supportive community interactions
