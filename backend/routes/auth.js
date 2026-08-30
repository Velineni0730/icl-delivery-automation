const express = require("express");
const router = express.Router();

const msalClient = require("../services/msal");
const Upload = require("../models/upload");
const { appendShipments, findDuplicateAwbs, } = require("../services/excelService");

router.get("/microsoft", async (req, res) => {
  try {
    const uploadId = req.query.uploadId;

    const authUrl = await msalClient.getAuthCodeUrl({
      state: uploadId,
      scopes: [
        "User.Read",
        "Files.ReadWrite",
        "offline_access",
        "openid",
        "profile",
        "email",
      ],
      redirectUri: process.env.REDIRECT_URI,
    });

    res.redirect(authUrl);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

router.get("/callback", async (req, res) => {
    try {
        const tokenResponse = await msalClient.acquireTokenByCode({
            code: req.query.code,
            scopes: [
                "User.Read",
                "Files.ReadWrite",
                "offline_access",
            ],
            redirectUri: process.env.REDIRECT_URI,
        });

        const uploadId = req.query.state;
        const upload = await Upload.findById(uploadId);

if (!upload) {

  return res.status(404).send("Upload not found");

}

if (upload.status === "AddedToExcel") {

  return res.redirect(process.env.FRONTEND_URL);

}

try {
  const duplicates = await findDuplicateAwbs(
    tokenResponse.accessToken,
    upload.rows,
    upload.sheetDate
  );

  if (duplicates.length > 0) {
    console.log("Duplicate AWBs found:", duplicates);

    return res.redirect(
      `${process.env.FRONTEND_URL}/home?duplicateAwbs=${encodeURIComponent(
        duplicates.join(",")
      )}`
    );
  }

  await appendShipments(
    tokenResponse.accessToken,
    upload.rows,
    upload.sheetDate
  );

  upload.status = "AddedToExcel";
  await upload.save();

  return res.redirect(process.env.FRONTEND_URL);

} catch (err) {
  console.error("Excel Error:", err);
  return res.status(500).send(err.message);
}

return res.redirect(process.env.FRONTEND_URL);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

module.exports = router;