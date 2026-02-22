// src/components/AccessibilityButton.jsx
import React, { useState, useEffect, useRef } from "react";
import "./AccessibilityButton.css";
import AccessibilityMenu from "./AccessibilityMenu";
import accessibilityIcon from "../assets/accessibility.png";

function AccessibilityButton() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Close menu on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  return (
    <>
      <button
        ref={buttonRef}
        className="accessibility-button"
        onClick={toggleMenu}
        aria-label="פתח תפריט נגישות"
        aria-expanded={isMenuOpen}
        aria-haspopup="menu"
      >
        <img src={accessibilityIcon} alt="" className="accessibility-icon" />
        <span className="accessibility-text">נגישות</span>
      </button>

      {isMenuOpen && (
        <div ref={menuRef} role="menu">
          <AccessibilityMenu onClose={() => setIsMenuOpen(false)} />
        </div>
      )}
    </>
  );
}

export default AccessibilityButton;
