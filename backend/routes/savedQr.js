const express = require("express");
const mongoose = require("mongoose");
const SavedQr = require("../models/SavedQr");
const { requireAuth } = require("../middleware/requireAuth");

const router = express.Router();

const MAX_LOGO_URL_LENGTH = 450_000;

function trimBodyForStorage(body) {
  const { qrType, qrValue, qrInputs, style } = body;
  if (!qrType || typeof qrType !== "string") {
    return null;
  }
  let logoUrl = typeof style?.logoUrl === "string" ? style.logoUrl : "";
  if (logoUrl.length > MAX_LOGO_URL_LENGTH) {
    logoUrl = "";
  }
  const valueTrimmed =
    typeof qrValue === "string" ? qrValue.trim() : "";
  return {
    qrType,
    qrValue: valueTrimmed,
    qrInputs: qrInputs && typeof qrInputs === "object" ? qrInputs : {},
    style: {
      fgColor: style?.fgColor ?? "#000000",
      bgColor: style?.bgColor ?? "#ffffff",
      bgColorMode: style?.bgColorMode ?? "solid",
      bgEffect: style?.bgEffect ?? "none",
      dotsType: style?.dotsType ?? "square",
      cornersType: style?.cornersType ?? "square",
      logoUrl,
      logoShape: style?.logoShape ?? "square",
      stickerType: style?.stickerType ?? "none",
      pdfInputMode: style?.pdfInputMode ?? "file",
      logoInputMode: style?.logoInputMode ?? "file",
    },
  };
}

router.get("/saved-qrs", requireAuth, async (req, res) => {
  try {
    const limit = Math.min(
      50,
      Math.max(1, parseInt(String(req.query.limit || "20"), 10) || 20),
    );
    const items = await SavedQr.find({ userId: req.session.userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    res.json({ items });
  } catch (err) {
    console.error("List saved QR error:", err);
    res.status(500).json({ error: "Failed to list saved QR codes" });
  }
});

router.post("/saved-qrs", requireAuth, async (req, res) => {
  const trimmed = trimBodyForStorage(req.body);
  if (!trimmed) {
    return res.status(400).json({ error: "qrType is required" });
  }
  try {
    const userId = req.session.userId;
    const filter = {
      userId,
      qrType: trimmed.qrType,
      qrValue: trimmed.qrValue,
    };

    const existing = await SavedQr.findOne(filter);
    if (existing) {
      existing.qrInputs = trimmed.qrInputs;
      existing.style = trimmed.style;
      await existing.save();
      return res.json({
        updated: true,
        saved: {
          _id: existing._id,
          qrType: existing.qrType,
          qrValue: existing.qrValue,
          qrInputs: existing.qrInputs,
          style: existing.style,
          createdAt: existing.createdAt,
          updatedAt: existing.updatedAt,
        },
      });
    }

    const doc = await SavedQr.create({
      userId,
      ...trimmed,
    });
    res.status(201).json({
      updated: false,
      saved: {
        _id: doc._id,
        qrType: doc.qrType,
        qrValue: doc.qrValue,
        qrInputs: doc.qrInputs,
        style: doc.style,
        createdAt: doc.createdAt,
      },
    });
  } catch (err) {
    console.error("Save QR error:", err);
    res.status(500).json({ error: "Failed to save QR code" });
  }
});

router.delete("/saved-qrs/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }
  try {
    const result = await SavedQr.deleteOne({
      _id: id,
      userId: req.session.userId,
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Not found" });
    }
    res.json({ ok: true });
  } catch (err) {
    console.error("Delete saved QR error:", err);
    res.status(500).json({ error: "Failed to delete" });
  }
});

module.exports = router;
