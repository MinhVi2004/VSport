const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

// Import routes
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Test route
app.get("/", (req, res) => {
  res.send("🚀 API is running!");
});

// Connect DB
connectDB();

// Log loading routes
console.log("✅ Loading routes...");

try {
  app.use("/api/user", userRoutes);
  console.log("✅ /api/user routes loaded");

  app.use("/api/product", productRoutes);
  console.log("✅ /api/product routes loaded");

  app.use("/api/cart", cartRoutes);
  console.log("✅ /api/cart routes loaded");

  app.use("/api/order", orderRoutes);
  console.log("✅ /api/order routes loaded");


  app.use("/api/banner", bannerRoutes);
  console.log("✅ /api/banner routes loaded");

  app.use("/api/category", categoryRoutes);
  console.log("✅ /api/category routes loaded");

} catch (err) {
  console.error("❌ Error when loading routes:", err.message);
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
