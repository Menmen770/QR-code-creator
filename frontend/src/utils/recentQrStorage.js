/** מפתח אחיד להיסטוריית QR אחרונה (localStorage). */
export const QR_CREATOR_RECENT_KEY = "qrCreatorRecentQrHistory";

const LEGACY_RECENT_QR_KEY = "qrMasterRecentHistory";

export function loadRecentQrItems() {
  try {
    const raw =
      localStorage.getItem(QR_CREATOR_RECENT_KEY) ??
      localStorage.getItem(LEGACY_RECENT_QR_KEY);
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}

export function saveRecentQrItems(items) {
  localStorage.setItem(QR_CREATOR_RECENT_KEY, JSON.stringify(items));
}
