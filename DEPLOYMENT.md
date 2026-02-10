# Deployment Guide

This guide details how to deploy the **Sortd** application. The backend will be deployed on **Render** (as a Web Service) and the frontend on **Vercel**.

## Prerequisites

-   A **GitHub account** with this repository pushed (you have already done this!).
-   An account on **[Render](https://render.com/)**.
-   An account on **[Vercel](https://vercel.com/)**.
-   Your **Gemini API Key**.

---

## 1. Backend Deployment (Render)

We will deploy the backend first to get the API URL.

1.  Log in to **Render** and click **New +** -> **Web Service**.
2.  Connect your GitHub repository (`sortd-monorepo`).
3.  Configure the service:
    -   **Name**: `sortd-backend` (or similar)
    -   **Region**: Choose closest to you (e.g., Singapore, Oregon).
    -   **Branch**: `main`
    -   **Root Directory**: `.` (Keep default / empty)
    -   **Runtime**: **Node**
    -   **Build Command**: `npm install && npm run build --workspace=common && npm run build --workspace=backend`
    -   **Start Command**: `npm start --workspace=backend`
    -   **Instance Type**: Free (if available) or Starter.
4.  **Environment Variables**:
    -   Scroll down to "Environment Variables".
    -   Add `GEMINI_API_KEY`: Paste your actual API key.
    -   Add `PORT`: `3000` (Optional, Render sets `PORT` automatically, but good to be explicit).
5.  Click **Create Web Service**.

Wait for the deployment to finish. Once live, copy the **onrender.com URL** (e.g., `https://sortd-backend.onrender.com`). You will need this for the frontend.

---

## 2. Frontend Deployment (Vercel)

Now we deploy the frontend and connect it to the backend.

1.  Log in to **Vercel** and click **Add New...** -> **Project**.
2.  Import your GitHub repository (`sortd-monorepo`).
3.  Configure the project:
    -   **Project Name**: `sortd-frontend`
    -   **Framework Preset**: **Vite**
    -   **Root Directory**: `.` (Keep as is / project root).
    -   **Build Settings**:
        -   **Build Command**: `npm run build --workspace=frontend`
        -   **Output Directory**: `frontend/dist`
        -   **Install Command**: `npm install`
4.  **Environment Variables**:
    -   Expand "Environment Variables".
    -   Add `VITE_API_URL`: The **Backend URL** from Step 1 (e.g., `https://sortd-backend.onrender.com`).
        -   *Note: Do NOT include a trailing slash `/`.*
5.  Click **Deploy**.

Vercel will build the project. It handles the monorepo structure by installing dependencies at the root.

---

## 3. Verify Deployment

1.  Open your **Vercel App URL** (e.g., `https://sortd-frontend.vercel.app`).
2.  Allow microphone permissions if prompted.
3.  Try recording or typing test input.
4.  If it works, the frontend is successfully talking to the remote backend!

> **Troubleshooting**: If calls fail, check the browser console (F12) -> Network tab. If you see CORS errors, ensure your Backend is running and check if the browser is blocking requests (rare for public APIs). We enabled CORS on the backend for all origins (`app.use(cors())`), so it should work out of the box.
