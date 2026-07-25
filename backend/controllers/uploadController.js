const { extractDeliverySheet } = require("../services/aiService");
const calculateAmount = require("../utils/pricing");

exports.uploadImage = async (req, res) => {
  try {

    const extracted = await extractDeliverySheet(req.file.path);

    const rows = extracted.rows.map((row) => ({
      ...row,
      amount: calculateAmount(
        row.awb,
        row.pieces,
        row.weight
      ),
    }));

    res.json({
      success: true,
      date: extracted.date,
      rows,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};