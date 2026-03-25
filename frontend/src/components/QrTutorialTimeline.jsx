import step1Img from "../assets/tutorial/step1.png";
import step2Img from "../assets/tutorial/step2.png";
import step3Img from "../assets/tutorial/step3.png";

export default function QrTutorialTimeline() {
  const steps = [
    {
      num: 1,
      title: "בחרו את סוג קוד ה-QR",
      desc: "בחרו מתוך מגוון סוגים: אתר, PDF, אימייל, איש קשר, וואטסאפ ועוד.",
      img: step1Img,
    },
    {
      num: 2,
      title: "הזינו את הפרטים",
      desc: "הקלידו את המידע שתרצו להטמיע בקוד – כתובת, טקסט, מספר טלפון וכדומה.",
      img: step2Img,
    },
    {
      num: 3,
      title: "עיצוב והורדה",
      desc: "התאימו צבעים, צורות ולוגו, ואז הורידו את קוד ה-QR בפורמט PNG או SVG.",
      img: step3Img,
    },
  ];

  return (
    <section className="qr-tutorial-timeline">
      <div className="qr-tutorial-timeline-inner">
        <h2 className="qr-tutorial-timeline-title">איך יוצרים קוד QR?</h2>
        <p className="qr-tutorial-timeline-subtitle">
          שלושה שלבים פשוטים ליצירת קוד QR מקצועי
        </p>

        <div className="qr-timeline">
          <div className="qr-timeline-line" />
          {steps.map((step, i) => (
            <div
              key={step.num}
              className={`qr-timeline-step ${i % 2 === 1 ? "qr-timeline-step-alt" : ""}`}
            >
              <div className="qr-timeline-num">
                <div className="qr-timeline-circle">
                  <span>{step.num}</span>
                </div>
              </div>
              <div className="qr-timeline-step-content">
                <div className="qr-timeline-side qr-timeline-text-wrap">
                  <div className="qr-timeline-text">
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </div>
                </div>
                <div
                  className={`qr-timeline-side qr-timeline-img-wrap ${
                    step.num <= 2 ? "qr-timeline-img-lift" : ""
                  }`}
                >
                  <img src={step.img} alt={`שלב ${step.num}: ${step.title}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
