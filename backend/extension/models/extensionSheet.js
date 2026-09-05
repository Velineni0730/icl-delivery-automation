const mongoose = require("mongoose");
const extensionDB = require("../extensionDB");

const deliveryDetailsSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      default: null,
    },

    sign: {
      type: String,
      default: null,
    },

    stamp: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const rowSchema = new mongoose.Schema(
  {
    serialNumber: Number,
    awb: String,
    pieces: Number,
    weight: Number,
    amount: Number,

    deliveryDetails: {
      type: deliveryDetailsSchema,
      default: {},
    },
  },
  { _id: false }
);

const extensionSheetSchema = new mongoose.Schema({
  sheetDate: String,
  deliveryStaff: String,

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

module.exports = mongoose.model(
  "ExtensionSheet",
  extensionSheetSchema,
  "extensionSheets"
);