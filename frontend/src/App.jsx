import { useEffect, useState } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import QrPage from "./pages/QrPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LearnQrPage from "./pages/LearnQrPage";
import ContactPage from "./pages/ContactPage";
import PrivacyTermsPage from "./pages/PrivacyTermsPage";
import MainNavbar from "./components/MainNavbar";
import SiteFooter from "./components/SiteFooter";
import AccessibilityButton from "./components/AccessibilityButton";
import BackToTopButton from "./components/BackToTopButton";

function ProtectedLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/me", {
          credentials: "include",
        });

        if (isMounted) {
          setIsAuthenticated(response.ok);
        }
      } catch {
        if (isMounted) {
          setIsAuthenticated(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isAuthenticated === null) {
    return <div className="container py-5 text-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function App() {
  return (
    <>
      <MainNavbar />
      <AccessibilityButton />
      <BackToTopButton />
      <Routes>
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<QrPage />} />
          <Route path="/learn-qr" element={<LearnQrPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy-terms" element={<PrivacyTermsPage />} />
      </Routes>
      <SiteFooter />
    </>
  );
}

export default App;
