import {
  FiLink,
  FiFileText,
  FiMail,
  FiPhone,
  FiWifi,
  FiUser,
  FiMessageCircle,
} from "react-icons/fi";
import {
  BsChat,
  BsFacebook,
  BsInstagram,
  BsTwitterX,
  BsLinkedin,
  BsYoutube,
  BsTiktok,
} from "react-icons/bs";

export const BG_EFFECTS = [
  { id: "none", name: "Solid" },
  { id: "sunset-silk", name: "Sunset Silk" },
  { id: "warm-terracotta", name: "Warm Terracotta" },
  { id: "classic-peach", name: "Classic Peach" },
  { id: "golden-hour", name: "Golden Hour" },
  { id: "soft-rose", name: "Soft Rose" },
  { id: "desert-sand", name: "Desert Sand" },
  { id: "ocean-breeze", name: "Ocean Breeze" },
  { id: "purple-dream", name: "Purple Dream" },
  { id: "mint-fresh", name: "Mint Fresh" },
  { id: "coral-reef", name: "Coral Reef" },
  { id: "lavender-mist", name: "Lavender Mist" },
];

export const PRESET_COLORS = [
  { name: "Black", hex: "#000000" },
  { name: "Navy", hex: "#001f3f" },
  { name: "Teal", hex: "#0a9396" },
  { name: "Green", hex: "#00a651" },
  { name: "Purple", hex: "#7c3aed" },
  { name: "Red", hex: "#dc2626" },
  { name: "Gray", hex: "#6b7280" },
  { name: "Orange", hex: "#f97316" },
  { name: "Blue", hex: "#3b82f6" },
  { name: "Cyan", hex: "#06b6d4" },
  { name: "Pink", hex: "#ec4899" },
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

export const QR_TYPES_MAIN = [
  { value: "url", label: "Website", icon: FiLink },
  { value: "pdf", label: "PDF", icon: FiFileText },
  { value: "email", label: "Email", icon: FiMail },
  { value: "contact", label: "VCard", icon: FiUser },
  { value: "whatsapp", label: "WhatsApp", icon: BsChat },
  { value: "phone", label: "Phone", icon: FiPhone },
  { value: "sms", label: "SMS", icon: FiMessageCircle },
];

export const QR_TYPES_MORE = [
  { value: "wifi", label: "WiFi", icon: FiWifi },
  { value: "facebook", label: "Facebook", icon: BsFacebook },
  { value: "instagram", label: "Instagram", icon: BsInstagram },
  { value: "twitter", label: "Twitter/X", icon: BsTwitterX },
  { value: "linkedin", label: "LinkedIn", icon: BsLinkedin },
  { value: "youtube", label: "YouTube", icon: BsYoutube },
  { value: "tiktok", label: "TikTok", icon: BsTiktok },
];

export const QR_TYPES = [...QR_TYPES_MAIN, ...QR_TYPES_MORE];
