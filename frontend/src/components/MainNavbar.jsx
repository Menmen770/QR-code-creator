import { Link } from "react-router-dom";
import logo from "../assets/logo-full.png";

function MainNavbar() {
  return (
    <header className="navbar navbar-expand-lg bg-white border-bottom sticky-top shadow-sm">
      <div className="container py-2">
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
  );
}

export default MainNavbar;
