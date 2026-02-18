import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiLink,
  FiFileText,
  FiMail,
  FiPhone,
  FiChevronDown,
  FiWifi,
  FiUser,
  FiMessageCircle,
} from "react-icons/fi";
import {
  BsChat,
  BsFacebook,
  BsInstagram,
  BsTwitterX,
  BsLinkedin,
  BsYoutube,
  BsTiktok,
} from "react-icons/bs";
import logo from "../assets/logo.png";

function QrPage() {
  const [qrType, setQrType] = useState("url");
  const [qrValue, setQrValue] = useState("https://example.com");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [fgColor, setFgColor] = useState("#0a9396");
  const [qrImage, setQrImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("color");
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  // QR Type options - Main
  const qrTypesMain = [
    { value: "url", label: "Website", icon: FiLink },
    { value: "pdf", label: "PDF", icon: FiFileText },
    { value: "email", label: "Email", icon: FiMail },
    { value: "contact", label: "VCard", icon: FiUser },
    { value: "whatsapp", label: "WhatsApp", icon: BsChat },
    { value: "phone", label: "Phone", icon: FiPhone },
    { value: "sms", label: "SMS", icon: FiMessageCircle },
  ];

  // QR Type options - More
  const qrTypesMore = [
    { value: "wifi", label: "WiFi", icon: FiWifi },
    { value: "facebook", label: "Facebook", icon: BsFacebook },
    { value: "instagram", label: "Instagram", icon: BsInstagram },
    { value: "twitter", label: "Twitter/X", icon: BsTwitterX },
    { value: "linkedin", label: "LinkedIn", icon: BsLinkedin },
    { value: "youtube", label: "YouTube", icon: BsYoutube },
    { value: "tiktok", label: "TikTok", icon: BsTiktok },
  ];

  const qrTypes = [...qrTypesMain, ...qrTypesMore];

  // QR Type specific inputs
  const [qrInputs, setQrInputs] = useState({
    url: "https://example.com",
    pdf: "https://example.com/document.pdf",
    whatsapp: { phone: "+92", message: "Hey! Check this out." },
    email: { email: "your@email.com", subject: "", message: "" },
    phone: "+92",
    sms: { phone: "+92", message: "Check this out!" },
    wifi: { ssid: "Network", password: "", security: "WPA" },
    contact: { name: "John Doe", phone: "+92", email: "john@example.com" },
    facebook: "username",
    instagram: "username",
    twitter: "username",
    linkedin: "username",
    youtube: "username",
    tiktok: "username",
  });

  const buildQRValue = (type, inputs) => {
    switch (type) {
      case "url":
        return inputs.url;
      case "pdf":
        return inputs.pdf;
      case "whatsapp":
        return `https://wa.me/${inputs.whatsapp.phone.replace(/\D/g, "")}?text=${encodeURIComponent(inputs.whatsapp.message)}`;
      case "email":
        const emailParams = new URLSearchParams();
        if (inputs.email.subject)
          emailParams.append("subject", inputs.email.subject);
        if (inputs.email.message)
          emailParams.append("body", inputs.email.message);
        return `mailto:${inputs.email.email}${emailParams.toString() ? "?" + emailParams.toString() : ""}`;
      case "phone":
        return `tel:${inputs.phone}`;
      case "sms":
        return `sms:${inputs.sms.phone}?body=${encodeURIComponent(inputs.sms.message)}`;
      case "wifi":
        return `WIFI:T:${inputs.wifi.security};S:${inputs.wifi.ssid};P:${inputs.wifi.password};;`;
      case "contact":
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${inputs.contact.name}\nTEL:${inputs.contact.phone}\nEMAIL:${inputs.contact.email}\nEND:VCARD`;
      case "facebook":
        return `https://facebook.com/${inputs.facebook}`;
      case "instagram":
        return `https://instagram.com/${inputs.instagram}`;
      case "twitter":
        return `https://twitter.com/${inputs.twitter}`;
      case "linkedin":
        return `https://linkedin.com/in/${inputs.linkedin}`;
      case "youtube":
        return `https://youtube.com/@${inputs.youtube}`;
      case "tiktok":
        return `https://tiktok.com/@${inputs.tiktok}`;
      default:
        return inputs.url;
    }
  };

  const handleQRTypeChange = (newType) => {
    setQrType(newType);
    const newValue = buildQRValue(newType, qrInputs);
    setQrValue(newValue);
  };

  const handleInputChange = (path, value) => {
    const newInputs = JSON.parse(JSON.stringify(qrInputs));
    const keys = path.split(".");
    let obj = newInputs;
    for (let i = 0; i < keys.length - 1; i++) {
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
    setQrInputs(newInputs);
    const newValue = buildQRValue(qrType, newInputs);
    setQrValue(newValue);
  };

  const generateQR = async (text, fg, bg) => {
    if (!text.trim()) {
      setQrImage("");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/generate-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, color: fg, bgColor: bg }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate QR code");
      }

      const data = await response.json();
      setQrImage(data.qrImage);
    } catch (err) {
      console.error("Error generating QR:", err);
      setError("Failed to generate QR code");
      setQrImage("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      generateQR(qrValue, fgColor, bgColor);
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [qrValue, fgColor, bgColor]);

  const downloadQR = (format) => {
    if (!qrImage) return;

    const link = document.createElement("a");
    link.href = qrImage;
    link.download = `qr-code.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
                    <input
                      type="url"
                      value={qrInputs.pdf}
                      onChange={(e) => handleInputChange("pdf", e.target.value)}
                      placeholder="https://example.com/document.pdf"
                      className="form-control form-control-lg"
                    />
                    <div className="form-text">Enter a PDF file URL</div>
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
                        placeholder="+92 123 456 7890"
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
                        placeholder="John Doe"
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
                        placeholder="+92 123 456 7890"
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
                  <div className="vstack gap-3">
                    <div>
                      <label className="form-label">Foreground (QR Dots)</label>
                      <div className="d-flex gap-2">
                        <input
                          type="color"
                          value={fgColor}
                          onChange={(e) => setFgColor(e.target.value)}
                          className="form-control form-control-color"
                          title="Choose foreground color"
                        />
                        <input
                          type="text"
                          value={fgColor}
                          onChange={(e) => setFgColor(e.target.value)}
                          className="form-control font-monospace"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Background</label>
                      <div className="d-flex gap-2">
                        <input
                          type="color"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="form-control form-control-color"
                          title="Choose background color"
                        />
                        <input
                          type="text"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="form-control font-monospace"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "shape" && (
                  <div className="alert alert-light border">
                    Shape customization is coming next.
                  </div>
                )}

                {activeTab === "logo" && (
                  <div className="alert alert-light border">
                    Logo upload is coming next.
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
                  className="qr-preview mb-4 flex-grow-1"
                  style={{ background: bgColor }}
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
                  {!loading && qrImage && (
                    <img
                      src={qrImage}
                      alt="Generated QR Code"
                      className="img-fluid qr-image"
                    />
                  )}
                  {!loading && !qrImage && (
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
    </div>
  );
}

export default QrPage;
