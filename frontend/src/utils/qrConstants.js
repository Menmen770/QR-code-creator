import {
  FiLink,
  FiFileText,
  FiMail,
  FiPhone,
  FiUser,
  FiMessageCircle,
} from "react-icons/fi";
import { IoWifi } from "react-icons/io5";
import {
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import { STICKER_IMAGE_FRAMES } from "../assets/stickerAssets";

/**
 * אפקטי רקע — שם לתצוגה + gradient/CSS ל־UI ול־canvas (מקור אמת יחיד).
 * הפורמט של gradient תואם ל־paintExportBackground (linear-gradient עם deg).
 */
export const BG_EFFECTS = [
  { id: "none", name: "ללא אפקט", gradient: "#ffffff" },
  {
    id: "sunset-silk",
    name: "שקיעה רכה",
    gradient: "linear-gradient(135deg, #ff512f 0%, #dd2476 100%)",
  },
  {
    id: "warm-terracotta",
    name: "טרה-קוטה",
    gradient: "linear-gradient(135deg, #e5976e 0%, #7f4122 100%)",
  },
  {
    id: "classic-peach",
    name: "אפרסק קלאסי",
    gradient: "linear-gradient(135deg, #ff9a8b 0%, #ff6a88 100%)",
  },
  {
    id: "golden-hour",
    name: "שעת זהב",
    gradient: "linear-gradient(135deg, #f2994a 0%, #f2c94c 100%)",
  },
  {
    id: "soft-rose",
    name: "ורוד עדין",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    id: "desert-sand",
    name: "דיונה רכה",
    gradient: "linear-gradient(135deg, #fff9f3 0%, #e8d4c0 45%, #c4a574 100%)",
  },
  {
    id: "ocean-breeze",
    name: "בריזת ים",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    id: "purple-dream",
    name: "חלום סגול",
    gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  },
  {
    id: "mint-fresh",
    name: "מנטה",
    gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
  },
  {
    id: "coral-reef",
    name: "אלמוג",
    gradient: "linear-gradient(135deg, #ff9a56 0%, #ff6a95 100%)",
  },
  {
    id: "lavender-mist",
    name: "לבנדר",
    gradient: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
  },
  {
    id: "instagram-glow",
    name: "סגנון אינסטגרם",
    gradient:
      "linear-gradient(135deg, #feda75 0%, #fa7e1e 25%, #d62976 50%, #962fbf 75%, #4f5bd5 100%)",
  },
];

export function getEffectBackground(effectId) {
  const row = BG_EFFECTS.find((e) => e.id === effectId);
  return row?.gradient ?? "#ffffff";
}

export const PRESET_QR_COLORS = [
  { name: "שחור", hex: "#111111" },
  { name: "גרפיט", hex: "#1f2937" },
  { name: "אפור עשן", hex: "#4b5563" },
  { name: "פייסבוק / טלגרם", hex: "#1877f2" },
  { name: "כחול עמוק", hex: "#1d4ed8" },
  { name: "טורקיז", hex: "#0a9396" },
  { name: "וואטסאפ", hex: "#25d366" },
  { name: "ירוק כהה", hex: "#166534" },
  { name: "זית כהה", hex: "#3f6212" },
  { name: "בורדו", hex: "#7f1d1d" },
  { name: "סגול כהה", hex: "#5b21b6" },
];

export const PRESET_BG_COLORS = [
  { name: "צהוב רך", hex: "#fde68a" },
  { name: "כתום עדין", hex: "#fdba74" },
  { name: "אלמוג בהיר", hex: "#fca5a5" },
  { name: "ורוד", hex: "#f9a8d4" },
  { name: "לבנדר", hex: "#ddd6fe" },
  { name: "תכלת", hex: "#bfdbfe" },
  { name: "כחול בהיר", hex: "#93c5fd" },
  { name: "מנטה", hex: "#a7f3d0" },
  { name: "ירוק בהיר", hex: "#86efac" },
  { name: "ליים", hex: "#d9f99d" },
  { name: "אפור ניטרלי", hex: "#e5e7eb" },
];

export const BODY_SHAPES = [
  { id: "square", name: "Square" },
  { id: "dots", name: "Dots" },
  { id: "rounded", name: "Rounded" },
  { id: "extra-rounded", name: "Extra Rounded" },
  { id: "classy", name: "Classy" },
  { id: "classy-rounded", name: "Classy Rounded" },
];

export const CORNER_SHAPES = [
  { id: "square", name: "Square" },
  { id: "dot", name: "Dot" },
  { id: "rounded", name: "Rounded" },
  { id: "extra-rounded", name: "Extra Rounded" },
  { id: "classy", name: "Classy" },
  { id: "classy-rounded", name: "Classy Rounded" },
  { id: "dots", name: "Dots" },
];

export const STICKER_OPTIONS = [
  { id: "none", name: "ללא" },
  ...STICKER_IMAGE_FRAMES,
];

export const QR_TYPES_MAIN = [
  { value: "url", label: "אתר", icon: FiLink },
  { value: "pdf", label: "קובץ PDF", icon: FiFileText },
  { value: "email", label: "אימייל", icon: FiMail },
  { value: "contact", label: "איש קשר", icon: FiUser },
  { value: "whatsapp", label: "וואטסאפ", icon: FaWhatsapp },
  { value: "phone", label: "טלפון", icon: FiPhone },
  { value: "sms", label: "הודעת SMS", icon: FiMessageCircle },
];

export const QR_TYPES_MORE = [
  { value: "wifi", label: "Wi-Fi", icon: IoWifi },
  { value: "facebook", label: "פייסבוק", icon: FaFacebook },
  { value: "instagram", label: "אינסטגרם", icon: FaInstagram },
  { value: "twitter", label: "X / טוויטר", icon: FaXTwitter },
  { value: "linkedin", label: "לינקדאין", icon: FaLinkedin },
  { value: "youtube", label: "יוטיוב", icon: FaYoutube },
  { value: "tiktok", label: "טיקטוק", icon: FaTiktok },
];

export const QR_TYPES = [...QR_TYPES_MAIN, ...QR_TYPES_MORE];
