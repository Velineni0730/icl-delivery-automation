const { processExtensionSheet } = require("../services/extensionService");

exports.uploadExtensionSheet = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Delivery sheet image is required.",
      });
    }

    const sheet = await processExtensionSheet(req.file.path);

    res.json({
      success: true,
      sheet,
    });

  } catch (err) {
    console.error("Extension upload error:", err);

    const errorText = JSON.stringify(err).toLowerCase();

   if (
  err.status === 429 ||
  err.status === 503 ||
  err.message?.includes("429") ||
  err.message?.includes("503") ||
  err.message?.includes("RESOURCE_EXHAUSTED") ||
  err.message?.toLowerCase().includes("quota") ||
  err.message?.toLowerCase().includes("high demand")
) {
  return res.status(err.status || 503).json({
    success: false,
    message: "Gemini is temporarily unavailable. Please try again.",
  });
}

    res.status(500).json({
      success: false,
      message: "Failed to process delivery sheet.",
    });
  }
};