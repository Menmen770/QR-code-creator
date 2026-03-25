import { useEffect, useState } from "react";
import { API_BASE } from "../config";
import {
  getStickerOverlayUrl,
  isImageStickerId,
  STICKER_QR_NORMALIZED_RECT,
} from "../assets/stickerAssets";
import { drawStickerImageComposite } from "../utils/stickerCompose";
import { paintExportBackground } from "../utils/qrExportBackground";

const RECENT_QR_KEY = "qrMasterRecentHistory";

export function useQrGenerator() {
  const [qrType, setQrType] = useState("url");
  const [qrValue, setQrValue] = useState("https://example.com");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [fgColor, setFgColor] = useState("#000000");
  const [qrImage, setQrImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fgColorMode, setFgColorMode] = useState("solid");
  const [fgEffect, setFgEffect] = useState("none");
  const [bgColorMode, setBgColorMode] = useState("solid");
  const [bgEffect, setBgEffect] = useState("none");
  const [pdfFile, setPdfFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pdfInputMode, setPdfInputMode] = useState("file");
  const [dotsType, setDotsType] = useState("square");
  const [cornersType, setCornersType] = useState("square");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [isLogoDragging, setIsLogoDragging] = useState(false);
  const [logoInputMode, setLogoInputMode] = useState("file");
  const [logoShape, setLogoShape] = useState("square");
  const [stickerType, setStickerType] = useState("none");
  const [previewWithSticker, setPreviewWithSticker] = useState("");

  const [qrInputs, setQrInputs] = useState({
    url: "https://example.com",
    pdf: "",
    whatsapp: { phone: "+972", message: "" },
    email: { email: "", subject: "", message: "" },
    phone: "+972",
    sms: { phone: "+972", message: "" },
    wifi: { ssid: "Network", password: "", security: "WPA" },
    contact: { name: "", phone: "+972", email: "" },
    facebook: "username",
    instagram: "username",
    twitter: "username",
    linkedin: "username",
    youtube: "username",
    tiktok: "username",
  });

  const getEffectBackground = (effectId) => {
    const gradients = {
      none: "#ffffff",
      "sunset-silk": "linear-gradient(135deg, #f97316 0%, #ec4899 100%)",
      "warm-terracotta": "linear-gradient(135deg, #d6a57f 0%, #a16207 100%)",
      "classic-peach": "linear-gradient(135deg, #fdba74 0%, #f9a8d4 100%)",
      "golden-hour": "linear-gradient(135deg, #fbbf24 0%, #fb923c 100%)",
      "soft-rose": "linear-gradient(135deg, #fbcfe8 0%, #f9a8d4 100%)",
      "desert-sand": "linear-gradient(135deg, #fde68a 0%, #fdba74 100%)",
      "ocean-breeze": "linear-gradient(135deg, #93c5fd 0%, #60a5fa 100%)",
      "purple-dream": "linear-gradient(135deg, #c4b5fd 0%, #a78bfa 100%)",
      "mint-fresh": "linear-gradient(135deg, #99f6e4 0%, #5eead4 100%)",
      "coral-reef": "linear-gradient(135deg, #fdba74 0%, #fb7185 100%)",
      "lavender-mist": "linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%)",
    };
    return gradients[effectId] || "#ffffff";
  };

  const buildQRValue = (type, inputs) => {
    switch (type) {
      case "url":
        return inputs.url;
      case "pdf":
        return inputs.pdf;
      case "whatsapp":
        return `https://wa.me/${inputs.whatsapp.phone.replace(/\D/g, "")}?text=${encodeURIComponent(inputs.whatsapp.message)}`;
      case "email": {
        const emailParams = new URLSearchParams();
        if (inputs.email.subject) {
          emailParams.append("subject", inputs.email.subject);
        }
        if (inputs.email.message) {
          emailParams.append("body", inputs.email.message);
        }
        return `mailto:${inputs.email.email}${emailParams.toString() ? "?" + emailParams.toString() : ""}`;
      }
      case "phone":
        return `tel:${inputs.phone}`;
      case "sms":
        return `sms:${inputs.sms.phone}?body=${encodeURIComponent(inputs.sms.message)}`;
      case "wifi":
        return `WIFI:T:${inputs.wifi.security};S:${inputs.wifi.ssid};P:${inputs.wifi.password};;`;
      case "contact":
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${inputs.contact.name}\nTEL:${inputs.contact.phone}\nEMAIL:${inputs.contact.email}\nEND:VCARD`;
      case "facebook":
        return `https://facebook.com/${inputs.facebook}`;
      case "instagram":
        return `https://instagram.com/${inputs.instagram}`;
      case "twitter":
        return `https://twitter.com/${inputs.twitter}`;
      case "linkedin":
        return `https://linkedin.com/in/${inputs.linkedin}`;
      case "youtube":
        return `https://youtube.com/@${inputs.youtube}`;
      case "tiktok":
        return `https://tiktok.com/@${inputs.tiktok}`;
      default:
        return inputs.url;
    }
  };

  const handleQRTypeChange = (newType) => {
    setQrType(newType);
    setQrValue(buildQRValue(newType, qrInputs));
  };

  const handleInputChange = (path, value) => {
    const newInputs = JSON.parse(JSON.stringify(qrInputs));
    const keys = path.split(".");
    let obj = newInputs;
    for (let i = 0; i < keys.length - 1; i++) {
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
    setQrInputs(newInputs);
    setQrValue(buildQRValue(qrType, newInputs));
  };

  const handlePdfDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    }
  };

  const handlePdfDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handlePdfDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handlePdfFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    }
  };

  const handleLogoDrop = (e) => {
    e.preventDefault();
    setIsLogoDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoDragOver = (e) => {
    e.preventDefault();
    setIsLogoDragging(true);
  };

  const handleLogoDragLeave = (e) => {
    e.preventDefault();
    setIsLogoDragging(false);
  };

  const handleLogoFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateQR = async (text, fg, bg) => {
    if (!text.trim()) {
      setQrImage("");
      return;
    }

    setLoading(true);
    setError("");

    try {
      /* With sticker, QR must be transparent so step-3 background shows through the hole */
      const bgForAPI =
        stickerType !== "none"
          ? "transparent"
          : bgColorMode === "effect" || bgColorMode === "none"
            ? "transparent"
            : bg;

      const requestBody = {
        text,
        color: fg,
        bgColor: bgForAPI,
        dotsType,
        cornersType,
      };

      if (logoUrl) {
        requestBody.image = logoUrl;
        requestBody.logoShape = logoShape;
      }

      const response = await fetch(`${API_BASE}/api/generate-qr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      setQrImage(data.qrImage);
    } catch {
      setError("Failed to generate QR code");
      setQrImage("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (qrType === "pdf" && pdfInputMode === "file" && !qrInputs.pdf) {
        setQrImage("");
        return;
      }
      generateQR(qrValue, fgColor, bgColor);
    }, 400);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [
    qrValue,
    fgColor,
    bgColor,
    bgColorMode,
    bgEffect,
    qrType,
    pdfInputMode,
    qrInputs.pdf,
    dotsType,
    cornersType,
    logoUrl,
    logoShape,
    stickerType,
  ]);

  useEffect(() => {
    generateQR(qrValue, fgColor, bgColor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!qrImage || stickerType === "none") {
      setPreviewWithSticker("");
      return;
    }
    const overlayUrl = getStickerOverlayUrl(stickerType);
    if (!overlayUrl) {
      setPreviewWithSticker("");
      return;
    }
    const qrImg = new Image();
    const overlayImg = new Image();
    let qrOk = false;
    let ovOk = false;
    const tryComposite = () => {
      if (!qrOk || !ovOk) return;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { alpha: true });
      drawStickerImageComposite(
        ctx,
        qrImg,
        overlayImg,
        fgColor,
        STICKER_QR_NORMALIZED_RECT,
      );
      setPreviewWithSticker(canvas.toDataURL("image/png"));
    };
    qrImg.onload = () => {
      qrOk = true;
      tryComposite();
    };
    overlayImg.onload = () => {
      ovOk = true;
      tryComposite();
    };
    qrImg.onerror = () => setPreviewWithSticker("");
    overlayImg.onerror = () => setPreviewWithSticker("");
    qrImg.src = qrImage;
    overlayImg.src = overlayUrl;
  }, [qrImage, stickerType, fgColor]);

  const downloadQR = (format) => {
    if (!qrImage) return;

    try {
      const entry = {
        id: Date.now(),
        type: qrType,
        value: String(qrValue || "").trim(),
        createdAt: new Date().toISOString(),
      };

      const existing = JSON.parse(localStorage.getItem(RECENT_QR_KEY) || "[]");
      const deduped = existing.filter(
        (item) => !(item.type === entry.type && item.value === entry.value),
      );
      const next = [entry, ...deduped].slice(0, 8);
      localStorage.setItem(RECENT_QR_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("qr-recent-updated"));
    } catch {
      // ignore localStorage issues
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { alpha: true });
    const img = new Image();

    img.onload = () => {
      const isPng = format === "png";
      const qrScale = isPng ? 1.12 : 1;
      const extraPadding = isPng ? Math.round(img.width * 0.12) : 0;
      const qrDrawWidth = Math.round(img.width * qrScale);
      const qrDrawHeight = Math.round(img.height * qrScale);

      const hasSticker = isPng && stickerType !== "none" && isImageStickerId(stickerType);
      const overlayUrl = hasSticker ? getStickerOverlayUrl(stickerType) : null;

      const finishBlob = () => {
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `qr-code.${format}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, `image/${format}`);
      };

      const exportBgState = {
        bgColorMode,
        bgColor,
        bgEffect,
        getEffectBackground,
      };

      if (hasSticker && overlayUrl) {
        const overlayImg = new Image();
        overlayImg.onload = () => {
          drawStickerImageComposite(
            ctx,
            img,
            overlayImg,
            fgColor,
            STICKER_QR_NORMALIZED_RECT,
            exportBgState,
          );
          finishBlob();
        };
        overlayImg.onerror = finishBlob;
        overlayImg.src = overlayUrl;
        return;
      }

      canvas.width = qrDrawWidth + extraPadding * 2;
      canvas.height = qrDrawHeight + extraPadding * 2;
      const drawX = extraPadding;
      const drawY = extraPadding;

      paintExportBackground(ctx, canvas.width, canvas.height, exportBgState);
      ctx.drawImage(img, drawX, drawY, qrDrawWidth, qrDrawHeight);

      finishBlob();
    };

    img.src = qrImage;
  };

  return {
    qrType,
    setQrType,
    qrValue,
    setQrValue,
    bgColor,
    setBgColor,
    fgColor,
    setFgColor,
    qrImage,
    previewImage: stickerType !== "none" && previewWithSticker ? previewWithSticker : qrImage,
    loading,
    error,
    fgColorMode,
    setFgColorMode,
    fgEffect,
    setFgEffect,
    bgColorMode,
    setBgColorMode,
    bgEffect,
    setBgEffect,
    pdfFile,
    setPdfFile,
    isDragging,
    pdfInputMode,
    setPdfInputMode,
    dotsType,
    setDotsType,
    cornersType,
    setCornersType,
    logoUrl,
    setLogoUrl,
    logoFile,
    setLogoFile,
    isLogoDragging,
    logoInputMode,
    setLogoInputMode,
    logoShape,
    setLogoShape,
    stickerType,
    setStickerType,
    qrInputs,
    handleQRTypeChange,
    handleInputChange,
    handlePdfDrop,
    handlePdfDragOver,
    handlePdfDragLeave,
    handlePdfFileSelect,
    handleLogoDrop,
    handleLogoDragOver,
    handleLogoDragLeave,
    handleLogoFileSelect,
    getEffectBackground,
    downloadQR,
  };
}
