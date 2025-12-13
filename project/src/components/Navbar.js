import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { isLoggedIn, role, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div style={{ padding: "10px", background: "#eee" }}>
      {!isLoggedIn && (
        <>
          <Link to="/" style={{ marginRight: "10px" }}>Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}

      {isLoggedIn && (
        <>
          <Link to="/dashboard" style={{ marginRight: "10px" }}>Dashboard</Link>

          {role === "ADMIN" && (
            <Link to="/admin" style={{ marginRight: "10px" }}>Admin</Link>
          )}

          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </div>
  );
}

export default Navbar;
