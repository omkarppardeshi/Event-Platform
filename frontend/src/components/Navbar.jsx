import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>🎯 EventPlatform</div>
      <div style={styles.links}>
        {user ? (
          <>
            {user.role === "admin" ? (
              <>
                <Link to="/admin" style={styles.link}>Admin Panel</Link>
                <Link to="/checkin" style={styles.link}>Check-In</Link>
              </>
            ) : (
              <Link to="/events" style={styles.link}>Events</Link>
            )}
            <span style={styles.username}>👤 {user.name}</span>
            <button onClick={handleLogout} style={styles.btn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/signup" style={styles.link}>Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 24px",
    backgroundColor: "#1a1a2e",
    color: "white",
  },
  brand: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#e94560",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "14px",
  },
  username: {
    fontSize: "14px",
    color: "#a8a8b3",
  },
  btn: {
    padding: "6px 14px",
    backgroundColor: "#e94560",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Navbar;