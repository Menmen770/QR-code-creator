import React from "react";
import whyUsSpeedIllustration from "../assets/why-us-speed.svg";
import whyUsPrivacyIllustration from "../assets/why-us-privacy.svg";

/** טור 1 — שפה פשוטה */
const speedParagraphs = [
  "כשמישהו סורק את הקוד, הטלפון פותח ישר את האתר, את המספר או את מה שבחרתם — בלי דף באמצע ובלי שירות נוסף שמאט או מסבך את הדרך.",
  "זה אומר טעינה מהירה יותר, במיוחד כשהרשת לא יציבה או כשמסתכלים על שלט או על אריזה. כל שנייה חשובה כשמחכים שיפתחו קישור.",
  "כל עוד מה שמאחורי הקוד (אתר, קובץ, טלפון) עובד — הקוד שלכם ימשיך לעבוד. בלי תלות במנוי כדי \"להפעיל\" אותו מחדש.",
];

/** טור 2 — שפה פשוטה */
const ownershipParagraphs = [
  "הקוד שאתם מורידים הוא תמונה שמכילה את הכתובת. הוא שלכם: אפשר להדפיס, לשלוח ולהציג איפה שרוצים. אין אצלנו כפתור שמכבה את הקוד מרחוק — כי אנחנו לא שומרים אותו בשבילכם בשרת.",
  "אנחנו לא רואים מי סרק, לא אוספים רשימת סריקות ולא מוכרים מידע על המשתמשים שלכם. מה שקורה אחרי הסריקה — בדרך כלל באתר שלכם, עם הכלים שאתם בוחרים לשם.",
  "כך נשמרת פרטיות פשוטה: הקישור נשאר ביניכם לבין הלקוחות, בלי שכבת מעקב נוספת רק בגלל הקוד.",
];

function WhyUsSection() {
  return (
    <section className="why-us-section" dir="rtl" lang="he">
      <div className="container">
        <header className="why-us-header text-center mx-auto">
          <h2 className="why-us-heading">
            למה ליצור כאן קוד QR — ומה זה נותן לכם בפועל?
          </h2>
          <p className="why-us-subheading">
            שני דברים שחשוב לדעת: מהירות וסריקה ישרה אליכם, והקוד כנכס שלכם — בלי מעקב מיותר.
          </p>
        </header>

        <div className="row g-4 g-lg-5 justify-content-center">
          {/* ב־RTL: טור ראשון = צד ימין — מהירות (התמונה החדשה 123) */}
          <div className="col-md-6">
            <article className="why-us-card h-100">
              <div className="why-us-card-media why-us-card-media--filled">
                <img
                  src={whyUsSpeedIllustration}
                  alt="איור: סריקה מהירה וישירה"
                  className="why-us-card-img"
                />
              </div>

              <h3 className="why-us-card-title">סריקה מהירה וישירה אליכם</h3>

              <div className="why-us-prose">
                {speedParagraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </article>
          </div>

          <div className="col-md-6">
            <article className="why-us-card h-100">
              <div className="why-us-card-media why-us-card-media--filled">
                <img
                  src={whyUsPrivacyIllustration}
                  alt="איור: הקוד שייך לכם והפרטיות נשמרת"
                  className="why-us-card-img"
                />
              </div>

              <h3 className="why-us-card-title">
                הקוד שייך לכם — והפרטיות נשמרת
              </h3>

              <div className="why-us-prose">
                {ownershipParagraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyUsSection;
