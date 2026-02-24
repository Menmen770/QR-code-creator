function PrivacyTermsPage() {
  return (
    <div className="container py-5 legal-page" dir="rtl">
      <main className="learn-article mx-auto">
        <p className="contact-badge mb-2">מסמך מדיניות</p>
        <h1 className="learn-title mb-3">מדיניות פרטיות ותנאי שימוש</h1>
        <p className="learn-lead mb-4">
          במסמך זה תמצא סקירה כללית של אופן השימוש בשירות, שמירת מידע ותחומי
          אחריות.
        </p>

        <p className="legal-updated mb-4">עדכון אחרון: 25.02.2026</p>

        <section className="learn-section">
          <h2>איסוף מידע</h2>
          <p>
            אנו אוספים רק מידע תפעולי הנדרש להפעלת המערכת, אבטחה ושיפור חוויית
            המשתמש. המידע נשמר בהתאם לדרישות אבטחה מקובלות.
          </p>
        </section>

        <section className="learn-section">
          <h2>שימוש במידע</h2>
          <ul className="policy-list">
            <li>ניהול חשבון והתחברות מאובטחת</li>
            <li>שמירת היסטוריית שימוש ותצוגת QR אחרונים</li>
            <li>שיפור ביצועים ויציבות המערכת</li>
          </ul>
        </section>

        <section className="learn-section">
          <h2>אבטחת מידע</h2>
          <p>
            אנו מפעילים מנגנוני הגנה ברמת שרת, סשן ותקשורת כדי לצמצם גישה בלתי
            מורשית. יחד עם זאת, חשוב לשמור גם על אבטחת המכשיר והחשבון האישי שלך.
          </p>
        </section>

        <section className="learn-section">
          <h2>תנאי שימוש</h2>
          <ul className="policy-list">
            <li>השירות מיועד לשימוש חוקי בלבד</li>
            <li>אין לבצע שימוש הפוגע בצדדים שלישיים או במערכת</li>
            <li>המערכת רשאית לעדכן פיצ׳רים ותנאים מעת לעת</li>
          </ul>
        </section>

        <section className="learn-section mb-0">
          <h2>עדכונים</h2>
          <p>מומלץ לעיין בדף זה מעת לעת כדי להישאר מעודכן.</p>
        </section>
      </main>
    </div>
  );
}

export default PrivacyTermsPage;
