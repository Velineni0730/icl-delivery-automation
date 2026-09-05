const mongoose = require("mongoose");

const extensionDB = mongoose.createConnection(
  process.env.MONGO_URI,
  {
    dbName: "extension",
  }
);

extensionDB.on("connected", () => {
  console.log("✅ Extension MongoDB Connected");
});

extensionDB.on("error", (err) => {
  console.error("❌ Extension MongoDB Error:", err);
});

module.exports = extensionDB;