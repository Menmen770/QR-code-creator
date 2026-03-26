const QR_TYPE_TITLE_MAP = {
  url: "אתר",
  pdf: "PDF",
  email: "אימייל",
  contact: "איש קשר",
  whatsapp: "וואטסאפ",
  phone: "טלפון",
  sms: "SMS",
  wifi: "WiFi",
  facebook: "פייסבוק",
  instagram: "אינסטגרם",
  twitter: "X / Twitter",
  linkedin: "לינקדאין",
  youtube: "יוטיוב",
  tiktok: "טיקטוק",
};

export function getStepOneTitle(qrType) {
  if (qrType === "url") {
    return "הזן את כתובת האתר שלך";
  }
  const label = QR_TYPE_TITLE_MAP[qrType] || "תוכן";
  return `הזן תוכן עבור ${label}`;
}
