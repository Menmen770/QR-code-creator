import React, { useState } from "react";
import { FiFileText, FiChevronDown, FiLink, FiX } from "react-icons/fi";
import { useQrGenerator } from "../hooks";
import {
  BG_EFFECTS,
  PRESET_QR_COLORS,
  PRESET_BG_COLORS,
  BODY_SHAPES,
  CORNER_SHAPES,
  STICKER_OPTIONS,
  QR_TYPES_MAIN,
  QR_TYPES_MORE,
} from "../utils/qrConstants";
import edge1 from "../assets/edges/1.svg";
import edge2 from "../assets/edges/2.svg";
import edge3 from "../assets/edges/3.svg";
import edge4 from "../assets/edges/4.svg";
import edge5 from "../assets/edges/5.svg";
import edge6 from "../assets/edges/6.svg";
import edge7 from "../assets/edges/7.svg";
import body1 from "../assets/body/1.svg";
import body2 from "../assets/body/2.svg";
import body3 from "../assets/body/3.svg";
import body4 from "../assets/body/4.svg";
import body5 from "../assets/body/5.svg";
import body6 from "../assets/body/6.svg";
import StickerPreview from "../components/StickerPreview";
import QrCustomColorButton from "../components/QrCustomColorButton";
import WhyUsSection from "../components/WhyUsSection";
import PromotionalMaterialsSection from "../components/PromotionalMaterialsSection";

function QrPage() {
  const qr = useQrGenerator();

  const {
    qrType,
    bgColor,
    setBgColor,
    fgColor,
    setFgColor,
    qrImage,
    previewImage,
    loading,
    error,
    bgColorMode,
    setBgColorMode,
    bgEffect,
    setBgEffect,
    pdfFile,
    setPdfFile,
    isDragging,
    pdfInputMode,
    setPdfInputMode,
    dotsType,
    setDotsType,
    cornersType,
    setCornersType,
    logoUrl,
    setLogoUrl,
    logoFile,
    setLogoFile,
    isLogoDragging,
    logoInputMode,
    setLogoInputMode,
    logoShape,
    setLogoShape,
    stickerType,
    setStickerType,
    qrInputs,
    handleQRTypeChange,
    handleInputChange,
    handlePdfDrop,
    handlePdfDragOver,
    handlePdfDragLeave,
    handlePdfFileSelect,
    handleLogoDrop,
    handleLogoDragOver,
    handleLogoDragLeave,
    handleLogoFileSelect,
    getEffectBackground,
    downloadQR,
  } = qr;

  const [activeTab, setActiveTab] = useState("color");
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  // Map edge images to corner shapes
  const edgeImages = {
    1: edge1,
    2: edge2,
    3: edge3,
    4: edge4,
    5: edge5,
    6: edge6,
    7: edge7,
  };

  // Map body images to body shapes
  const bodyImages = {
    1: body1,
    2: body2,
    3: body3,
    4: body4,
    5: body5,
    6: body6,
  };

  const bgEffects = BG_EFFECTS;
  const qrPresetColors = PRESET_QR_COLORS;
  const bgPresetColors = PRESET_BG_COLORS;
  const bodyShapes = BODY_SHAPES;
  const cornerShapes = CORNER_SHAPES;
  const stickerOptions = STICKER_OPTIONS;
  const qrTypesMain = QR_TYPES_MAIN;
  const qrTypesMore = QR_TYPES_MORE;
  const qrTypeTitleMap = {
    url: "אתר",
    pdf: "PDF",
    email: "אימייל",
    contact: "איש קשר",
    whatsapp: "וואטסאפ",
    phone: "טלפון",
    sms: "SMS",
    wifi: "WiFi",
    facebook: "פייסבוק",
    instagram: "אינסטגרם",
    twitter: "X / Twitter",
    linkedin: "לינקדאין",
    youtube: "יוטיוב",
    tiktok: "טיקטוק",
  };
  const currentTypeTitle = qrTypeTitleMap[qrType] || "תוכן";
  const stepOneTitle =
    qrType === "url"
      ? "הזן את כתובת האתר שלך"
      : `הזן תוכן עבור ${currentTypeTitle}`;

  const tabClass = (tabName) =>
    `nav-link ${activeTab === tabName ? "active" : ""}`;

  const bgModeClass = (mode) =>
    `nav-link ${bgColorMode === mode ? "active" : ""}`;

  return (
    <div className="qr-page">
      <main className="container py-4">
        <section className="text-center mb-5">
          <h1 className="display-5 fw-bold">מחולל QR בעיצוב אישי</h1>
          <p className="lead text-muted">
            ליצור, לעצב ולהוריד קודי QR בממשק מודרני, מהיר ובחינם.
          </p>
        </section>

        <div className="qr-type-selector-wrapper">
          <div className="qr-type-selector">
            {qrTypesMain.map((type) => {
              const IconComponent = type.icon;
              return (
                <button
                  key={type.value}
                  onClick={() => handleQRTypeChange(type.value)}
                  className={`qr-type-btn ${qrType === type.value ? "active" : ""}`}
                  title={type.label}
                >
                  <IconComponent className="qr-type-icon" />
                  <span className="qr-type-label">{type.label}</span>
                </button>
              );
            })}

            <button
              className="qr-type-btn more-btn"
              onClick={() => setShowMoreOptions(!showMoreOptions)}
            >
              <FiChevronDown
                className="qr-type-icon"
                style={{
                  transform: showMoreOptions ? "rotate(180deg)" : "none",
                }}
              />
              <span className="qr-type-label">More</span>
            </button>
          </div>
          {showMoreOptions && (
            <div className="qr-more-dropdown-overlay">
              {qrTypesMore.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.value}
                    onClick={() => {
                      handleQRTypeChange(type.value);
                      setShowMoreOptions(false);
                    }}
                    className={`qr-more-option ${qrType === type.value ? "active" : ""}`}
                  >
                    <IconComponent className="qr-more-icon" />
                    <span>{type.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="row g-4" style={{ alignItems: "stretch" }}>
          <div className="col-lg-7 d-flex flex-column gap-4">
            <div className="card qr-card shadow-sm flex-grow-1">
              <div className="card-body p-4 d-flex flex-column">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <span className="qr-step">1</span>
                  <h5 className="mb-0">{stepOneTitle}</h5>
                </div>

                {qrType === "url" && (
                  <div>
                    <input
                      type="url"
                      value={qrInputs.url}
                      onChange={(e) => handleInputChange("url", e.target.value)}
                      placeholder="https://example.com"
                      className="form-control form-control-lg"
                    />
                  </div>
                )}

                {qrType === "pdf" && (
                  <div>
                    <div className="d-flex gap-2 mb-3">
                      <button
                        type="button"
                        className={`btn pdf-input-mode-btn ${pdfInputMode === "file" ? "btn-primary" : "btn-outline-secondary"}`}
                        onClick={() => setPdfInputMode("file")}
                      >
                        <FiFileText className="me-2" />
                        העלאת קובץ
                      </button>
                      <button
                        type="button"
                        className={`btn pdf-input-mode-btn ${pdfInputMode === "url" ? "btn-primary" : "btn-outline-secondary"}`}
                        onClick={() => setPdfInputMode("url")}
                      >
                        <FiLink className="me-2" />
                        הדבקת URL
                      </button>
                    </div>

                    {pdfInputMode === "file" ? (
                      <>
                        <div
                          className={`pdf-drop-zone document-drop-zone ${isDragging ? "dragging" : ""} ${pdfFile ? "has-file" : ""}`}
                          onDrop={handlePdfDrop}
                          onDragOver={handlePdfDragOver}
                          onDragLeave={handlePdfDragLeave}
                          onClick={() =>
                            document.getElementById("pdf-file-input").click()
                          }
                        >
                          <input
                            id="pdf-file-input"
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={handlePdfFileSelect}
                            style={{ display: "none" }}
                          />
                          <div className="drop-zone-content document-upload-design">
                            {pdfFile ? (
                              <>
                                <button
                                  className="delete-file-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPdfFile(null);
                                    handleInputChange("pdf", "");
                                  }}
                                  title="מחק קובץ"
                                >
                                  <FiX size={18} />
                                </button>
                                <FiFileText size={36} className="mb-2" />
                                <h6 className="mb-1">{pdfFile.name}</h6>
                                <p className="text-muted mb-0 small">
                                  {(pdfFile.size / 1024).toFixed(2)} KB
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
                                <span className="document-browse-button">
                                  בחר קובץ
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <input
                          type="url"
                          value={qrInputs.pdf}
                          onChange={(e) =>
                            handleInputChange("pdf", e.target.value)
                          }
                          placeholder="https://example.com/document.pdf"
                          className="form-control form-control-lg"
                        />
                        <div className="form-text">
                          הדבק כאן URL של קובץ PDF
                        </div>
                      </>
                    )}
                  </div>
                )}

                {qrType === "whatsapp" && (
                  <div className="vstack gap-3">
                    <div>
                      <label className="form-label">מספר טלפון</label>
                      <input
                        type="tel"
                        value={qrInputs.whatsapp.phone}
                        onChange={(e) =>
                          handleInputChange("whatsapp.phone", e.target.value)
                        }
                        placeholder="+92 123 456 7890"
                        className="form-control form-control-lg"
                      />
                    </div>
                    <div>
                      <label className="form-label">הודעה</label>
                      <textarea
                        value={qrInputs.whatsapp.message}
                        onChange={(e) =>
                          handleInputChange("whatsapp.message", e.target.value)
                        }
                        placeholder="הודעה לשליחה..."
                        className="form-control form-control-lg"
                        rows="2"
                      />
                    </div>
                    <div className="form-text">
                      פותח שיחת WhatsApp עם ההודעה הזו
                    </div>
                  </div>
                )}

                {qrType === "email" && (
                  <div className="vstack gap-3">
                    <div>
                      <label className="form-label">כתובת אימייל</label>
                      <input
                        type="email"
                        value={qrInputs.email.email}
                        onChange={(e) =>
                          handleInputChange("email.email", e.target.value)
                        }
                        placeholder="your@email.com"
                        className="form-control form-control-lg"
                      />
                    </div>
                    <div>
                      <label className="form-label">נושא (אופציונלי)</label>
                      <input
                        type="text"
                        value={qrInputs.email.subject}
                        onChange={(e) =>
                          handleInputChange("email.subject", e.target.value)
                        }
                        placeholder="נושא האימייל..."
                        className="form-control form-control-lg"
                      />
                    </div>
                    <div>
                      <label className="form-label">הודעה (אופציונלי)</label>
                      <textarea
                        value={qrInputs.email.message}
                        onChange={(e) =>
                          handleInputChange("email.message", e.target.value)
                        }
                        placeholder="תוכן האימייל..."
                        className="form-control form-control-lg"
                        rows="2"
                      />
                    </div>
                    <div className="form-text">
                      פותח את אפליקציית האימייל עם תוכן מוכן
                    </div>
                  </div>
                )}

                {qrType === "phone" && (
                  <div>
                    <input
                      type="tel"
                      value={qrInputs.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="+92 123 456 7890"
                      className="form-control form-control-lg"
                    />
                    <div className="form-text">הזן מספר טלפון לחיוג</div>
                  </div>
                )}

                {qrType === "sms" && (
                  <div className="vstack gap-3">
                    <div>
                      <label className="form-label">מספר טלפון</label>
                      <input
                        type="tel"
                        value={qrInputs.sms.phone}
                        onChange={(e) =>
                          handleInputChange("sms.phone", e.target.value)
                        }
                        placeholder="+972 123 456 789"
                        className="form-control form-control-lg"
                      />
                    </div>
                    <div>
                      <label className="form-label">הודעה</label>
                      <textarea
                        value={qrInputs.sms.message}
                        onChange={(e) =>
                          handleInputChange("sms.message", e.target.value)
                        }
                        placeholder="תוכן הודעת ה-SMS..."
                        className="form-control form-control-lg"
                        rows="2"
                      />
                    </div>
                    <div className="form-text">
                      פותח את אפליקציית ה-SMS עם ההודעה הזו
                    </div>
                  </div>
                )}

                {qrType === "wifi" && (
                  <div className="vstack gap-3">
                    <div>
                      <label className="form-label">שם הרשת (SSID)</label>
                      <input
                        type="text"
                        value={qrInputs.wifi.ssid}
                        onChange={(e) =>
                          handleInputChange("wifi.ssid", e.target.value)
                        }
                        placeholder="שם הרשת"
                        className="form-control form-control-lg"
                      />
                    </div>
                    <div>
                      <label className="form-label">סיסמה</label>
                      <input
                        type="text"
                        value={qrInputs.wifi.password}
                        onChange={(e) =>
                          handleInputChange("wifi.password", e.target.value)
                        }
                        placeholder="סיסמת WiFi"
                        className="form-control form-control-lg"
                      />
                    </div>
                    <div>
                      <label className="form-label">סוג אבטחה</label>
                      <select
                        value={qrInputs.wifi.security}
                        onChange={(e) =>
                          handleInputChange("wifi.security", e.target.value)
                        }
                        className="form-select form-select-lg"
                      >
                        <option value="WPA">WPA/WPA2</option>
                        <option value="WEP">WEP</option>
                        <option value="nopass">פתוח (ללא סיסמה)</option>
                      </select>
                    </div>
                    <div className="form-text">
                      סרוק להתחברות אוטומטית ל-WiFi
                    </div>
                  </div>
                )}

                {qrType === "contact" && (
                  <div className="vstack gap-3">
                    <div>
                      <label className="form-label">שם מלא</label>
                      <input
                        type="text"
                        value={qrInputs.contact.name}
                        onChange={(e) =>
                          handleInputChange("contact.name", e.target.value)
                        }
                        placeholder="השם שלך"
                        className="form-control form-control-lg"
                      />
                    </div>
                    <div>
                      <label className="form-label">טלפון</label>
                      <input
                        type="tel"
                        value={qrInputs.contact.phone}
                        onChange={(e) =>
                          handleInputChange("contact.phone", e.target.value)
                        }
                        placeholder="+972 123 456 789"
                        className="form-control form-control-lg"
                      />
                    </div>
                    <div>
                      <label className="form-label">אימייל</label>
                      <input
                        type="email"
                        value={qrInputs.contact.email}
                        onChange={(e) =>
                          handleInputChange("contact.email", e.target.value)
                        }
                        placeholder="email@example.com"
                        className="form-control form-control-lg"
                      />
                    </div>
                    <div className="form-text">סרוק לשמירת איש קשר</div>
                  </div>
                )}

                {qrType === "facebook" && (
                  <div>
                    <label className="form-label">שם משתמש בפייסבוק</label>
                    <input
                      type="text"
                      value={qrInputs.facebook}
                      onChange={(e) =>
                        handleInputChange("facebook", e.target.value)
                      }
                      placeholder="שם_המשתמש_שלך"
                      className="form-control form-control-lg"
                    />
                    <div className="form-text">קישור לפרופיל הפייסבוק שלך</div>
                  </div>
                )}

                {qrType === "instagram" && (
                  <div>
                    <label className="form-label">שם משתמש באינסטגרם</label>
                    <input
                      type="text"
                      value={qrInputs.instagram}
                      onChange={(e) =>
                        handleInputChange("instagram", e.target.value)
                      }
                      placeholder="שם_המשתמש_שלך"
                      className="form-control form-control-lg"
                    />
                    <div className="form-text">קישור לפרופיל האינסטגרם שלך</div>
                  </div>
                )}

                {qrType === "twitter" && (
                  <div>
                    <label className="form-label">שם משתמש ב-X/Twitter</label>
                    <input
                      type="text"
                      value={qrInputs.twitter}
                      onChange={(e) =>
                        handleInputChange("twitter", e.target.value)
                      }
                      placeholder="שם_המשתמש_שלך"
                      className="form-control form-control-lg"
                    />
                    <div className="form-text">
                      קישור לפרופיל ה-X/Twitter שלך
                    </div>
                  </div>
                )}

                {qrType === "linkedin" && (
                  <div>
                    <label className="form-label">שם משתמש בלינקדאין</label>
                    <input
                      type="text"
                      value={qrInputs.linkedin}
                      onChange={(e) =>
                        handleInputChange("linkedin", e.target.value)
                      }
                      placeholder="שם_המשתמש_שלך"
                      className="form-control form-control-lg"
                    />
                    <div className="form-text">קישור לפרופיל הלינקדאין שלך</div>
                  </div>
                )}

                {qrType === "youtube" && (
                  <div>
                    <label className="form-label">מזהה YouTube</label>
                    <input
                      type="text"
                      value={qrInputs.youtube}
                      onChange={(e) =>
                        handleInputChange("youtube", e.target.value)
                      }
                      placeholder="הערוץ_שלך"
                      className="form-control form-control-lg"
                    />
                    <div className="form-text">קישור לערוץ ה-YouTube שלך</div>
                  </div>
                )}

                {qrType === "tiktok" && (
                  <div>
                    <label className="form-label">שם משתמש בטיקטוק</label>
                    <input
                      type="text"
                      value={qrInputs.tiktok}
                      onChange={(e) =>
                        handleInputChange("tiktok", e.target.value)
                      }
                      placeholder="שם_המשתמש_שלך"
                      className="form-control form-control-lg"
                    />
                    <div className="form-text">קישור לפרופיל הטיקטוק שלך</div>
                  </div>
                )}
              </div>
            </div>

            <div className="card qr-card shadow-sm flex-grow-1">
              <div className="card-body p-4 d-flex flex-column">
                <div className="qr-style-header-row mb-3">
                  <div className="d-flex align-items-center gap-3">
                    <span className="qr-step">2</span>
                    <h5 className="mb-0">התאם את העיצוב</h5>
                  </div>

                  <ul className="nav nav-pills qr-tabs" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        type="button"
                        className={tabClass("color")}
                        onClick={() => setActiveTab("color")}
                      >
                        צבע
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        type="button"
                        className={tabClass("shape")}
                        onClick={() => setActiveTab("shape")}
                      >
                        צורה
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        type="button"
                        className={tabClass("logo")}
                        onClick={() => setActiveTab("logo")}
                      >
                        לוגו
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        type="button"
                        className={tabClass("sticker")}
                        onClick={() => setActiveTab("sticker")}
                      >
                        סטיקר
                      </button>
                    </li>
                  </ul>
                </div>

                {activeTab === "color" && (
                  <div className="vstack gap-4">
                    {/* QR Dots Color Section */}
                    <div className="qr-color-section">
                      <label className="form-label fw-bold mb-3">
                        צבע נקודות ה-QR
                      </label>

                      {/* Color Selection */}
                      <div className="d-flex gap-2 flex-wrap qr-color-palette">
                        {qrPresetColors.map((color) => (
                          <button
                            key={color.hex}
                            onClick={() => setFgColor(color.hex)}
                            style={{
                              width: "48px",
                              height: "48px",
                              backgroundColor: color.hex,
                              border:
                                fgColor === color.hex
                                  ? "3px solid #0a9396"
                                  : "none",
                              borderRadius: "50%",
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              boxShadow:
                                fgColor === color.hex
                                  ? "0 4px 12px rgba(10, 147, 150, 0.4)"
                                  : "none",
                              padding: 0,
                            }}
                            title={color.name}
                            onMouseEnter={(e) =>
                              (e.target.style.transform = "scale(1.1)")
                            }
                            onMouseLeave={(e) =>
                              (e.target.style.transform = "scale(1)")
                            }
                          />
                        ))}
                        <QrCustomColorButton
                          value={fgColor}
                          onChange={setFgColor}
                          title="צבע מותאם אישית"
                          variant="foreground"
                        />
                      </div>
                    </div>

                    {/* Background Section */}
                    <hr className="my-2" />
                    <div className="qr-bg-section">
                      <div className="qr-bg-mode-row mb-3">
                        <label className="form-label fw-bold mb-0">רקע</label>

                        <ul
                          className="nav nav-pills qr-tabs qr-bg-mode-tabs"
                          role="tablist"
                        >
                          <li className="nav-item" role="presentation">
                            <button
                              type="button"
                              className={bgModeClass("none")}
                              onClick={() => setBgColorMode("none")}
                            >
                              ללא רקע
                            </button>
                          </li>
                          <li className="nav-item" role="presentation">
                            <button
                              type="button"
                              className={bgModeClass("solid")}
                              onClick={() => setBgColorMode("solid")}
                            >
                              צבע אחיד
                            </button>
                          </li>
                          <li className="nav-item" role="presentation">
                            <button
                              type="button"
                              className={bgModeClass("effect")}
                              onClick={() => setBgColorMode("effect")}
                            >
                              אפקט
                            </button>
                          </li>
                        </ul>
                      </div>

                      {/* Color Selection */}
                      {bgColorMode !== "none" && (
                        <div className="d-flex gap-2 flex-wrap qr-color-palette">
                          {bgColorMode === "solid" ? (
                            <>
                              {bgPresetColors.map((color) => (
                                <button
                                  key={color.hex}
                                  onClick={() => setBgColor(color.hex)}
                                  style={{
                                    width: "48px",
                                    height: "48px",
                                    backgroundColor: color.hex,
                                    border:
                                      bgColor === color.hex
                                        ? "3px solid #0a9396"
                                        : "none",
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                    boxShadow:
                                      bgColor === color.hex
                                        ? "0 4px 12px rgba(10, 147, 150, 0.4)"
                                        : "none",
                                    padding: 0,
                                  }}
                                  title={color.name}
                                  onMouseEnter={(e) =>
                                    (e.target.style.transform = "scale(1.1)")
                                  }
                                  onMouseLeave={(e) =>
                                    (e.target.style.transform = "scale(1)")
                                  }
                                />
                              ))}
                              <QrCustomColorButton
                                value={bgColor}
                                onChange={setBgColor}
                                title="צבע מותאם אישית"
                                variant="background"
                              />
                            </>
                          ) : (
                            <>
                              {bgEffects.map((effect) => (
                                <button
                                  key={effect.id}
                                  onClick={() => setBgEffect(effect.id)}
                                  style={{
                                    width: "48px",
                                    height: "48px",
                                    borderRadius: "50%",
                                    border:
                                      bgEffect === effect.id
                                        ? "3px solid #0a9396"
                                        : "2px solid #e8e8e8",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                    background: getEffectBackground(effect.id),
                                    boxShadow:
                                      bgEffect === effect.id
                                        ? "0 4px 12px rgba(10, 147, 150, 0.4)"
                                        : "none",
                                    padding: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "11px",
                                    fontWeight: "600",
                                    color:
                                      effect.id === "none"
                                        ? bgEffect === effect.id
                                          ? "#0a9396"
                                          : "#6b7280"
                                        : "#ffffff",
                                    textShadow:
                                      effect.id === "none"
                                        ? "none"
                                        : "0 1px 2px rgba(0,0,0,0.5)",
                                  }}
                                  title={effect.name}
                                  onMouseEnter={(e) =>
                                    (e.target.style.transform = "scale(1.1)")
                                  }
                                  onMouseLeave={(e) =>
                                    (e.target.style.transform = "scale(1)")
                                  }
                                >
                                  {effect.id === "none" ? "⚪" : ""}
                                </button>
                              ))}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "shape" && (
                  <div className="vstack gap-4">
                    {/* Body Type Section */}
                    <div className="qr-shape-section">
                      <label className="form-label fw-semibold mb-4">
                        סוג גוף
                      </label>
                      <div className="d-flex flex-wrap gap-3">
                        {bodyShapes.map((shape, index) => {
                          const imageNum = index + 8;
                          return (
                            <button
                              type="button"
                              className={`edge-select-btn ${dotsType === shape.id ? "selected" : ""}`}
                              onClick={() => setDotsType(shape.id)}
                              title={shape.name}
                              key={shape.id}
                            >
                              <img
                                src={bodyImages[index + 1]}
                                alt={shape.name}
                                className="edge-preview-img"
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <hr className="my-2" />

                    {/* Edges Section */}
                    <div className="qr-shape-section">
                      <label className="form-label fw-semibold mb-4">
                        פינות
                      </label>
                      <div className="d-flex flex-wrap gap-3">
                        {cornerShapes.map((shape, index) => {
                          const imageNum = index + 1;
                          return (
                            <button
                              type="button"
                              className={`edge-select-btn ${cornersType === shape.id ? "selected" : ""}`}
                              onClick={() => setCornersType(shape.id)}
                              title={shape.name}
                              key={shape.id}
                            >
                              <img
                                src={edgeImages[imageNum]}
                                alt={shape.name}
                                className="edge-preview-img"
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "sticker" && (
                  <div className="qr-sticker-section">
                    <label className="form-label fw-bold mb-3">
                      בחר סטיקר
                    </label>
                    <div className="qr-sticker-grid">
                      {stickerOptions.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          className={`qr-sticker-btn ${stickerType === opt.id ? "selected" : ""}`}
                          onClick={() => setStickerType(opt.id)}
                          title={opt.name}
                        >
                          {opt.thumbnail ? (
                            <img
                              src={opt.thumbnail}
                              alt=""
                              className="qr-sticker-thumb"
                            />
                          ) : (
                            <StickerPreview type={opt.id} name={opt.name} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "logo" && (
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
                          onClick={() =>
                            document.getElementById("logo-file-input").click()
                          }
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
                                <span className="document-browse-button">
                                  בחר קובץ
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <label className="form-label fw-semibold">
                          קישור לוגו
                        </label>
                        <input
                          type="url"
                          className="form-control"
                          placeholder="https://example.com/logo.png"
                          value={logoUrl}
                          onChange={(e) => {
                            console.log("Logo URL changed to:", e.target.value);
                            setLogoUrl(e.target.value);
                            setLogoFile(null); // Clear file when using URL
                          }}
                        />
                        <small className="text-muted">
                          הדבק כאן URL של תמונה (PNG/JPG/SVG)
                        </small>
                      </>
                    )}
                  </div>
                )}

                {loading && (
                  <div className="alert alert-info d-flex align-items-center gap-2 mt-3">
                    <span className="spinner-border spinner-border-sm" />
                    מייצר...
                  </div>
                )}
                {error && (
                  <div className="alert alert-danger mt-3">{error}</div>
                )}
                {qrImage && !loading && (
                  <div className="alert alert-success mt-3">
                    ה-QR מוכן להורדה.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="card qr-card shadow-sm h-100">
              <div className="card-body p-4 d-flex flex-column">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <span className="qr-step">3</span>
                  <h5 className="mb-0">קוד ה-QR שלך</h5>
                </div>

                <div
                  className={`qr-preview mb-4 flex-grow-1 ${
                    bgColorMode === "none"
                      ? "transparent-bg"
                      : bgColorMode === "effect" && bgEffect !== "none"
                        ? `effect-${bgEffect}`
                        : ""
                  } ${stickerType !== "none" ? "qr-preview--with-sticker" : ""}`}
                  style={
                    bgColorMode === "effect" && bgEffect !== "none"
                      ? {}
                      : bgColorMode === "none"
                        ? {}
                        : { background: bgColor }
                  }
                >
                  {loading && (
                    <div className="text-center">
                      <div
                        className="spinner-border text-teal mb-3"
                        role="status"
                      />
                      <div className="text-muted">יוצר QR...</div>
                    </div>
                  )}
                  {!loading &&
                    qrType === "pdf" &&
                    pdfInputMode === "file" &&
                    pdfFile &&
                    !qrInputs.pdf && (
                      <div className="text-center" style={{ color: "#0a9396" }}>
                        <FiFileText size={64} className="mb-3" />
                        <h5 className="mb-3">קובץ נבחר בהצלחה!</h5>
                        <div className="text-muted mb-2">
                          <p className="mb-2">
                            העלה את הקובץ לשירות אחסון (Google Drive, Dropbox
                            וכו')
                          </p>
                          <p className="mb-2"> לחץ על "הדבקת URL" למעלה</p>
                          <p className="mb-0">הדבק את הקישור ליצירת QR code</p>
                        </div>
                      </div>
                    )}
                  {!loading &&
                    !(
                      qrType === "pdf" &&
                      pdfInputMode === "file" &&
                      pdfFile &&
                      !qrInputs.pdf
                    ) &&
                    qrImage && (
                      <img
                        src={previewImage}
                        alt="קוד QR שנוצר"
                        className={`img-fluid qr-image ${stickerType !== "none" ? "qr-image--sticker" : ""}`}
                      />
                    )}
                  {!loading &&
                    !(
                      qrType === "pdf" &&
                      pdfInputMode === "file" &&
                      pdfFile &&
                      !qrInputs.pdf
                    ) &&
                    !qrImage && (
                      <div className="text-center text-muted">
                        <div className="display-6">QR</div>
                        התחל להקליד כדי ליצור קוד QR.
                      </div>
                    )}
                </div>

                <div className="row g-2">
                  <div className="col-md-6">
                    <button
                      className="btn btn-teal w-100"
                      onClick={() => downloadQR("png")}
                      disabled={!qrImage || loading}
                    >
                      הורד PNG
                    </button>
                  </div>
                  <div className="col-md-6">
                    <button
                      className="btn btn-outline-teal w-100"
                      onClick={() => downloadQR("svg")}
                      disabled={!qrImage || loading}
                    >
                      הורד SVG
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <WhyUsSection />
        <PromotionalMaterialsSection />
      </main>

      <footer className="qr-footer mt-5">
        <div className="container text-center small text-muted">
          Built for your portfolio · Privacy · Terms
        </div>
      </footer>
    </div>
  );
}

export default QrPage;
