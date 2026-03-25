import React from "react";

/**
 * ארבעה כרטיסים בסגנון חומרי פרסום — תמונות יוזרקו כשיהיו קבצים.
 * כל פריט: imageSrc (אופציונלי), title, description
 */
const PROMO_CARDS = [
  {
    title: "עלונים",
    description: "מידע מרוכז וברור — בקוד אחד.",
  },
  {
    title: "פלאיירים",
    description: "להעביר מסר מהר, בלי להעמיס טקסט.",
  },
  {
    title: "כרטיסי ביקור",
    description: "קישור ופרטים — בלי להקליד.",
  },
  {
    title: "שיווק",
    description: "לקדם את המותג בכל מגע עם הלקוח.",
  },
];

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
          {PROMO_CARDS.map((card, i) => (
            <div className="col-12 col-sm-6 col-lg-3" key={i}>
              <article className="promo-materials-card h-100">
                <div className="promo-materials-card-media">
                  {card.imageSrc ? (
                    <img
                      src={card.imageSrc}
                      alt=""
                      className="promo-materials-card-img"
                    />
                  ) : (
                    <div
                      className="promo-materials-card-placeholder"
                      aria-hidden
                    />
                  )}
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
