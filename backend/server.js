require("dotenv").config();

const express = require("express");
const cors = require("cors");
const uploadRoutes = require("./routes/upload");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Backend Running 🚀",
  });
});

const PORT = process.env.PORT || 7777;

app.use("/upload", uploadRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});