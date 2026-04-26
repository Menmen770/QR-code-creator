import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiLogOut,
  FiSave,
  FiUser,
} from "react-icons/fi";
import logo from "../assets/logo-full.png";
import { API_BASE } from "../config";
import { loadRecentQrItems } from "../utils/recentQrStorage";

const getGreetingByHour = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "בוקר טוב";
  if (hour >= 12 && hour < 17) return "צהריים טובים";
  if (hour >= 17 && hour < 21) return "ערב טוב";
  return "לילה טוב";
};

const formatTime = (value) => {
  try {
    return new Date(value).toLocaleString("he-IL", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

const getFirstName = (fullName) => {
  const normalized = String(fullName || "").trim();
  if (!normalized) return "";
  return normalized.split(/\s+/)[0] || "";
};

function MainNavbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({ firstName: "" });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [recentQrs, setRecentQrs] = useState([]);
  const [expandedPanel, setExpandedPanel] = useState(null);
  const menuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/auth/me`, {
          credentials: "include",
        });

        if (mounted) {
          setIsAuthenticated(response.ok);
          if (response.ok) {
            const data = await response.json();
            const currentUser = data?.user || null;
            setUser(currentUser);
            setProfileForm({
              firstName: getFirstName(currentUser?.fullName),
            });
          } else {
            setUser(null);
          }
        }
      } catch {
        if (mounted) {
          setIsAuthenticated(false);
          setUser(null);
        }
      } finally {
        if (mounted) {
          setCheckingAuth(false);
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [location.pathname]);

  useEffect(() => {
    const handleOutside = (event) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
        setExpandedPanel(null);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    const loadRecentQrs = async () => {
      if (!isAuthenticated) {
        const parsed = loadRecentQrItems();
        const list = Array.isArray(parsed) ? parsed.slice(0, 5) : [];
        setRecentQrs(
          list.map((r) => ({
            id: r.id,
            value: r.value,
            createdAt: r.createdAt,
            fullPayload:
              r.fullPayload ||
              (r.type === "url"
                ? {
                    qrType: "url",
                    qrValue: r.value || "",
                    qrInputs: { url: r.value || "" },
                    style: {},
                  }
                : {
                    qrType: r.type || "url",
                    qrValue: r.value || "",
                    qrInputs: {},
                    style: {},
                  }),
          })),
        );
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/api/saved-qrs?limit=5`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("failed");
        const data = await res.json();
        const rows = Array.isArray(data.items) ? data.items : [];
        setRecentQrs(
          rows.map((row) => ({
            id: row._id,
            value: row.displayName || row.qrValue,
            createdAt: row.createdAt,
            fullPayload: {
              qrType: row.qrType,
              qrValue: row.qrValue,
              displayName: row.displayName || "",
              qrInputs: row.qrInputs || {},
              style: row.style || {},
            },
          })),
        );
      } catch {
        setRecentQrs([]);
      }
    };

    if (isMenuOpen) {
      loadRecentQrs();
    }

    const handleServerUpdate = () => {
      if (isAuthenticated && isMenuOpen) loadRecentQrs();
    };
    const handleLocalUpdate = () => {
      if (!isAuthenticated) loadRecentQrs();
    };

    window.addEventListener("qr-saved-updated", handleServerUpdate);
    window.addEventListener("qr-recent-updated", handleLocalUpdate);
    window.addEventListener("storage", handleLocalUpdate);

    return () => {
      window.removeEventListener("qr-saved-updated", handleServerUpdate);
      window.removeEventListener("qr-recent-updated", handleLocalUpdate);
      window.removeEventListener("storage", handleLocalUpdate);
    };
  }, [isMenuOpen, isAuthenticated]);

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      setIsMenuOpen(false);
      setExpandedPanel(null);
      navigate("/login", { replace: true });
    }
  };

  const handleProfileSave = async () => {
    setProfileMessage("");
    setIsSavingProfile(true);

    try {
      const response = await fetch(`${API_BASE}/api/auth/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          fullName: profileForm.firstName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "שמירה נכשלה");
      }

      setUser(data.user);
      setProfileForm({
        firstName: getFirstName(data.user.fullName),
      });
      setProfileMessage("הפרטים נשמרו בהצלחה");
    } catch (error) {
      setProfileMessage(error.message || "שמירה נכשלה");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const firstName = getFirstName(user?.fullName) || "User";
  const userInitial = firstName
    ? firstName.trim().charAt(0).toUpperCase()
    : "U";
  const greeting = getGreetingByHour();

  const togglePanel = (panelName) => {
    setProfileMessage("");
    setExpandedPanel((prev) => (prev === panelName ? null : panelName));
  };

  const handleSavedQrClick = (item) => {
    if (!item?.fullPayload) return;
    navigate("/create", { state: { loadSavedQr: item.fullPayload } });
    setIsMenuOpen(false);
    setExpandedPanel(null);
  };

  return (
    <header className="navbar navbar-expand-lg bg-white border-bottom sticky-top shadow-sm">
      <div className="container py-2">
        {checkingAuth ? null : isAuthenticated ? (
          <div className="navbar-user-area" ref={menuRef}>
            <button
              className="navbar-user-trigger"
              title={firstName}
              onClick={() => {
                setIsMenuOpen((prev) => {
                  const next = !prev;
                  if (!next) {
                    setExpandedPanel(null);
                    setProfileMessage("");
                  }
                  return next;
                });
              }}
            >
              <span className="navbar-user-avatar">{userInitial}</span>
              <span className="navbar-user-text">
                <span className="navbar-user-greeting">{greeting}</span>
                <span className="navbar-user-name">{firstName}</span>
              </span>
            </button>

            {isMenuOpen && (
              <div className="navbar-user-menu card shadow-sm" dir="rtl">
                <div className="navbar-menu-section">
                  <button
                    type="button"
                    className="navbar-expand-btn"
                    onClick={() => togglePanel("profile")}
                  >
                    <span>
                      <FiUser className="me-2" />
                      עדכון פרטים
                    </span>
                    {expandedPanel === "profile" ? (
                      <FiChevronUp />
                    ) : (
                      <FiChevronDown />
                    )}
                  </button>

                  {expandedPanel === "profile" && (
                    <div className="navbar-panel-content mt-2">
                      <label className="form-label mb-1">שם פרטי</label>
                      <input
                        className="form-control form-control-sm mb-2"
                        value={profileForm.firstName}
                        onChange={(e) =>
                          setProfileForm((prev) => ({
                            ...prev,
                            firstName: e.target.value,
                          }))
                        }
                      />

                      <label className="form-label mb-1">אימייל</label>
                      <input
                        className="form-control form-control-sm mb-2"
                        value={user?.email || ""}
                        disabled
                      />

                      <button
                        className="btn btn-teal btn-sm w-100"
                        onClick={handleProfileSave}
                        disabled={isSavingProfile}
                      >
                        <FiSave className="me-1" />
                        {isSavingProfile ? "שומר..." : "שמירת פרטים"}
                      </button>

                      {profileMessage && (
                        <div className="navbar-profile-msg mt-2">
                          {profileMessage}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="navbar-menu-section">
                  <button
                    type="button"
                    className="navbar-expand-btn"
                    onClick={() => togglePanel("recent")}
                  >
                    <span>
                      <FiClock className="me-2" />
                      האוסף שלי
                    </span>
                    {expandedPanel === "recent" ? (
                      <FiChevronUp />
                    ) : (
                      <FiChevronDown />
                    )}
                  </button>

                  {expandedPanel === "recent" && (
                    <div className="navbar-panel-content mt-2">
                      {recentQrs.length ? (
                        <ul className="navbar-recent-list">
                          {recentQrs.map((item) => (
                            <li key={item.id}>
                              <button
                                type="button"
                                className="navbar-recent-item"
                                onClick={() => handleSavedQrClick(item)}
                                title={item.value}
                              >
                                <span className="recent-value">
                                  {item.value}
                                </span>
                                <span className="recent-time">
                                  {formatTime(item.createdAt)}
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="navbar-empty-text mb-0">
                          עדיין אין פריטים באוסף
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="navbar-menu-actions">
                  <button
                    className="btn btn-logout-clean btn-sm"
                    onClick={handleLogout}
                  >
                    <FiLogOut className="me-1" />
                    התנתקות
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="d-flex gap-2">
            <Link className="btn btn-outline-secondary btn-sm" to="/login">
              התחברות
            </Link>
            <Link className="btn btn-teal btn-sm" to="/register">
              הרשמה
            </Link>
          </div>
        )}

        <button
          className="navbar-brand d-flex align-items-center"
          type="button"
          onClick={() => navigate("/")}
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            padding: 0,
          }}
          title="חזרה לעמוד הבית"
        >
          <img src={logo} alt="QR Master" className="brand-logo" />
        </button>
      </div>
    </header>
  );
}

export default MainNavbar;
