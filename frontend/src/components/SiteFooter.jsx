import { Link } from "react-router-dom";

function SiteFooter() {
  return (
    <footer className="site-footer mt-5" dir="rtl">
      <div className="container py-4">
        <div className="row g-4">
          <div className="col-md-4">
            <h6 className="footer-title">QR Master</h6>
            <p className="footer-text mb-0">
              פלטפורמה פשוטה ליצירת QR קודים, התאמה אישית והורדה מיידית.
            </p>
          </div>

          <div className="col-6 col-md-4">
            <h6 className="footer-title">ניווט מהיר</h6>
            <ul className="footer-links list-unstyled mb-0">
              <li>
                <Link to="/">מחולל QR</Link>
              </li>
              <li>
                <Link to="/learn-qr">לימוד QR</Link>
              </li>
              <li>
                <Link to="/api">API</Link>
              </li>
              <li>
                <Link to="/pricing">Pricing</Link>
              </li>
            </ul>
          </div>

          <div className="col-6 col-md-4">
            <h6 className="footer-title">חשבון ומדיניות</h6>
            <ul className="footer-links list-unstyled mb-0">
              <li>
                <Link to="/login">התחברות</Link>
              </li>
              <li>
                <Link to="/register">הרשמה</Link>
              </li>
              <li>
                <a href="mailto:support@qrmaster.local">צור קשר</a>
              </li>
              <li>
                <span className="footer-muted">פרטיות ותנאים - בקרוב</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom mt-4 pt-3">
          © 2026 QR Master. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
