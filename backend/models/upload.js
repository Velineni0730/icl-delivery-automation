const mongoose = require("mongoose");

const rowSchema = new mongoose.Schema({
  awb: String,
  pieces: Number,
  weight: Number,
  amount: Number,
});

const uploadSchema = new mongoose.Schema({
  uploadedBy: {
    type: String,
    default: "admin",
  },

  imagePath: String,

  sheetDate: String,

  rows: [rowSchema],

  totalShipments: Number,

  totalAmount: Number,

  status: {
    type: String,
    default: "Pending",
  },

  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Upload", uploadSchema);