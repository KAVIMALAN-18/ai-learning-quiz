# AI Learning Platform - Deployment Guide 🚀

This guide provides instructions for deploying the AI Learning Platform to production using Vercel (Frontend), Render/Railway (Backend), and MongoDB Atlas (Database).

## Prerequisites

1.  **MongoDB Atlas**: Create a free cluster and get your connection string.
2.  **Google AI Studio**: Get your Gemini API key from [aistudio.google.com](https://aistudio.google.com).
3.  **GitHub Account**: For hosting your repository and setting up CI/CD.

---

## 1. Database Setup (MongoDB Atlas)

1.  Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Go to **Network Access** > **Add IP Address**. For Render/Vercel (which use dynamic IPs), add `0.0.0.0/0` (not recommended for strict security, but common for free tier providers) or use specific provider static IPs if available.
3.  Go to **Database Access** and create a user with read/write permissions.
4.  Copy your **Connection String** (SRV).

---

## 2. Backend Deployment (Render / Railway)

### Using Render

1.  Create a new **Web Service**.
2.  Connect your GitHub repository.
3.  Set **Root Directory** to `server`.
4.  **Build Command**: `npm install`
5.  **Start Command**: `npm start`
6.  Add **Environment Variables**:
    - `MONGO_URI`: Your Atlas connection string.
    - `JWT_SECRET`: A long random string.
    - `GEMINI_API_KEY`: Your Google Gemini key.
    - `FRONTEND_URL`: Your Vercel URL (e.g., `https://your-app.vercel.app`).
    - `NODE_ENV`: `production`

---

## 3. Frontend Deployment (Vercel / Netlify)

### Using Vercel

1.  Create a new project on [Vercel](https://vercel.com).
2.  Connect your GitHub repository.
3.  Vercel will automatically detect **Vite**.
4.  Add **Environment Variables**:
    - `VITE_API_URL`: Your Render URL followed by `/api` (e.g., `https://your-api.onrender.com/api`).
5.  Click **Deploy**.

---

## 4. Post-Deployment Checks

1.  **CORS**: Ensure the `FRONTEND_URL` on the backend matches your Vercel URL exactly (no trailing slash).
2.  **API Health**: Visit `https://your-api.onrender.com/api/health` to check if the server is alive and connected to the DB.
3.  **Authentication**: Test the login and registration flow.
4.  **AI Services**: Test the AI tutor chat to ensure the API key is working.

---

## Monitoring & Maintenance

- **Logging**: Check Render/Railway logs for errors.
- **CI/CD**: GitHub Actions will run on every push to `main` to ensure code quality.
- **Backups**: Enable automated backups in MongoDB Atlas.
