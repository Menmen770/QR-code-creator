import { useState, useRef, useEffect, useMemo } from "react";
import { HexColorPicker } from "react-colorful";
import { FiEdit2 } from "react-icons/fi";

function normalizeHex(hex) {
  if (!hex || typeof hex !== "string") return "#000000";
  let h = hex.trim();
  if (!h.startsWith("#")) h = `#${h}`;
  if (/^#[0-9A-Fa-f]{3}$/.test(h)) {
    return `#${h[1]}${h[1]}${h[2]}${h[2]}${h[3]}${h[3]}`.toLowerCase();
  }
  if (/^#[0-9A-Fa-f]{6}$/.test(h)) return h.toLowerCase();
  return "#000000";
}

/**
 * כפתור עגול + פאנל בורר צבע מובנה ליד הכפתור (במקום דיאלוג מערכת שמופיע בפינה).
 */
export default function QrCustomColorButton({
  value,
  onChange,
  title = "צבע מותאם אישית",
  /** "foreground" = אייקון בהיר; "background" = ניגודיות לפי בהירות הרקע */
  variant = "foreground",
}) {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState("below");
  const wrapRef = useRef(null);

  const hex = useMemo(() => normalizeHex(value), [value]);
  const [hexText, setHexText] = useState(hex);
  useEffect(() => setHexText(hex), [hex]);

  const iconColor = useMemo(() => {
    if (variant === "foreground") return "#ffffff";
    const h = hex.replace("#", "");
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    const y = 0.299 * r + 0.587 * g + 0.114 * b;
    return y > 155 ? "#111111" : "#ffffff";
  }, [hex, variant]);

  useEffect(() => {
    if (!open) return;
    const wrap = wrapRef.current;
    if (!wrap) return;
    const updatePlacement = () => {
      const r = wrap.getBoundingClientRect();
      const spaceBelow = window.innerHeight - r.bottom;
      setPlacement(spaceBelow < 260 ? "above" : "below");
    };
    updatePlacement();
    window.addEventListener("scroll", updatePlacement, true);
    window.addEventListener("resize", updatePlacement);
    return () => {
      window.removeEventListener("scroll", updatePlacement, true);
      window.removeEventListener("resize", updatePlacement);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="qr-custom-color-wrap" ref={wrapRef}>
      <button
        type="button"
        className="qr-custom-color-trigger"
        style={{ "--qr-custom-color": hex }}
        title={title}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((o) => !o)}
      >
        <FiEdit2
          size={20}
          color={iconColor}
          style={{
            filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.35))",
          }}
        />
      </button>
      {open && (
        <div
          className={`qr-custom-color-panel ${placement === "above" ? "qr-custom-color-panel--above" : ""}`}
          role="dialog"
          aria-label={title}
        >
          <HexColorPicker color={hex} onChange={onChange} />
          <label className="qr-custom-color-hex-label">
            <span className="visually-hidden">קוד HEX</span>
            <input
              type="text"
              className="form-control form-control-sm qr-custom-color-hex-input"
              value={hexText}
              onChange={(e) => {
                const v = e.target.value;
                setHexText(v);
                if (/^#[0-9A-Fa-f]{6}$/.test(v)) onChange(v.toLowerCase());
              }}
              onBlur={() => {
                if (/^#[0-9A-Fa-f]{6}$/i.test(hexText)) {
                  const n = hexText.toLowerCase();
                  setHexText(n);
                  onChange(n);
                } else {
                  setHexText(hex);
                }
              }}
              spellCheck={false}
              maxLength={7}
              dir="ltr"
            />
          </label>
        </div>
      )}
    </div>
  );
}
