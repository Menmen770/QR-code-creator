import { Link } from "react-router-dom";
import QrTutorialTimeline from "../components/QrTutorialTimeline";

function LearnQrPage() {
  return (
    <div className="container py-5" dir="rtl">
      <main className="learn-article mx-auto">
        <h1 className="learn-title mb-3">מה זה QR?</h1>
        <p className="learn-lead mb-4">
          QR (קיצור של Quick Response) הוא ברקוד דו-ממדי שמאפשר לשמור ולסרוק
          מידע במהירות גבוהה. במקום להקליד כתובת ידנית, המשתמש סורק את הקוד
          במצלמה ומקבל גישה מיידית לתוכן.
        </p>

        <QrTutorialTimeline />

        <section className="learn-section">
          <h2>רקע קצר</h2>
          <p>
            הטכנולוגיה פותחה ביפן בשנת 1994 על ידי Denso Wave, בתחילה לצורכי
            מעקב תעשייתי. עם השנים, ובעיקר בזכות הסמארטפונים, קודי QR הפכו לכלי
            מרכזי בעולם העסקי, השיווקי והשירותי.
          </p>
        </section>

        <section className="learn-section">
          <h2>איך זה עובד?</h2>
          <p>
            הקוד מורכב ממטריצה של ריבועים שחורים ולבנים. הקורא מזהה את תבניות
            הניווט (הריבועים בפינות), מפענח את המידע ומתרגם אותו לטקסט, קישור,
            איש קשר, נתוני Wi-Fi ועוד.
          </p>
          <p>
            לקוד QR יש גם מנגנון תיקון שגיאות, כך שגם אם חלק קטן ממנו נפגע
            בהדפסה או בלכלוך — ברוב המקרים עדיין אפשר לסרוק אותו בהצלחה.
          </p>
        </section>

        <section className="learn-section">
          <h2>שימושים נפוצים</h2>
          <ul>
            <li>הפניה לאתר, לעמוד נחיתה או לטופס יצירת קשר</li>
            <li>שיתוף קובצי PDF, מצגות וקטלוגים דיגיטליים</li>
            <li>שמירת איש קשר (vCard) בלחיצה אחת</li>
            <li>פתיחת שיחת WhatsApp עם הודעה מוכנה מראש</li>
            <li>חיבור מהיר לרשת Wi-Fi ללא הקלדת סיסמה</li>
            <li>שילוט חכם באירועים, מסעדות, חנויות ונקודות שירות</li>
          </ul>
        </section>

        <section className="learn-section">
          <h2>סטטי מול דינמי</h2>
          <p>
            קוד סטטי שומר את התוכן בתוך הקוד עצמו, ולכן אי אפשר לשנות אותו אחרי
            יצירה. קוד דינמי מפנה לכתובת ביניים, ובדרך כלל מאפשר לעדכן את היעד,
            לעקוב אחרי שימושים ולקבל סטטיסטיקות.
          </p>
        </section>

        <section className="learn-section">
          <h2>עקרונות לעיצוב מקצועי</h2>
          <ul>
            <li>שמרו על ניגודיות גבוהה בין הקוד לרקע</li>
            <li>הימנעו מהקטנת הקוד מתחת לגודל קריא</li>
            <li>אל תעמיסו אלמנטים גרפיים שמסתירים אזורי זיהוי</li>
            <li>בדקו סריקה בכמה מכשירים ותנאי תאורה</li>
            <li>
              הוסיפו קריאה לפעולה ברורה ליד הקוד (למשל: "סרקו לקבלת פרטים")
            </li>
          </ul>
        </section>

        <section className="learn-section mb-0">
          <h2>לסיכום</h2>
          <p>
            QR הוא כלי פשוט ליישום אך חזק מאוד בתוצאה: הוא מקצר תהליכים, משפר
            חוויית משתמש ומייצר מעבר מהיר בין עולם פיזי לדיגיטלי.
          </p>
          <div className="mt-4">
            <Link to="/create" className="btn btn-teal">
              יצירת QR עכשיו
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LearnQrPage;
