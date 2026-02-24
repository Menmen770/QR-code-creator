import { Link } from "react-router-dom";

function ApiPage() {
  return (
    <div className="container py-5" dir="rtl">
      <div className="info-hero mb-4">
        <h1 className="mb-3">API ליצירת QR</h1>
        <p className="lead mb-0">
          כבר יש לך API? מעולה. כאן תוכל להציג למשתמשים מה הוא נותן ומה מתוכנן
          בהמשך.
        </p>
      </div>

      <div className="info-card mb-4">
        <h3>מה זמין היום</h3>
        <ul className="mb-0">
          <li>יצירת QR באופן מהיר</li>
          <li>תמיכה בסוגי תוכן מרכזיים</li>
          <li>אפשרויות עיצוב בסיסיות</li>
        </ul>
      </div>

      <div className="info-card mb-4">
        <h3>מה אפשר להוסיף בהמשך</h3>
        <ul className="mb-0">
          <li>דוחות סריקה ואנליטיקה</li>
          <li>Dynamic QR עם עדכון יעד בלי להדפיס מחדש</li>
          <li>קצבי בקשות גבוהים ותמיכה מתקדמת</li>
        </ul>
      </div>

      <Link to="/pricing" className="btn btn-outline-secondary me-2">
        לראות תמחור עתידי
      </Link>
      <Link to="/" className="btn btn-teal">
        חזרה למחולל
      </Link>
    </div>
  );
}

export default ApiPage;
