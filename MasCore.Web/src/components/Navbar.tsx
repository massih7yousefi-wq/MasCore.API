import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MasCoreLogo from "./MasCoreLogo";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link
        to="/"
        className="navbar-brand"
        aria-label="MasCore Home"
      >
        <MasCoreLogo compact />
      </Link>

      <div className="navbar-links">
        <Link to="/">Home</Link>

        <Link to="/contact">Contact</Link>

        {isAuthenticated ? (
          <>
            <Link to="/dashboard">Dashboard</Link>

            <button
              type="button"
              onClick={logout}
              className="navbar-logout"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}