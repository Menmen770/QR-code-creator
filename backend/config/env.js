/**
 * ערכי סביבה בשימוש חוזר (אחרי טעינת dotenv ב־server.js).
 */
module.exports = {
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
  BACKEND_URL: process.env.BACKEND_URL || "http://localhost:5000",
};
