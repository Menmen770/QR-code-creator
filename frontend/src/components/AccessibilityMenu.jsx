// src/components/AccessibilityMenu.jsx
import React, { useState, useEffect } from "react";
import "./AccessibilityMenu.css";

function AccessibilityMenu({ onClose }) {
  const [fontSize, setFontSize] = useState("normal");
  const [readableFont, setReadableFont] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  const handleFontSize = (size) => {
    setFontSize(size);
    document.documentElement.setAttribute("data-font-size", size);
  };

  const handleReadableFont = () => {
    const newReadableFont = !readableFont;
    setReadableFont(newReadableFont);
    if (newReadableFont) {
      document.documentElement.setAttribute("data-dyslexia", "true");
    } else {
      document.documentElement.removeAttribute("data-dyslexia");
    }
  };

  const handleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
    if (newDarkMode) {
      document.documentElement.setAttribute("data-dark-mode", "true");
    } else {
      document.documentElement.removeAttribute("data-dark-mode");
    }
  };

  // Initialize dark mode on mount
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute("data-dark-mode", "true");
    }
  }, []);

  const handleReset = () => {
    setFontSize("normal");
    setReadableFont(false);
    setDarkMode(false);
    document.documentElement.removeAttribute("data-font-size");
    document.documentElement.removeAttribute("data-dyslexia");
    document.documentElement.removeAttribute("data-dark-mode");
    localStorage.setItem("darkMode", JSON.stringify(false));
  };

  return (
    <div className="accessibility-menu" role="menu" dir="rtl">
      <div className="accessibility-menu-header">
        <h3>אפשרויות נגישות</h3>
        <button
          className="menu-close-btn"
          onClick={onClose}
          aria-label="סגור תפריט"
        >
          ✕
        </button>
      </div>

      <div className="accessibility-menu-content">
        <div className="menu-section">
          <label className="menu-label">גודל הטקסט</label>
          <div className="font-size-selector">
            <button
              className={`font-btn ${fontSize === "large" ? "active" : ""}`}
              onClick={() => handleFontSize("large")}
              data-size="large"
              aria-pressed={fontSize === "large"}
            >
              A
            </button>
            <button
              className={`font-btn ${fontSize === "normal" ? "active" : ""}`}
              onClick={() => handleFontSize("normal")}
              data-size="medium"
              aria-pressed={fontSize === "normal"}
            >
              A
            </button>
            <button
              className={`font-btn ${fontSize === "small" ? "active" : ""}`}
              onClick={() => handleFontSize("small")}
              data-size="small"
              aria-pressed={fontSize === "small"}
            >
              A
            </button>
          </div>
        </div>

        <div className="menu-section">
          <label className="menu-label">גופן קריא</label>
          <div className="single-action-wrap">
            <button
              className={`font-btn readable-font-btn ${readableFont ? "active" : ""}`}
              onClick={handleReadableFont}
              aria-pressed={readableFont}
              aria-label="גופן קריא יותר"
            >
              Aa
            </button>
          </div>
        </div>

        <div className="menu-section">
          <label className="menu-label">מצב תצוגה</label>
          <div className="theme-toggle-wrap">
            <label className="switch">
              <input
                id="checkbox"
                type="checkbox"
                checked={!darkMode}
                onChange={handleDarkMode}
                aria-label="החלף למצב אפל"
              />
              <span className="slider">
                <div className="star star_1"></div>
                <div className="star star_2"></div>
                <div className="star star_3"></div>
                <svg viewBox="0 0 16 16" className="cloud_1 cloud">
                  <path
                    transform="matrix(.77976 0 0 .78395-299.99-418.63)"
                    fill="#fff"
                    d="m391.84 540.91c-.421-.329-.949-.524-1.523-.524-1.351 0-2.451 1.084-2.485 2.435-1.395.526-2.388 1.88-2.388 3.466 0 1.874 1.385 3.423 3.182 3.667v.034h12.73v-.006c1.775-.104 3.182-1.584 3.182-3.395 0-1.747-1.309-3.186-2.994-3.379.007-.106.011-.214.011-.322 0-2.707-2.271-4.901-5.072-4.901-2.073 0-3.856 1.202-4.643 2.925"
                  ></path>
                </svg>
              </span>
            </label>
          </div>
        </div>

        <button className="reset-btn" onClick={handleReset}>
          איפוס הכל
        </button>
      </div>
    </div>
  );
}

export default AccessibilityMenu;
