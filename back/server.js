const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");

const connectDB = require("./config/db");
const setupSwagger = require("./swagger");

// Import routes
const addressRoutes = require("./routes/addressRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const forgetPasswordRoutes = require("./routes/ForgetPasswordRoutes");
const emailRoutes = require("./routes/emailRoutes");
const staffRoutes = require("./routes/staffRoutes");

/* =======================
   CORS CONFIG
======================= */
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONT_END,
];

app.use(
  cors({
    origin: function (origin, callback) {
      // cho phép Postman / cron / server-side
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

/* =======================
   BODY PARSER
======================= */
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* =======================
   HEALTH CHECK (CHO CRON)
======================= */
app.get("/health", (req, res) => {
  res.status(200).send("ok");
});

/* =======================
   LAZY DB CONNECTION
   (QUAN TRỌNG CHO RENDER)
======================= */
app.use(async (req, res, next) => {
  // health check không cần DB
  if (req.path === "/health") return next();

  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("DB connection error:", error.message);
    res.status(500).json({ message: "Database connection failed" });
  }
});

/* =======================
   ROOT TEST
======================= */
app.get("/", (req, res) => {
  res.send("🚀 API is running!");
});

/* =======================
   ROUTES
======================= */
try {
  app.use("/api/user", userRoutes);
  app.use("/api/product", productRoutes);
  app.use("/api/address", addressRoutes);
  app.use("/api/cart", cartRoutes);
  app.use("/api/order", orderRoutes);
  app.use("/api/banner", bannerRoutes);
  app.use("/api/category", categoryRoutes);
  app.use("/api/forget", forgetPasswordRoutes);
  app.use("/api/email", emailRoutes);
  app.use("/api/staff", staffRoutes);
} catch (err) {
  console.error("Error loading routes:", err.message);
}

/* =======================
   SWAGGER (DEV ONLY)
======================= */
if (process.env.NODE_ENV !== "production") {
  setupSwagger(app);
}

/* =======================
   START SERVER
======================= */
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
