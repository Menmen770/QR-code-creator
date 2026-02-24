import { Link } from "react-router-dom";

function LearnQrPage() {
  return (
    <div className="container py-5" dir="rtl">
      <div className="info-hero mb-4">
        <h1 className="mb-3">מה זה QR Code ולמה זה חשוב?</h1>
        <p className="lead mb-0">
          QR הוא קוד דו-ממדי שמאפשר לסרוק מידע במהירות: לינקים, קבצים, כרטיסי
          ביקור ועוד.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="info-card h-100">
            <h3>שימושים נפוצים</h3>
            <ul>
              <li>תפריטים דיגיטליים למסעדות</li>
              <li>שיתוף מסמכים וקבצי PDF</li>
              <li>הובלה מהירה לעמוד נחיתה</li>
              <li>כרטיס ביקור דיגיטלי</li>
            </ul>
          </div>
        </div>

        <div className="col-md-6">
          <div className="info-card h-100">
            <h3>טיפים לשיפור ביצועים</h3>
            <ul>
              <li>השתמשו בניגודיות גבוהה בין רקע לטקסט</li>
              <li>הימנעו מעומס עיצובי במרכז הקוד</li>
              <li>בדקו סריקה במובייל לפני פרסום</li>
              <li>שמרו על גודל מינימלי ברור להדפסה</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Link to="/" className="btn btn-teal">
          יצירת QR עכשיו
        </Link>
      </div>
    </div>
  );
}

export default LearnQrPage;
