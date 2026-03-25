import {
  IconLink,
  IconFileText,
  IconMail,
  IconPhone,
  IconWifi,
  IconUser,
  IconMessageCircle,
  IconBrandWhatsapp,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandX,
  IconBrandLinkedin,
  IconBrandYoutube,
  IconBrandTiktok,
} from "@tabler/icons-react";

import { STICKER_IMAGE_FRAMES } from "../assets/stickerAssets";

export const BG_EFFECTS = [
  { id: "none", name: "ללא אפקט" },
  { id: "sunset-silk", name: "שקיעה רכה" },
  { id: "warm-terracotta", name: "טרה-קוטה" },
  { id: "classic-peach", name: "אפרסק קלאסי" },
  { id: "golden-hour", name: "שעת זהב" },
  { id: "soft-rose", name: "ורוד עדין" },
  { id: "desert-sand", name: "חול מדברי" },
  { id: "ocean-breeze", name: "בריזת ים" },
  { id: "purple-dream", name: "חלום סגול" },
  { id: "mint-fresh", name: "מנטה" },
  { id: "coral-reef", name: "אלמוג" },
  { id: "lavender-mist", name: "לבנדר" },
];

export const PRESET_QR_COLORS = [
  { name: "שחור", hex: "#111111" },
  { name: "גרפיט", hex: "#1f2937" },
  { name: "אפור כהה", hex: "#374151" },
  { name: "נייבי", hex: "#1e3a8a" },
  { name: "כחול עמוק", hex: "#1d4ed8" },
  { name: "טורקיז", hex: "#0a9396" },
  { name: "ירוק כהה", hex: "#166534" },
  { name: "זית כהה", hex: "#3f6212" },
  { name: "חום", hex: "#78350f" },
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
  { value: "url", label: "אתר", icon: IconLink },
  { value: "pdf", label: "קובץ PDF", icon: IconFileText },
  { value: "email", label: "אימייל", icon: IconMail },
  { value: "contact", label: "איש קשר", icon: IconUser },
  { value: "whatsapp", label: "וואטסאפ", icon: IconBrandWhatsapp },
  { value: "phone", label: "טלפון", icon: IconPhone },
  { value: "sms", label: "הודעת SMS", icon: IconMessageCircle },
];

export const QR_TYPES_MORE = [
  { value: "wifi", label: "Wi-Fi", icon: IconWifi },
  { value: "facebook", label: "פייסבוק", icon: IconBrandFacebook },
  { value: "instagram", label: "אינסטגרם", icon: IconBrandInstagram },
  { value: "twitter", label: "X / טוויטר", icon: IconBrandX },
  { value: "linkedin", label: "לינקדאין", icon: IconBrandLinkedin },
  { value: "youtube", label: "יוטיוב", icon: IconBrandYoutube },
  { value: "tiktok", label: "טיקטוק", icon: IconBrandTiktok },
];

export const QR_TYPES = [...QR_TYPES_MAIN, ...QR_TYPES_MORE];
