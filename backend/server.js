import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import { clerkWebhook } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educatorRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import courseRouter from "./routes/courseRoute.js";
import userRouter from "./routes/userRouter.js";
// Webhook controller

// --- Configuration & Initialization ---

const PORT = process.env.PORT || 5000; // Common practice is to use 5000 or 8080
const app = express();

// --- 1. Webhook Route (Requires raw body) ---
app.post("/clerk", express.raw({ type: "application/json" }), clerkWebhook);

// --- 2. Global Middleware (For all other routes) ---
app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());

// --- 3.  Connections ---
connectDB();
connectCloudinary();

// --- 4. API Routes ---
app.use("/api/educator", express.json(), educatorRouter); 
app.use("/api/course", express.json(), courseRouter);
app.use("/api/user", express.json(), userRouter);
// app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

// --- 5. Health Check/Keep-Alive Route ---
app.get("/api/ping", (req, res) => {
  res.status(200).json({ status: "ok", message: "pong" });
});

// --- 6. Server Listener ---
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
