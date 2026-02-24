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
  { value: "url", label: "Website", icon: IconLink },
  { value: "pdf", label: "PDF", icon: IconFileText },
  { value: "email", label: "Email", icon: IconMail },
  { value: "contact", label: "VCard", icon: IconUser },
  { value: "whatsapp", label: "WhatsApp", icon: IconBrandWhatsapp },
  { value: "phone", label: "Phone", icon: IconPhone },
  { value: "sms", label: "SMS", icon: IconMessageCircle },
];

export const QR_TYPES_MORE = [
  { value: "wifi", label: "WiFi", icon: IconWifi },
  { value: "facebook", label: "Facebook", icon: IconBrandFacebook },
  { value: "instagram", label: "Instagram", icon: IconBrandInstagram },
  { value: "twitter", label: "Twitter/X", icon: IconBrandX },
  { value: "linkedin", label: "LinkedIn", icon: IconBrandLinkedin },
  { value: "youtube", label: "YouTube", icon: IconBrandYoutube },
  { value: "tiktok", label: "TikTok", icon: IconBrandTiktok },
];

export const QR_TYPES = [...QR_TYPES_MAIN, ...QR_TYPES_MORE];
