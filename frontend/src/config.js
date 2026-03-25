/**
 * כתובת ה-API – משתנה סביבה או ברירת מחדל
 * VITE_API_URL מוגדר ב-.env (לפרודקשן)
 */
export const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000";
