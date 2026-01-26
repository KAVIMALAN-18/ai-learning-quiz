# AI Learning Platform - Deployment Guide

This guide provides step-by-step instructions for deploying the LearnSphere AI Learning Platform to production.

## 🚀 Recommended Hosting
- **Frontend**: Vercel or Netlify (best for Vite/React)
- **Backend**: Render, Railway, or Fly.io (best for Node.js)
- **Database**: MongoDB Atlas (Free Tier available)

---

## 🛠️ Step 1: Database Setup (MongoDB Atlas)
1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new Cluster (Shared/FREE).
3. Under **Network Access**, add `0.0.0.0/0` (or specifically whitelist your hosting provider IPs).
4. Under **Database Access**, create a user and copy the connection string.

---

## 📦 Step 2: Backend Deployment (Render Example)
1. Create a new **Web Service** on Render.
2. Connect your GitHub repository.
3. **Build Command**: `cd server && npm install`
4. **Start Command**: `node index.js`
5. Add the following **Environment Variables**:
   - `MONGO_URI`: Your MongoDB Atlas string.
   - `JWT_SECRET`: A long, random string.
   - `AI_API_KEY`: Your Gemini API Key.
   - `NODE_ENV`: `production`
   - `CORS_ORIGIN`: Your frontend URL (e.g., `https://learn-sphere.vercel.app`).

---

## 💻 Step 3: Frontend Deployment (Vercel Example)
1. Create a new project on Vercel.
2. Select the repository.
3. **Framework Preset**: Vite
4. **Root Directory**: `./` (Root of the repo)
5. **Build Command**: `npm run build`
6. **Output Directory**: `dist`
7. Add **Environment Variables**:
   - `VITE_API_URL`: Your backend URL (e.g., `https://learn-sphere-api.onrender.com/api`).

---

## 🛡️ Security Checklist
- [ ] Ensure `NODE_ENV` is set to `production`.
- [ ] Verify `helmet` headers are present in network responses.
- [ ] Check that `CORS` only allows your production frontend domain.
- [ ] Ensure all API keys are stored in environment variables, NEVER in code.

## 📈 Performance Checklist
- [ ] Verify `compression` (Gzip) is active.
- [ ] Confirm route-based code splitting is working (Network tab shows multiple JS chunks).
- [ ] Ensure images are optimized before upload.

## 🛠️ Troubleshooting
- **CORS Errors**: Double check the `CORS_ORIGIN` on the backend matches the frontend URL exactly (including https and no trailing slash).
- **MongoDB Connection**: Ensure IP whitelisting is configured in Atlas.
- **Login Issues**: Check `JWT_SECRET` is identical if you have multiple backend instances.
