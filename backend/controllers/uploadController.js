const { extractDeliverySheet } = require("../services/aiService");
const calculateAmount = require("../utils/pricing");
const Upload = require("../models/upload");

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

    const totalShipments = rows.length;

    const totalAmount = rows.reduce(
      (sum, row) => sum + row.amount,
      0
    );

    const upload = await Upload.create({
      uploadedBy: "admin",
      imagePath: req.file.path,
      sheetDate: extracted.date,
      rows,
      totalShipments,
      totalAmount,
      status: "Pending",
    });

    res.json({
      success: true,
      uploadId: upload._id,
      date: extracted.date,
      rows,
      totalShipments,
      totalAmount,
    });

  } catch (err) {
  console.log("========== GEMINI ERROR ==========");

  console.log("Message:", err.message);

  console.log("Name:", err.name);

  console.log("Status:", err.status);

  console.log("Code:", err.code);

  console.log("Full Error:", err);

  console.log("==================================");

  const errorText = JSON.stringify(err).toLowerCase();

  if (
    err.message?.includes("429") ||
    err.message?.includes("RESOURCE_EXHAUSTED") ||
    err.message?.toLowerCase().includes("quota") ||
    errorText.includes("429") ||
    errorText.includes("resource_exhausted")
  ) {
    return res.status(429).json({
      success: false,
      message:
        "Gemini API rate limit reached. Please wait a few minutes and try again.",
    });
  }

  res.status(500).json({
    success: false,
    message: "Failed to process delivery sheet.",
  });
}
};
exports.getUploads = async (req, res) => {
  try {
    const uploads = await Upload.find()
      .sort({ uploadedAt: -1 });

    res.json({
      success: true,
      uploads,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateUpload = async (req, res) => {
  try {
    const { rows, status } = req.body;

    if (rows.length === 0) {
      await Upload.findByIdAndDelete(req.params.id);

      return res.json({
        success: true,
        deleted: true,
      });
    }

    const totalShipments = rows.length;

    const totalAmount = rows.reduce(
      (sum, row) => sum + Number(row.amount),
      0
    );

    const upload = await Upload.findByIdAndUpdate(
      req.params.id,
      {
        rows,
        totalShipments,
        totalAmount,
        ...(status && { status }),
      },
      {
        returnDocument: "after",
      }
    );

    res.json({
      success: true,
      upload,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getUpload = async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);

    if (!upload) {
      return res.status(404).json({
        success: false,
        message: "Upload not found",
      });
    }

    res.json({
      success: true,
      upload,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getPendingUploads = async (req, res) => {
  try {
    const uploads = await Upload.find({ status: "Pending" })
      .sort({ uploadedAt: -1 });

    res.json({
      success: true,
      uploads,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getLogs = async (req, res) => {
  try {

    const logs = await Upload.find({
      status: "AddedToExcel",
    }).sort({
      uploadedAt: -1,
    });

    res.json({
      success: true,
      logs,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

exports.confirmUpload = async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);

    if (!upload) {
      return res.status(404).json({
        success: false,
        message: "Upload not found",
      });
    }

    if (upload.status === "AddedToExcel") {
      return res.json({
        success: true,
        message: "Already added to Excel.",
      });
    }

    res.json({
      success: true,
      redirect: `${process.env.API_URL}/auth/microsoft?uploadId=${upload._id}`,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};