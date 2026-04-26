const express = require("express");
const mongoose = require("mongoose");
const SavedQr = require("../models/SavedQr");
const { requireAuth } = require("../middleware/requireAuth");

const router = express.Router();

const MAX_LOGO_URL_LENGTH = 450_000;

const MAX_DISPLAY_NAME = 120;

function trimBodyForStorage(body) {
  const { qrType, qrValue, qrInputs, style, displayName } = body;
  if (!qrType || typeof qrType !== "string") {
    return null;
  }
  let logoUrl = typeof style?.logoUrl === "string" ? style.logoUrl : "";
  if (logoUrl.length > MAX_LOGO_URL_LENGTH) {
    logoUrl = "";
  }
  const valueTrimmed =
    typeof qrValue === "string" ? qrValue.trim() : "";
  const nameRaw = typeof displayName === "string" ? displayName.trim() : "";
  const displayNameTrimmed = nameRaw.slice(0, MAX_DISPLAY_NAME);
  return {
    qrType,
    qrValue: valueTrimmed,
    displayName: displayNameTrimmed,
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

function escapeRegex(str) {
  return String(str || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

router.get("/saved-qrs", requireAuth, async (req, res) => {
  try {
    const limit = Math.min(
      50,
      Math.max(1, parseInt(String(req.query.limit || "20"), 10) || 20),
    );
    const qRaw =
      typeof req.query.q === "string" ? req.query.q.trim() : "";
    const filter = { userId: req.userId };
    if (qRaw) {
      filter.displayName = {
        $regex: escapeRegex(qRaw),
        $options: "i",
      };
    }
    const items = await SavedQr.find(filter)
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
  if (!trimmed.displayName) {
    return res
      .status(400)
      .json({ error: "displayName is required to save a QR code" });
  }
  try {
    const userId = req.userId;
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
        displayName: doc.displayName || "",
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
      userId: req.userId,
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
