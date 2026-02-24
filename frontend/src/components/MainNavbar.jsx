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

const RECENT_QR_KEY = "qrMasterRecentHistory";

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
  const [profileForm, setProfileForm] = useState({ firstName: "", phone: "" });
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
        const response = await fetch("http://localhost:5000/api/auth/me", {
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
              phone: currentUser?.phone || "",
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
    const loadRecentQrs = () => {
      try {
        const parsed = JSON.parse(localStorage.getItem(RECENT_QR_KEY) || "[]");
        setRecentQrs(Array.isArray(parsed) ? parsed.slice(0, 5) : []);
      } catch {
        setRecentQrs([]);
      }
    };

    if (isMenuOpen) {
      loadRecentQrs();
    }

    const handleRecentUpdate = () => loadRecentQrs();

    window.addEventListener("qr-recent-updated", handleRecentUpdate);
    window.addEventListener("storage", handleRecentUpdate);

    return () => {
      window.removeEventListener("qr-recent-updated", handleRecentUpdate);
      window.removeEventListener("storage", handleRecentUpdate);
    };
  }, [isMenuOpen]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
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
      const response = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          fullName: profileForm.firstName,
          phone: profileForm.phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "שמירה נכשלה");
      }

      setUser(data.user);
      setProfileForm({
        firstName: getFirstName(data.user.fullName),
        phone: data.user.phone || "",
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

                      <label className="form-label mb-1">טלפון</label>
                      <input
                        className="form-control form-control-sm mb-2"
                        value={profileForm.phone}
                        onChange={(e) =>
                          setProfileForm((prev) => ({
                            ...prev,
                            phone: e.target.value,
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
                      QR שמורים
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
                              <span className="recent-type">{item.type}</span>
                              <span className="recent-value" title={item.value}>
                                {item.value}
                              </span>
                              <span className="recent-time">
                                {formatTime(item.createdAt)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="navbar-empty-text mb-0">
                          עדיין אין QR שמורים
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
              Login
            </Link>
            <Link className="btn btn-teal btn-sm" to="/register">
              Sign Up
            </Link>
          </div>
        )}

        <button
          className="navbar-brand d-flex align-items-center"
          onClick={() => (window.location.href = "/")}
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            padding: 0,
          }}
          title="Back to home"
        >
          <img src={logo} alt="QR Master" className="brand-logo" />
        </button>
      </div>
    </header>
  );
}

export default MainNavbar;
