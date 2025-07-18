const express = require("express");
const app = express();  
const connectDB = require("./config/db");
const cors = require("cors");


const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const addressRoutes = require("./routes/addressRoutes");


require("dotenv").config();


//? Kết nối MongoDB
connectDB(); 

app.use(cors()); 
app.use(express.json());

//?  Routes
app.use("/api/user", userRoutes);

app.use("/api/category", categoryRoutes);

app.use("/api/product", productRoutes);

app.use("/api/banner", bannerRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/order", orderRoutes);

app.use("/api/address", addressRoutes);

//? Listen
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});