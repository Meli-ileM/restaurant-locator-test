const express = require("express");
const cors = require("cors");
const restaurantRoutes = require("./routes/restaurantRoutes");

const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/restaurants", restaurantRoutes);

module.exports = app;
