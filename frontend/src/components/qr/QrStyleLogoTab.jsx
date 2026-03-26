import { FiFileText, FiGrid, FiLink, FiX } from "react-icons/fi";
import {
  PRESET_BRAND_LOGOS,
  isPresetLogoDataUrl,
} from "../../utils/presetBrandLogos";

function QrStyleLogoTab({
  logoInputMode,
  setLogoInputMode,
  logoShape,
  setLogoShape,
  logoUrl,
  setLogoUrl,
  logoFile,
  setLogoFile,
  isLogoDragging,
  handleLogoDrop,
  handleLogoDragOver,
  handleLogoDragLeave,
  handleLogoFileSelect,
}) {
  const selectPreset = (preset) => {
    setLogoInputMode("preset");
    setLogoFile(null);
    if (logoUrl === preset.dataUrl) {
      setLogoUrl("");
    } else {
      setLogoUrl(preset.dataUrl);
    }
  };

  const sourceTabClass = (mode) =>
    `nav-link ${logoInputMode === mode ? "active" : ""}`;
  const shapeTabClass = (shape) =>
    `nav-link ${logoShape === shape ? "active" : ""}`;

  return (
    <div className="qr-logo-tab-stack">
      <ul
        className="nav nav-pills qr-tabs qr-logo-tab-row qr-logo-inline-tabs mb-0"
        role="tablist"
        aria-label="מקור לוגו"
      >
          <li className="nav-item" role="presentation">
            <button
              type="button"
              className={sourceTabClass("preset")}
              role="tab"
              aria-selected={logoInputMode === "preset"}
              onClick={() => setLogoInputMode("preset")}
            >
              <FiGrid className="qr-logo-tab-icon" aria-hidden />
              לוגואים מוכנים
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              type="button"
              className={sourceTabClass("file")}
              role="tab"
              aria-selected={logoInputMode === "file"}
              onClick={() => {
                if (logoInputMode === "preset" && isPresetLogoDataUrl(logoUrl)) {
                  setLogoUrl("");
                  setLogoFile(null);
                }
                setLogoInputMode("file");
              }}
            >
              <FiFileText className="qr-logo-tab-icon" aria-hidden />
              העלאת תמונה
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              type="button"
              className={sourceTabClass("url")}
              role="tab"
              aria-selected={logoInputMode === "url"}
              onClick={() => {
                if (logoInputMode === "preset" && isPresetLogoDataUrl(logoUrl)) {
                  setLogoUrl("");
                  setLogoFile(null);
                }
                setLogoInputMode("url");
              }}
            >
              <FiLink className="qr-logo-tab-icon" aria-hidden />
              הדבקת URL
            </button>
          </li>
        </ul>

      <ul
        className="nav nav-pills qr-tabs qr-logo-tab-row qr-logo-inline-tabs mb-0"
        role="tablist"
        aria-label="צורת חיתוך לוגו"
      >
            <li className="nav-item" role="presentation">
              <button
                type="button"
                className={shapeTabClass("square")}
                role="tab"
                aria-selected={logoShape === "square"}
                onClick={() => setLogoShape("square")}
              >
                חור מרובע
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                type="button"
                className={shapeTabClass("circle")}
                role="tab"
                aria-selected={logoShape === "circle"}
                onClick={() => setLogoShape("circle")}
              >
                חור עגול
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                type="button"
                className={shapeTabClass("overlay")}
                role="tab"
                aria-selected={logoShape === "overlay"}
                onClick={() => setLogoShape("overlay")}
              >
                ללא חור
              </button>
            </li>
          </ul>

      {logoInputMode === "preset" ? (
        <>
          <div
            className="qr-preset-logo-grid"
            role="group"
            aria-label="לוגואים מוכנים"
          >
            {PRESET_BRAND_LOGOS.map((preset) => {
              const selected = logoUrl === preset.dataUrl;
              return (
                <button
                  key={preset.id}
                  type="button"
                  className={`qr-preset-logo-btn ${selected ? "qr-preset-logo-btn--selected" : ""}`}
                  onClick={() => selectPreset(preset)}
                  title={preset.name}
                  aria-label={`לוגו ${preset.name}`}
                  aria-pressed={selected}
                >
                  <span className="qr-preset-logo-btn__thumb">
                    <img src={preset.dataUrl} alt="" />
                  </span>
                  <span className="qr-preset-logo-btn__label">{preset.name}</span>
                </button>
              );
            })}
          </div>
        </>
      ) : logoInputMode === "file" ? (
        <>
          <div
            className={`pdf-drop-zone document-drop-zone qr-file-drop-zone-wide ${isLogoDragging ? "dragging" : ""} ${logoFile ? "has-file" : ""}`}
            onDrop={handleLogoDrop}
            onDragOver={handleLogoDragOver}
            onDragLeave={handleLogoDragLeave}
            onClick={() => document.getElementById("logo-file-input").click()}
          >
            <input
              id="logo-file-input"
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/svg+xml"
              onChange={handleLogoFileSelect}
              style={{ display: "none" }}
            />
            <div className="drop-zone-content document-upload-design">
              {logoFile ? (
                <>
                  <button
                    type="button"
                    className="delete-file-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLogoFile(null);
                      setLogoUrl("");
                    }}
                    title="מחק תמונה"
                  >
                    <FiX size={18} />
                  </button>
                  <FiFileText size={36} className="mb-2" />
                  <h6 className="mb-1">{logoFile.name}</h6>
                  <p className="text-muted mb-0 small">
                    {(logoFile.size / 1024).toFixed(2)} KB
                  </p>
                </>
              ) : (
                <>
                  <svg
                    className="document-upload-icon"
                    viewBox="0 0 640 512"
                    aria-hidden="true"
                  >
                    <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z" />
                  </svg>
                  <p className="mb-1 fw-semibold">גרור ושחרר</p>
                  <p className="mb-2 text-muted">או</p>
                  <span className="document-browse-button">בחר קובץ</span>
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <input
          type="url"
          className="form-control qr-logo-url-input"
          placeholder="https://example.com/logo.png"
          dir="ltr"
          aria-label="כתובת תמונת לוגו"
          value={logoUrl}
          onChange={(e) => {
            setLogoUrl(e.target.value);
            setLogoFile(null);
          }}
        />
      )}
    </div>
  );
}

export default QrStyleLogoTab;
