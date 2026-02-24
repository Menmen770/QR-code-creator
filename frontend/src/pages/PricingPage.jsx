import { Link } from "react-router-dom";

function PricingPage() {
  return (
    <div className="container py-5" dir="rtl">
      <div className="info-hero mb-4">
        <h1 className="mb-3">Pricing</h1>
        <p className="lead mb-0">
          כרגע המוצר בחינם. העמוד הזה נותן לך אופציה מוכנה לתמחור כשתרצה.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="price-card h-100">
            <h4>Free</h4>
            <p className="price-value">₪0</p>
            <ul>
              <li>יצירה והורדה של QR</li>
              <li>התאמות עיצוב בסיסיות</li>
              <li>לשימוש אישי</li>
            </ul>
          </div>
        </div>

        <div className="col-md-4">
          <div className="price-card h-100">
            <h4>Pro (בקרוב)</h4>
            <p className="price-value">TBD</p>
            <ul>
              <li>Dynamic QR</li>
              <li>Analytics</li>
              <li>מיתוג מתקדם</li>
            </ul>
          </div>
        </div>

        <div className="col-md-4">
          <div className="price-card h-100">
            <h4>Business (בקרוב)</h4>
            <p className="price-value">TBD</p>
            <ul>
              <li>API מתקדם</li>
              <li>ניהול צוות</li>
              <li>תמיכה מועדפת</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Link to="/" className="btn btn-teal">
          התחלה חינם
        </Link>
      </div>
    </div>
  );
}

export default PricingPage;
