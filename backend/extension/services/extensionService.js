const { extractDeliverySheet } = require("../../services/aiService");
const calculateAmount = require("../../utils/pricing");
const ExtensionSheet = require("../models/extensionSheet");

async function processExtensionSheet(imagePath) {
  const extracted = await extractDeliverySheet(imagePath);

  const rows = extracted.rows.map((row) => ({
    serialNumber: row.serialNumber,
    awb: row.awb,
    pieces: Number(row.pieces),
    weight: Number(row.weight),

    amount: calculateAmount(
      row.awb,
      row.pieces,
      row.weight
    ),

    deliveryDetails: {
      phone: row.deliveryDetails?.phone ?? null,
      sign: row.deliveryDetails?.sign ?? null,
      stamp: row.deliveryDetails?.stamp ?? false,
    },
  }));

  const totalShipments = rows.length;

  const totalAmount = rows.reduce(
    (sum, row) => sum + row.amount,
    0
  );

  const sheet = await ExtensionSheet.create({
    sheetDate: extracted.date,
    deliveryStaff: extracted.deliveryStaff,
    rows,
    totalShipments,
    totalAmount,
    status: "Pending",
  });

  return sheet;
}

module.exports = {
  processExtensionSheet,
};