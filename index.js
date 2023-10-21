const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const path = require("path");
const userRoutes = require("./api/user");
const serviceRoutes = require('./api/services');
const subserviceRoutes = require('./api/subServices');

mongoose.connect("mongodb+srv://mrbaigdev:4qauLuS5HAQpZRYD@notification.ta4azjv.mongodb.net/", (err, data) => {
  if (err) throw new Error("Database connection lost!");
  console.log("DB Connected!");
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to API" });
});

// CALL API Routes
app.use('/api', serviceRoutes);
app.use("/", userRoutes);
app.use('/', subserviceRoutes);

app.listen(5000, () => console.log("Server is running at port 5000"));
