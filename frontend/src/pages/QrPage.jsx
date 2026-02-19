import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiFileText,
  FiChevronDown,
  FiEdit2,
  FiLink,
  FiX,
} from "react-icons/fi";
import { useQrGenerator } from "../hooks";
import {
  BG_EFFECTS,
  PRESET_COLORS,
  BODY_SHAPES,
  CORNER_SHAPES,
  QR_TYPES_MAIN,
  QR_TYPES_MORE,
} from "../utils/qrConstants";
import logo from "../assets/logo-full.png";
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

function QrPage() {
  const qr = useQrGenerator();

  const {
    qrType,
    bgColor,
    setBgColor,
    fgColor,
    setFgColor,
    qrImage,
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
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
  const presetColors = PRESET_COLORS;
  const bodyShapes = BODY_SHAPES;
  const cornerShapes = CORNER_SHAPES;
  const qrTypesMain = QR_TYPES_MAIN;
  const qrTypesMore = QR_TYPES_MORE;

  const tabClass = (tabName) =>
    `nav-link ${activeTab === tabName ? "active" : ""}`;

  return (
    <div className="qr-page">
      <header className="navbar navbar-expand-lg bg-white border-bottom sticky-top shadow-sm">
        <div className="container py-2">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img src={logo} alt="QR Master" className="brand-logo" />
          </Link>
          <div className="d-flex gap-2">
            <Link className="btn btn-outline-secondary btn-sm" to="/login">
              Login
            </Link>
            <Link className="btn btn-teal btn-sm" to="/register">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-4">
        <section className="text-center mb-5">
          <h1 className="display-5 fw-bold">Free QR Code Generator</h1>
          <p className="lead text-muted">
            Create, customize, and download QR codes with a clean, modern UI.
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
          <div className="col-lg-8 d-flex flex-column gap-4">
            <div className="card qr-card shadow-sm flex-grow-1">
              <div className="card-body p-4 d-flex flex-column">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <span className="qr-step">1</span>
                  <h5 className="mb-0">Enter your content</h5>
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
                    <div className="form-text">Enter a website URL</div>
                  </div>
                )}

                {qrType === "pdf" && (
                  <div>
                    <div className="d-flex gap-2 mb-3">
                      <button
                        type="button"
                        className={`btn ${pdfInputMode === "file" ? "btn-primary" : "btn-outline-secondary"}`}
                        onClick={() => setPdfInputMode("file")}
                      >
                        <FiFileText className="me-2" />
                        העלאת קובץ
                      </button>
                      <button
                        type="button"
                        className={`btn ${pdfInputMode === "url" ? "btn-primary" : "btn-outline-secondary"}`}
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
                                <p className="mb-1 fw-semibold">
                                  Drag and Drop
                                </p>
                                <p className="mb-2 text-muted">or</p>
                                <span className="document-browse-button">
                                  Browse file
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
                      <label className="form-label">Phone Number</label>
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
                      <label className="form-label">Message</label>
                      <textarea
                        value={qrInputs.whatsapp.message}
                        onChange={(e) =>
                          handleInputChange("whatsapp.message", e.target.value)
                        }
                        placeholder="Message to send..."
                        className="form-control form-control-lg"
                        rows="2"
                      />
                    </div>
                    <div className="form-text">
                      Opens WhatsApp chat with this message
                    </div>
                  </div>
                )}

                {qrType === "email" && (
                  <div className="vstack gap-3">
                    <div>
                      <label className="form-label">Email Address</label>
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
                      <label className="form-label">Subject (optional)</label>
                      <input
                        type="text"
                        value={qrInputs.email.subject}
                        onChange={(e) =>
                          handleInputChange("email.subject", e.target.value)
                        }
                        placeholder="Email subject..."
                        className="form-control form-control-lg"
                      />
                    </div>
                    <div>
                      <label className="form-label">Message (optional)</label>
                      <textarea
                        value={qrInputs.email.message}
                        onChange={(e) =>
                          handleInputChange("email.message", e.target.value)
                        }
                        placeholder="Email body..."
                        className="form-control form-control-lg"
                        rows="2"
                      />
                    </div>
                    <div className="form-text">
                      Opens email client with preset content
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
                    <div className="form-text">Enter phone number to call</div>
                  </div>
                )}

                {qrType === "sms" && (
                  <div className="vstack gap-3">
                    <div>
                      <label className="form-label">Phone Number</label>
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
                      <label className="form-label">Message</label>
                      <textarea
                        value={qrInputs.sms.message}
                        onChange={(e) =>
                          handleInputChange("sms.message", e.target.value)
                        }
                        placeholder="Your SMS message..."
                        className="form-control form-control-lg"
                        rows="2"
                      />
                    </div>
                    <div className="form-text">
                      Opens SMS app with this message
                    </div>
                  </div>
                )}

                {qrType === "wifi" && (
                  <div className="vstack gap-3">
                    <div>
                      <label className="form-label">Network Name (SSID)</label>
                      <input
                        type="text"
                        value={qrInputs.wifi.ssid}
                        onChange={(e) =>
                          handleInputChange("wifi.ssid", e.target.value)
                        }
                        placeholder="Network Name"
                        className="form-control form-control-lg"
                      />
                    </div>
                    <div>
                      <label className="form-label">Password</label>
                      <input
                        type="text"
                        value={qrInputs.wifi.password}
                        onChange={(e) =>
                          handleInputChange("wifi.password", e.target.value)
                        }
                        placeholder="WiFi password"
                        className="form-control form-control-lg"
                      />
                    </div>
                    <div>
                      <label className="form-label">Security Type</label>
                      <select
                        value={qrInputs.wifi.security}
                        onChange={(e) =>
                          handleInputChange("wifi.security", e.target.value)
                        }
                        className="form-select form-select-lg"
                      >
                        <option value="WPA">WPA/WPA2</option>
                        <option value="WEP">WEP</option>
                        <option value="nopass">Open (No Password)</option>
                      </select>
                    </div>
                    <div className="form-text">
                      Scan to auto-connect to WiFi
                    </div>
                  </div>
                )}

                {qrType === "contact" && (
                  <div className="vstack gap-3">
                    <div>
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        value={qrInputs.contact.name}
                        onChange={(e) =>
                          handleInputChange("contact.name", e.target.value)
                        }
                        placeholder="your name"
                        className="form-control form-control-lg"
                      />
                    </div>
                    <div>
                      <label className="form-label">Phone</label>
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
                      <label className="form-label">Email</label>
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
                    <div className="form-text">Scan to save contact</div>
                  </div>
                )}

                {qrType === "facebook" && (
                  <div>
                    <label className="form-label">Facebook Username</label>
                    <input
                      type="text"
                      value={qrInputs.facebook}
                      onChange={(e) =>
                        handleInputChange("facebook", e.target.value)
                      }
                      placeholder="your_username"
                      className="form-control form-control-lg"
                    />
                    <div className="form-text">
                      Links to your Facebook profile
                    </div>
                  </div>
                )}

                {qrType === "instagram" && (
                  <div>
                    <label className="form-label">Instagram Username</label>
                    <input
                      type="text"
                      value={qrInputs.instagram}
                      onChange={(e) =>
                        handleInputChange("instagram", e.target.value)
                      }
                      placeholder="your_username"
                      className="form-control form-control-lg"
                    />
                    <div className="form-text">
                      Links to your Instagram profile
                    </div>
                  </div>
                )}

                {qrType === "twitter" && (
                  <div>
                    <label className="form-label">Twitter/X Username</label>
                    <input
                      type="text"
                      value={qrInputs.twitter}
                      onChange={(e) =>
                        handleInputChange("twitter", e.target.value)
                      }
                      placeholder="your_username"
                      className="form-control form-control-lg"
                    />
                    <div className="form-text">
                      Links to your Twitter/X profile
                    </div>
                  </div>
                )}

                {qrType === "linkedin" && (
                  <div>
                    <label className="form-label">LinkedIn Username</label>
                    <input
                      type="text"
                      value={qrInputs.linkedin}
                      onChange={(e) =>
                        handleInputChange("linkedin", e.target.value)
                      }
                      placeholder="your_username"
                      className="form-control form-control-lg"
                    />
                    <div className="form-text">
                      Links to your LinkedIn profile
                    </div>
                  </div>
                )}

                {qrType === "youtube" && (
                  <div>
                    <label className="form-label">YouTube Handle</label>
                    <input
                      type="text"
                      value={qrInputs.youtube}
                      onChange={(e) =>
                        handleInputChange("youtube", e.target.value)
                      }
                      placeholder="your_channel"
                      className="form-control form-control-lg"
                    />
                    <div className="form-text">
                      Links to your YouTube channel
                    </div>
                  </div>
                )}

                {qrType === "tiktok" && (
                  <div>
                    <label className="form-label">TikTok Username</label>
                    <input
                      type="text"
                      value={qrInputs.tiktok}
                      onChange={(e) =>
                        handleInputChange("tiktok", e.target.value)
                      }
                      placeholder="your_username"
                      className="form-control form-control-lg"
                    />
                    <div className="form-text">
                      Links to your TikTok profile
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="card qr-card shadow-sm flex-grow-1">
              <div className="card-body p-4 d-flex flex-column">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <span className="qr-step">2</span>
                  <h5 className="mb-0">Customize design</h5>
                </div>

                <ul className="nav nav-pills qr-tabs mb-3" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      type="button"
                      className={tabClass("color")}
                      onClick={() => setActiveTab("color")}
                    >
                      Color
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      type="button"
                      className={tabClass("shape")}
                      onClick={() => setActiveTab("shape")}
                    >
                      Shape
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      type="button"
                      className={tabClass("logo")}
                      onClick={() => setActiveTab("logo")}
                    >
                      Logo
                    </button>
                  </li>
                </ul>

                {activeTab === "color" && (
                  <div className="vstack gap-4">
                    {/* QR Dots Color Section */}
                    <div className="qr-color-section">
                      <label className="form-label fw-bold mb-3">
                        QR Dots Color
                      </label>

                      {/* Color Selection */}
                      <div className="d-flex gap-2 flex-wrap">
                        {presetColors.map((color) => (
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
                        <button
                          onClick={() =>
                            document
                              .getElementById("fgCustomColorInput")
                              .click()
                          }
                          style={{
                            width: "48px",
                            height: "48px",
                            backgroundColor: fgColor,
                            border: "3px solid #0a9396",
                            borderRadius: "50%",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            boxShadow: "0 4px 12px rgba(10, 147, 150, 0.4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 0,
                          }}
                          title="Custom color"
                          onMouseEnter={(e) =>
                            (e.target.style.transform = "scale(1.1)")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.transform = "scale(1)")
                          }
                        >
                          <FiEdit2
                            size={20}
                            color="#fff"
                            style={{
                              filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
                            }}
                          />
                        </button>
                        <input
                          id="fgCustomColorInput"
                          type="color"
                          value={fgColor}
                          onChange={(e) => setFgColor(e.target.value)}
                          style={{ display: "none" }}
                        />
                      </div>
                    </div>

                    {/* Background Section */}
                    <hr className="my-2" />
                    <div className="qr-bg-section">
                      <label className="form-label fw-bold mb-3">
                        Background
                      </label>

                      {/* Mode Selection */}
                      <div className="d-flex gap-2 mb-3">
                        <button
                          onClick={() => setBgColorMode("none")}
                          style={{
                            flex: 1,
                            padding: "8px 16px",
                            borderRadius: "8px",
                            border:
                              bgColorMode === "none"
                                ? "2px solid #0a9396"
                                : "1px solid #d1d5db",
                            backgroundColor:
                              bgColorMode === "none" ? "#f0fffe" : "#ffffff",
                            color:
                              bgColorMode === "none" ? "#0a9396" : "#6b7280",
                            fontWeight: bgColorMode === "none" ? "600" : "500",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                        >
                          No BG
                        </button>
                        <button
                          onClick={() => setBgColorMode("solid")}
                          style={{
                            flex: 1,
                            padding: "8px 16px",
                            borderRadius: "8px",
                            border:
                              bgColorMode === "solid"
                                ? "2px solid #0a9396"
                                : "1px solid #d1d5db",
                            backgroundColor:
                              bgColorMode === "solid" ? "#f0fffe" : "#ffffff",
                            color:
                              bgColorMode === "solid" ? "#0a9396" : "#6b7280",
                            fontWeight: bgColorMode === "solid" ? "600" : "500",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                        >
                          Solid Color
                        </button>
                        <button
                          onClick={() => setBgColorMode("effect")}
                          style={{
                            flex: 1,
                            padding: "8px 16px",
                            borderRadius: "8px",
                            border:
                              bgColorMode === "effect"
                                ? "2px solid #0a9396"
                                : "1px solid #d1d5db",
                            backgroundColor:
                              bgColorMode === "effect" ? "#f0fffe" : "#ffffff",
                            color:
                              bgColorMode === "effect" ? "#0a9396" : "#6b7280",
                            fontWeight:
                              bgColorMode === "effect" ? "600" : "500",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                        >
                          Effect
                        </button>
                      </div>

                      {/* Color Selection */}
                      {bgColorMode !== "none" && (
                        <div className="d-flex gap-2 flex-wrap">
                          {bgColorMode === "solid" ? (
                            <>
                              {presetColors.map((color) => (
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
                              <button
                                onClick={() =>
                                  document
                                    .getElementById("bgCustomColorInput")
                                    .click()
                                }
                                style={{
                                  width: "48px",
                                  height: "48px",
                                  backgroundColor: bgColor,
                                  border: "3px solid #0a9396",
                                  borderRadius: "50%",
                                  cursor: "pointer",
                                  transition: "all 0.2s ease",
                                  boxShadow:
                                    "0 4px 12px rgba(10, 147, 150, 0.4)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  padding: 0,
                                }}
                                title="Custom color"
                                onMouseEnter={(e) =>
                                  (e.target.style.transform = "scale(1.1)")
                                }
                                onMouseLeave={(e) =>
                                  (e.target.style.transform = "scale(1)")
                                }
                              >
                                <FiEdit2
                                  size={20}
                                  color={
                                    bgColor === "#ffffff" ? "#000" : "#fff"
                                  }
                                  style={{
                                    filter:
                                      "drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
                                  }}
                                />
                              </button>
                              <input
                                id="bgCustomColorInput"
                                type="color"
                                value={bgColor}
                                onChange={(e) => setBgColor(e.target.value)}
                                style={{ display: "none" }}
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
                        BODY TYPE
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
                        EDGES
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
                                <p className="mb-1 fw-semibold">
                                  Drag and Drop
                                </p>
                                <p className="mb-2 text-muted">or</p>
                                <span className="document-browse-button">
                                  Browse file
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <label className="form-label fw-semibold">
                          LOGO URL
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
                    Generating...
                  </div>
                )}
                {error && (
                  <div className="alert alert-danger mt-3">{error}</div>
                )}
                {qrImage && !loading && (
                  <div className="alert alert-success mt-3">
                    QR ready to download.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card qr-card shadow-sm h-100">
              <div className="card-body p-4 d-flex flex-column">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <span className="qr-step">3</span>
                  <h5 className="mb-0">Your QR Code</h5>
                </div>

                <div
                  className={`qr-preview mb-4 flex-grow-1 ${
                    bgColorMode === "none"
                      ? "transparent-bg"
                      : bgColorMode === "effect" && bgEffect !== "none"
                        ? `effect-${bgEffect}`
                        : ""
                  }`}
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
                      <div className="text-muted">Generating QR...</div>
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
                        src={qrImage}
                        alt="Generated QR Code"
                        className="img-fluid qr-image"
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
                        Start typing to generate a QR code.
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
                      Download PNG
                    </button>
                  </div>
                  <div className="col-md-6">
                    <button
                      className="btn btn-outline-teal w-100"
                      onClick={() => downloadQR("svg")}
                      disabled={!qrImage || loading}
                    >
                      Download SVG
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="qr-footer mt-5">
        <div className="container text-center small text-muted">
          Built for your portfolio · Privacy · Terms
        </div>
      </footer>

      <button
        type="button"
        className={`back-to-top-button ${showBackToTop ? "visible" : ""}`}
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <svg className="back-to-top-icon" viewBox="0 0 384 512">
          <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z" />
        </svg>
      </button>
    </div>
  );
}

export default QrPage;
