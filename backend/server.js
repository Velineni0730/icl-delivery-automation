require("dotenv").config();
const authRoutes = require("./routes/auth");

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const uploadRoutes = require("./routes/upload");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(console.error);

app.get("/", (req, res) => {
  res.json({
    message: "Backend Running 🚀",
  });
});

app.use("/auth", authRoutes);
app.use("/upload", uploadRoutes);

const PORT = process.env.PORT || 7777;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});