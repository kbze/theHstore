# THE 8 STORE 

A modern, full-stack e-commerce web application with a premium black and white aesthetic.
Built with Next.js (App Router), Node.js, Express, and MongoDB.

## Features
- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Auth**: JWT-based Authentication & bcrypt password hashing
- **UI/UX**: Responsive Premium Monochromatic Design
- **Checkout**: Sham Cash Manual Payment Flow (with receipt screenshots)
- **Admin**: Dashboard to verify Sham Cash transactions

---

## 🚀 Setup Instructions (Local Development)

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Environment Variables:
   Copy `.env.example` to `.env` and update variables:
   ```bash
   cp .env.example .env
   ```
   *Make sure MongoDB is running locally or provide a MongoDB Atlas URI.*
4. Start the server:
   ```bash
   npm run dev
   # Server will run on http://localhost:5000
   ```

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   # Frontend will run on http://localhost:3000
   ```
4. Access the application at [http://localhost:3000](http://localhost:3000)

---

## 🌍 Deployment Guide

### Frontend (Next.js) -> Vercel

Vercel is the easiest and most optimized place to host a Next.js app.
1. Push your repository to GitHub.
2. Go to [Vercel](https://vercel.com) and import the repository.
3. Important: Set the "Root Directory" to `frontend`.
4. Leave build command as default (`npm run build`).
5. Click **Deploy**.

### Backend (Node.js/Express) -> Render or Railway

For a Node API with file uploads (Multer), a VPS or a free-tier PaaS like Render works well. 

**Using Render:**
1. Create a "Web Service" on [Render](https://render.com).
2. Connect your GitHub repository.
3. Set the Root Directory to `backend`.
4. **Build Command**: `npm install`
5. **Start Command**: `node index.js`
6. **Environment Variables**:
   Add `MONGODB_URI` and `JWT_SECRET`.
7. **Important for Uploads (Multer)**: Free Render tiers have ephemeral filesystems. Uploaded screenshots inside `/uploads` will disappear upon restart. For a production app, replace Multer's local disk storage with AWS S3 or Cloudinary.
   If deploying to a VPS (DigitalOcean/Hetzner), the local filesystem is persistent and Multer disk storage works fine.

---

## 🎨 Design System
- **Colors**: Monochromatic (#000000, #ffffff, with shades of gray).
- **Typography**: Inter (Sans-Serif), uppercase, widely tracked headings.
- **Interactions**: Subtle scale transitions, monochromatic hover states.
