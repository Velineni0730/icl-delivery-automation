const express = require("express");
const multer = require("multer");

const {
  uploadImage,
  getUploads,
  getUpload,
  updateUpload,
  getPendingUploads,
  getLogs,
  confirmUpload,
} = require("../controllers/uploadController");

const router = express.Router();
router.patch("/:id", updateUpload);
router.get("/", getUploads);
router.get("/pending", getPendingUploads);
router.get("/logs", getLogs);
router.get("/:id", getUpload);

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("image"), uploadImage);
router.post("/:id/confirm", confirmUpload);

module.exports = router;