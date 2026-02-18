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
  FiEdit2,
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
  const [qrType, setQrType] = useState("url");
  const [qrValue, setQrValue] = useState("https://example.com");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [fgColor, setFgColor] = useState("#000000");
  const [qrImage, setQrImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("color");
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [fgColorMode, setFgColorMode] = useState("solid"); // "solid" or "effect"
  const [fgEffect, setFgEffect] = useState("none");
  const [bgColorMode, setBgColorMode] = useState("solid"); // "none", "solid", or "effect"
  const [bgEffect, setBgEffect] = useState("none");
  const [pdfFile, setPdfFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pdfInputMode, setPdfInputMode] = useState("file"); // "file" or "url"
  const [dotsType, setDotsType] = useState("square"); // QR dots shape
  const [cornersType, setCornersType] = useState("square"); // QR corners shape
  const [logoUrl, setLogoUrl] = useState(""); // Logo/image URL for QR center

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

  // Background effects
  const bgEffects = [
    { id: "none", name: "Solid" },
    { id: "sunset-silk", name: "Sunset Silk" },
    { id: "warm-terracotta", name: "Warm Terracotta" },
    { id: "classic-peach", name: "Classic Peach" },
    { id: "golden-hour", name: "Golden Hour" },
    { id: "soft-rose", name: "Soft Rose" },
    { id: "desert-sand", name: "Desert Sand" },
    { id: "ocean-breeze", name: "Ocean Breeze" },
    { id: "purple-dream", name: "Purple Dream" },
    { id: "mint-fresh", name: "Mint Fresh" },
    { id: "coral-reef", name: "Coral Reef" },
    { id: "lavender-mist", name: "Lavender Mist" },
  ];

  // Get gradient background for effect button
  const getEffectBackground = (effectId) => {
    const gradients = {
      none: "#ffffff",
      "sunset-silk": "linear-gradient(135deg, #FF512F 0%, #DD2476 100%)",
      "warm-terracotta": "linear-gradient(135deg, #e5976e 0%, #7f4122 100%)",
      "classic-peach": "linear-gradient(135deg, #FF9A8B 0%, #FF6A88 100%)",
      "golden-hour": "linear-gradient(135deg, #F2994A 0%, #F2C94C 100%)",
      "soft-rose": "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "desert-sand": "linear-gradient(135deg, #cc947c 0%, #8b5a44 100%)",
      "ocean-breeze": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "purple-dream": "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      "mint-fresh": "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
      "coral-reef": "linear-gradient(135deg, #ff9a56 0%, #ff6a95 100%)",
      "lavender-mist": "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
    };
    return gradients[effectId] || "#ffffff";
  };

  // Shape options for QR customization - All supported by qr-code-styling
  const bodyShapes = [
    { id: "square", name: "Square" },
    { id: "dots", name: "Dots" },
    { id: "rounded", name: "Rounded" },
    { id: "extra-rounded", name: "Extra Rounded" },
    { id: "classy", name: "Classy" },
    { id: "classy-rounded", name: "Classy Rounded" },
  ];

  const cornerShapes = [
    { id: "square", name: "Square" },
    { id: "dot", name: "Dot" },
    { id: "rounded", name: "Rounded" },
    { id: "extra-rounded", name: "Extra Rounded" },
    { id: "classy", name: "Classy" },
    { id: "classy-rounded", name: "Classy Rounded" },
    { id: "dots", name: "Dots" },
  ];

  // Preset colors for quick selection
  const presetColors = [
    { name: "Black", hex: "#000000" },
    { name: "Navy", hex: "#001f3f" },
    { name: "Teal", hex: "#0a9396" },
    { name: "Green", hex: "#00a651" },
    { name: "Purple", hex: "#7c3aed" },
    { name: "Red", hex: "#dc2626" },
    { name: "Gray", hex: "#6b7280" },
    { name: "Orange", hex: "#f97316" },
    { name: "Blue", hex: "#3b82f6" },
    { name: "Cyan", hex: "#06b6d4" },
    { name: "Pink", hex: "#ec4899" },
  ];

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
    pdf: "",
    whatsapp: { phone: "+972", message: "" },
    email: { email: "", subject: "", message: "" },
    phone: "+972",
    sms: { phone: "+972", message: "" },
    wifi: { ssid: "Network", password: "", security: "WPA" },
    contact: { name: "", phone: "+972", email: "" },
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
    console.log("QR Type changed from", qrType, "to", newType);
    setQrType(newType);
    const newValue = buildQRValue(newType, qrInputs);
    console.log("New QR value after type change:", newValue);
    setQrValue(newValue);
  };

  const handleInputChange = (path, value) => {
    console.log("Input changed - Path:", path, "Value:", value);
    const newInputs = JSON.parse(JSON.stringify(qrInputs));
    const keys = path.split(".");
    let obj = newInputs;
    for (let i = 0; i < keys.length - 1; i++) {
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
    setQrInputs(newInputs);
    const newValue = buildQRValue(qrType, newInputs);
    console.log("New QR value after input change:", newValue);
    setQrValue(newValue);
  };

  const handlePdfDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    console.log("PDF dropped:", file?.name, "Type:", file?.type);
    if (file && file.type === "application/pdf") {
      console.log(
        "Valid PDF file. Setting pdfFile state. Size:",
        file.size,
        "bytes",
      );
      setPdfFile(file);
      console.log(
        "NOTE: qrInputs.pdf remains empty until user switches to URL mode",
      );
    } else {
      console.log("INVALID: File is not a PDF or no file dropped");
    }
  };

  const handlePdfDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handlePdfDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handlePdfFileSelect = (e) => {
    const file = e.target.files[0];
    console.log("PDF file selected:", file?.name, "Type:", file?.type);
    if (file && file.type === "application/pdf") {
      console.log(
        "Valid PDF file. Setting pdfFile state. Size:",
        file.size,
        "bytes",
      );
      setPdfFile(file);
      console.log(
        "NOTE: qrInputs.pdf remains empty until user switches to URL mode",
      );
    } else {
      console.log("INVALID: File is not a PDF or no file selected");
    }
  };

  const generateQR = async (text, fg, bg) => {
    console.log("=== START QR GENERATION ===");
    console.log("Input parameters:", {
      text: text,
      textLength: text?.length,
      fgColor: fg,
      bgColor: bg,
      bgColorMode: bgColorMode,
      bgEffect: bgEffect,
      qrType: qrType,
      dotsType: dotsType,
      cornersType: cornersType,
    });

    if (!text.trim()) {
      console.log("SKIP REASON: Text is empty or whitespace only");
      setQrImage("");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const bgForAPI =
        bgColorMode === "effect" || bgColorMode === "none" ? "transparent" : bg;

      console.log("Preparing API request...");
      console.log("Background color for API:", bgForAPI);
      console.log("Dots type:", dotsType);
      console.log("Corners type:", cornersType);
      console.log("API endpoint: http://localhost:5000/api/generate-qr");

      const requestBody = {
        text,
        color: fg,
        bgColor: bgForAPI,
        dotsType: dotsType,
        cornersType: cornersType,
      };
      if (logoUrl) {
        requestBody.image = logoUrl;
      }
      console.log("Request body:", JSON.stringify(requestBody));

      const response = await fetch("http://localhost:5000/api/generate-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      console.log("Response received. Status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log("ERROR: Response not OK. Status:", response.status);
        console.log("Error details:", errorText);
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("SUCCESS: QR code generated");
      console.log("Image data length:", data.qrImage?.length || 0);
      setQrImage(data.qrImage);
      console.log("=== END QR GENERATION (SUCCESS) ===");
    } catch (err) {
      console.log("=== QR GENERATION FAILED ===");
      console.log("Error type:", err.name);
      console.log("Error message:", err.message);
      console.log("Full error:", err);
      setError("Failed to generate QR code");
      setQrImage("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("--- useEffect TRIGGERED ---");
    console.log("Current state:", {
      qrType: qrType,
      pdfInputMode: pdfInputMode,
      pdfHasUrl: !!qrInputs.pdf,
      qrValue: qrValue,
      qrValueLength: qrValue?.length,
    });

    const timeoutId = setTimeout(() => {
      console.log("Timeout expired (400ms). Checking if should generate QR...");

      // Don't generate QR if we're in PDF file mode without a URL
      if (qrType === "pdf" && pdfInputMode === "file" && !qrInputs.pdf) {
        console.log("SKIP: PDF in file mode without URL");
        console.log(
          "Details: qrType=" +
            qrType +
            ", pdfInputMode=" +
            pdfInputMode +
            ", pdf url empty=" +
            !qrInputs.pdf,
        );
        setQrImage("");
        return;
      }

      console.log("Proceeding to generate QR...");
      generateQR(qrValue, fgColor, bgColor);
    }, 400);

    return () => {
      console.log("useEffect cleanup - clearing timeout");
      clearTimeout(timeoutId);
    };
  }, [
    qrValue,
    fgColor,
    bgColor,
    bgColorMode,
    bgEffect,
    qrType,
    pdfInputMode,
    qrInputs.pdf,
    dotsType,
    cornersType,
  ]);

  // Initial QR generation on mount
  useEffect(() => {
    console.log("=== COMPONENT MOUNTED ===");
    console.log("Initial values:", {
      qrValue: qrValue,
      fgColor: fgColor,
      bgColor: bgColor,
      qrType: qrType,
    });
    console.log("Generating initial QR code...");
    generateQR(qrValue, fgColor, bgColor);
  }, []);

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
                          className={`pdf-drop-zone ${isDragging ? "dragging" : ""} ${pdfFile ? "has-file" : ""}`}
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
                          <div className="drop-zone-content">
                            {pdfFile ? (
                              <>
                                <FiFileText size={40} className="mb-2" />
                                <h5 className="mb-1">{pdfFile.name}</h5>
                                <p className="text-muted mb-0">
                                  {(pdfFile.size / 1024).toFixed(2)} KB
                                </p>
                                <small className="text-muted">
                                  לחץ לבחירת קובץ אחר
                                </small>
                              </>
                            ) : (
                              <>
                                <FiFileText size={48} className="mb-3" />
                                <h5 className="mb-2">גרור קובץ PDF לכאן</h5>
                                <p className="text-muted mb-0">
                                  או לחץ לבחירת קובץ
                                </p>
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
                    <label className="form-label fw-semibold">LOGO URL</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://example.com/logo.png"
                      value={logoUrl}
                      onChange={(e) => {
                        console.log("Logo URL changed to:", e.target.value);
                        setLogoUrl(e.target.value);
                      }}
                    />
                    <small className="text-muted">
                      Enter the URL of a PNG or JPG image to place in the center
                      of the QR code. Recommended size: 100x100px to 200x200px
                    </small>
                    {logoUrl && (
                      <div className="alert alert-info d-flex flex-column gap-2">
                        <span className="fw-semibold">Preview:</span>
                        <img
                          src={logoUrl}
                          alt="Logo preview"
                          style={{
                            maxWidth: "150px",
                            maxHeight: "150px",
                            borderRadius: "8px",
                          }}
                          onError={(e) => {
                            console.error("Logo image failed to load");
                            e.target.style.display = "none";
                          }}
                        />
                      </div>
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
    </div>
  );
}

export default QrPage;
