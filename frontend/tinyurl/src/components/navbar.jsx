import { Link, useNavigate } from "react-router-dom";
import "./component.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, {
        method: "GET",
        credentials: "include",
      });

      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="nav-bar">
      <Link to="/">
        <h3>TinyLink</h3>
      </Link>
      <ul className="nav-items">
        <li className="nav-item">
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/links" className="nav-link">
            Links
          </Link>
        </li>
      </ul>
      <button type="button" onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
