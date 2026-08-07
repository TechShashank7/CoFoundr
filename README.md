# CoFoundr

AI-powered co-founder assistant for early-stage startups.

## Tech Stack
- Frontend: React (Vite) + pure CSS
- Backend: Node.js, Express, MongoDB
- AI: Google Gemini 2.5 Flash

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or via Atlas)
- Google Gemini API Key

### Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your `GEMINI_API_KEY` and ensure `MONGODB_URI` is correct.
4. Start the backend server:
   ```bash
   npm run dev
   # (or `node server.js` if you don't have nodemon)
   ```
   *The backend runs on port 5050.*

### Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend runs on port 5173 (or similar) and proxies `/api` calls to port 5050.*

## Current Status
- **P0 Features (Completed):** Onboarding, Dashboard, Co-Founder Chat, Task Kanban, Business Plan Generator.
