import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleSignInLink from "../components/GoogleSignInLink";
import RobotSpline from "../components/RobotSpline";
import logo from "../assets/logo-full.png";
import { API_BASE } from "../config";

const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isPhoneValid = (phone) => /^[0-9]{9,11}$/.test(phone.replace(/\D/g, ""));
const isPasswordValid = (password) => {
  if (password.length < 7) return false;
  if (!/^[\p{L}\p{N}]+$/u.test(password)) return false;
  if (!/\p{L}/u.test(password)) return false;
  if (!/\p{N}/u.test(password)) return false;
  return true;
};

function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [touched, setTouched] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const isFormValid = () =>
    form.fullName.trim().length >= 2 &&
    isEmailValid(form.email) &&
    isPhoneValid(form.phone) &&
    isPasswordValid(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Debug: Check for admin code
    if (form.fullName === "123!") {
      navigate("/");
      return;
    }

    if (!isFormValid()) {
      setError("נא למלא את כל השדות בצורה תקינה");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "ההרשמה נכשלה");
      }

      navigate("/");
    } catch (err) {
      setError(err.message || "ההרשמה נכשלה");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-login">
      <main className="auth-main">
        <div className="container">
          <div className="row align-items-center justify-content-center auth-shell">
            <div className="col-lg-5">
              <div className="auth-card card shadow-sm">
                <div className="card-body p-4">
                  <div className="auth-header text-center">
                    <h2 className="fw-bold">יצירת חשבון</h2>
                    <p className="text-muted">השלם הרשמה תוך כמה שניות</p>
                  </div>

                  {error && <div className="alert alert-danger">{error}</div>}

                  <form onSubmit={handleSubmit} className="vstack gap-3">
                    <div>
                      <label className="form-label">שם מלא</label>
                      <input
                        type="text"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        onBlur={() => handleBlur("fullName")}
                        className={`form-control ${
                          touched.fullName && form.fullName.trim().length < 2
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="השם המלא שלך"
                      />
                      {touched.fullName && form.fullName.trim().length < 2 && (
                        <div className="invalid-feedback">
                          יש להזין לפחות 2 תווים
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="form-label">אימייל</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        onBlur={() => handleBlur("email")}
                        className={`form-control ${
                          touched.email && !isEmailValid(form.email)
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="you@example.com"
                      />
                      {touched.email && !isEmailValid(form.email) && (
                        <div className="invalid-feedback">
                          נא להזין אימייל תקין
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="form-label">טלפון</label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        onBlur={() => handleBlur("phone")}
                        dir="rtl"
                        className={`form-control auth-phone-input-rtl ${
                          touched.phone && !isPhoneValid(form.phone)
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="ספרות בלבד"
                      />
                      {touched.phone && !isPhoneValid(form.phone) && (
                        <div className="invalid-feedback">
                          נא להזין 9-11 ספרות בלבד
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="form-label">סיסמה</label>
                      <div className="input-group">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={form.password}
                          onChange={handleChange}
                          onBlur={() => handleBlur("password")}
                          className={`form-control ${
                            touched.password && !isPasswordValid(form.password)
                              ? "is-invalid"
                              : ""
                          }`}
                          placeholder="לפחות 7 תווים"
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          {showPassword ? "הסתר" : "הצג"}
                        </button>
                        {touched.password &&
                          !isPasswordValid(form.password) && (
                            <div className="invalid-feedback d-block">
                              הסיסמה חייבת לכלול לפחות 7 תווים, אותיות
                              (עברית/אנגלית) ומספרים בלבד.
                            </div>
                          )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-teal w-100"
                      disabled={loading}
                    >
                      {loading ? "יוצר חשבון..." : "הרשמה"}
                    </button>
                  </form>

                  <div className="auth-divider">
                    <span>או</span>
                  </div>

                  <GoogleSignInLink href={`${API_BASE}/api/auth/google`}>
                    הרשם עם גוגל
                  </GoogleSignInLink>

                  <div className="auth-footer">
                    <span>כבר יש לך חשבון?</span>
                    <Link to="/login" className="auth-switch-link">
                      להתחברות
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-5 d-none d-lg-flex justify-content-center">
              <div
                className="robot-widget robot-widget-auth"
                aria-hidden="true"
              >
                <RobotSpline />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RegisterPage;
