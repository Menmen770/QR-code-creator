const express = require("express");
const { generateQrDataUrl } = require("../services/qrGenerator");

const router = express.Router();

router.post("/generate-qr", async (req, res) => {
  try {
    const qrImage = await generateQrDataUrl(req.body);
    res.json({ qrImage });
  } catch (err) {
    if (err.statusCode === 400) {
      return res.status(400).json({ error: err.message });
    }
    console.error("QR Generation Error:", err.message);
    res.status(500).json({ error: "Failed to generate QR code" });
  }
});

module.exports = router;
