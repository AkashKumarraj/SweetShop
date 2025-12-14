import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { isLoggedIn, role, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to={isLoggedIn ? "/dashboard" : "/"}>SweetShop</Link>
        </div>
        
        <div className="navbar-menu">
      {!isLoggedIn && (
        <>
              <Link to="/" className="navbar-link">Login</Link>
              <Link to="/register" className="navbar-link navbar-link-primary">Register</Link>
        </>
      )}

      {isLoggedIn && (
        <>
              <Link to="/dashboard" className="navbar-link">Dashboard</Link>

          {role === "ADMIN" && (
                <Link to="/admin" className="navbar-link">Admin</Link>
          )}

              <button onClick={handleLogout} className="navbar-button">Logout</button>
        </>
      )}
    </div>
      </div>
    </nav>
  );
}

export default Navbar;
