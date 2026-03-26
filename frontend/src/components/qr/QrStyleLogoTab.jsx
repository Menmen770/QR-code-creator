import { FiFileText, FiLink, FiX } from "react-icons/fi";

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
  return (
    <div className="vstack gap-4">
      <div className="d-flex gap-2 mb-3">
        <button
          type="button"
          className={`btn ${logoInputMode === "file" ? "btn-primary" : "btn-outline-secondary"}`}
          onClick={() => setLogoInputMode("file")}
        >
          <FiFileText className="me-2" />
          העלאת תמונה
        </button>
        <button
          type="button"
          className={`btn ${logoInputMode === "url" ? "btn-primary" : "btn-outline-secondary"}`}
          onClick={() => setLogoInputMode("url")}
        >
          <FiLink className="me-2" />
          הדבקת URL
        </button>
      </div>

      <div className="d-flex gap-2 mb-3">
        <button
          type="button"
          className={`btn ${logoShape === "square" ? "btn-primary" : "btn-outline-secondary"}`}
          onClick={() => setLogoShape("square")}
        >
          חיתוך מרובע
        </button>
        <button
          type="button"
          className={`btn ${logoShape === "circle" ? "btn-primary" : "btn-outline-secondary"}`}
          onClick={() => setLogoShape("circle")}
        >
          חיתוך עגול
        </button>
      </div>

      {logoInputMode === "file" ? (
        <>
          <div
            className={`pdf-drop-zone document-drop-zone ${isLogoDragging ? "dragging" : ""} ${logoFile ? "has-file" : ""}`}
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
        <>
          <label className="form-label fw-semibold">קישור לוגו</label>
          <input
            type="url"
            className="form-control"
            placeholder="https://example.com/logo.png"
            value={logoUrl}
            onChange={(e) => {
              setLogoUrl(e.target.value);
              setLogoFile(null);
            }}
          />
          <small className="text-muted">
            הדבק כאן URL של תמונה (PNG/JPG/SVG)
          </small>
        </>
      )}
    </div>
  );
}

export default QrStyleLogoTab;
