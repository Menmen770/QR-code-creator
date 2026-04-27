import React, { useState } from "react";

/**
 * תמונות לכרטיסים: העתיקו קבצים לתיקייה (בשורש הפרויקט של Vite):
 *   frontend/public/promo-materials/
 *
 * שמות ברירת המחדל (עדכנו את imageFile אם אתם משתמשים בשם אחר / סיומת אחרת):
 *   qr-menu.jpg         — תפריט (תמונת תפריט QR)
 *   flyers.jpg          — פלאיירים
 *   business-cards.jpg  — כרטיסי ביקור
 *   wifi-public-qr.jpg  — וויפי (תמונת QR לווי-פיי ציבורי)
 *
 * פורמטים נתמכים: jpg, jpeg, png, webp (שנו את imageFile בהתאם).
 */
function promoMaterialUrl(fileName) {
  const base = import.meta.env.BASE_URL || "/";
  const root = base.endsWith("/") ? base : `${base}/`;
  const safe = fileName
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${root}promo-materials/${safe}`;
}

const PROMO_CARDS = [
  {
    title: "תפריט",
    description: "קישור לתפריט או לתפריט דיגיטלי — סריקה אחת.",
    imageFile: "qr-menu.jpg",
  },
  {
    title: "פלאיירים",
    description: "להעביר מסר מהר, בלי להעמיס טקסט.",
    imageFile: "flyers.jpg",
  },
  {
    title: "כרטיסי ביקור",
    description: "קישור ופרטים — בלי להקליד.",
    imageFile: "business-cards.jpg",
  },
  {
    title: "וויפי",
    description: "התחברות לרשת אורחים או WiFi ציבורי — בלי להקליד.",
    imageFile: "wifi-public-qr.jpg",
  },
];

function PromoCardMedia({ src, title }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="promo-materials-card-placeholder" aria-hidden />
    );
  }

  return (
    <img
      src={src}
      alt={title}
      className="promo-materials-card-img"
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

function PromotionalMaterialsSection() {
  return (
    <section className="promo-materials-section" dir="rtl" lang="he">
      <div className="container">
        <header className="promo-materials-header mx-auto text-center">
          <h2 className="promo-materials-heading">
            קוד QR על חומרי פרסום
          </h2>
          <p className="promo-materials-subheading">
            הפצה והמרה מהירה יותר — בחרו את סוג החומר והדביקו את הקוד.
          </p>
        </header>

        <div className="row g-4 justify-content-center">
          {PROMO_CARDS.map((card) => (
            <div className="col-12 col-sm-6 col-lg-3" key={card.title}>
              <article className="promo-materials-card h-100">
                <div className="promo-materials-card-media">
                  <PromoCardMedia
                    src={promoMaterialUrl(card.imageFile)}
                    title={card.title}
                  />
                </div>
                <div className="promo-materials-card-body">
                  <h3 className="promo-materials-card-title">{card.title}</h3>
                  <p className="promo-materials-card-desc">
                    {card.description}
                  </p>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PromotionalMaterialsSection;
