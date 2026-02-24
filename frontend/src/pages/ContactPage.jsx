import { useState } from "react";

function ContactPage() {
  const [form, setForm] = useState({ fullName: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.fullName.trim() || !form.phone.trim() || !form.message.trim()) {
      return;
    }
    setSubmitted(true);
    setForm({ fullName: "", phone: "", message: "" });
  };

  return (
    <div className="container py-5 contact-page" dir="rtl">
      <main className="learn-article mx-auto">
        <p className="contact-badge mb-2">צוות תמיכה</p>
        <h1 className="learn-title mb-3">צור קשר</h1>
        <p className="learn-lead mb-4">
          אנחנו כאן כדי לעזור. אפשר להשאיר פרטים ונחזור אליך בהקדם בשעות
          הפעילות.
        </p>

        <div className="contact-meta mb-4">
          <span>מענה מהיר בשעות פעילות</span>
          <span>טיפול מקצועי ומסודר</span>
          <span>שירות אישי לכל פנייה</span>
        </div>

        <section className="learn-section">
          <h2>טופס פנייה</h2>
          <form className="vstack gap-3 contact-form" onSubmit={handleSubmit}>
            <div>
              <label className="form-label">שם מלא</label>
              <input
                className="form-control"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="השם שלך"
              />
            </div>

            <div>
              <label className="form-label">טלפון</label>
              <input
                className="form-control"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="מספר טלפון לחזרה"
              />
            </div>

            <div>
              <label className="form-label">תוכן הפנייה</label>
              <textarea
                className="form-control"
                rows="4"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="כתוב כאן במה נוכל לעזור"
              />
            </div>

            <div>
              <button className="btn btn-teal" type="submit">
                שלח פנייה
              </button>
            </div>
          </form>

          {submitted && (
            <div className="alert alert-success mt-3 mb-0" role="status">
              הפנייה נשלחה בהצלחה. נחזור אליך בהקדם.
            </div>
          )}
        </section>

        <p className="contact-note mt-4 mb-0">
          ניתן לפנות בכל נושא: תמיכה טכנית, שאלות על שימוש במערכת, והכוונה
          ליצירת קודי QR בצורה מיטבית.
        </p>
      </main>
    </div>
  );
}

export default ContactPage;
