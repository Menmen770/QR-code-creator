/**
 * לוגואים מוכנים — קבצי SVG ב־assets/preset-logos, מומרים ל־data URL לשליחה ל־API.
 */

import whatsappSvg from "../assets/preset-logos/whatsapp.svg?raw";
import instagramSvg from "../assets/preset-logos/instagram.svg?raw";
import facebookSvg from "../assets/preset-logos/facebook.svg?raw";
import linkedinSvg from "../assets/preset-logos/linkedin.svg?raw";
import telegramSvg from "../assets/preset-logos/telegram.svg?raw";
import spotifySvg from "../assets/preset-logos/spotify.svg?raw";
import googleSvg from "../assets/preset-logos/google.svg?raw";
import githubSvg from "../assets/preset-logos/github.svg?raw";

function svgDataUrl(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/** רינדור PNG קצת יותר קטן במרכז כדי שהלוגו ייכנס בפרופורציה בתוך חיתוך ה-QR */
const PRESET_DEFS = [
  { id: "whatsapp", name: "WhatsApp", svg: whatsappSvg },
  { id: "instagram", name: "Instagram", svg: instagramSvg },
  { id: "facebook", name: "Facebook", svg: facebookSvg },
  { id: "linkedin", name: "LinkedIn", svg: linkedinSvg },
  { id: "telegram", name: "Telegram", svg: telegramSvg },
  { id: "spotify", name: "Spotify", svg: spotifySvg },
  { id: "google", name: "Google", svg: googleSvg, rasterInset: 0.88 },
  { id: "github", name: "GitHub", svg: githubSvg },
];

export const PRESET_BRAND_LOGOS = PRESET_DEFS.map((p) => ({
  id: p.id,
  name: p.name,
  svg: p.svg,
  dataUrl: svgDataUrl(p.svg),
  rasterInset: p.rasterInset ?? 1,
}));

export function getPresetLogoDataUrl(id) {
  const row = PRESET_BRAND_LOGOS.find((p) => p.id === id);
  return row?.dataUrl ?? "";
}

export function isPresetLogoDataUrl(url) {
  if (!url || typeof url !== "string") return false;
  return PRESET_BRAND_LOGOS.some((p) => p.dataUrl === url);
}

export function getPresetRasterInsetForDataUrl(url) {
  const row = PRESET_BRAND_LOGOS.find((p) => p.dataUrl === url);
  return row?.rasterInset ?? 1;
}
