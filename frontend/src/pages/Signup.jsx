import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/signup", { name, email, password, role });
      login(res.data.token, res.data.user);
      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/events");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>🎯 EventPlatform</h2>
        <h3 style={styles.subtitle}>Create Account</h3>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select
            style={styles.input}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Signup"}
          </button>
        </form>
        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>Login</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#0f0f1a",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    backgroundColor: "#16213e",
    padding: "40px",
    borderRadius: "8px",
    width: "100%",
    maxWidth: "400px",
    border: "1px solid #0f3460",
  },
  title: {
    color: "#e94560",
    textAlign: "center",
    margin: "0 0 8px",
  },
  subtitle: {
    color: "white",
    textAlign: "center",
    margin: "0 0 24px",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    marginBottom: "16px",
    backgroundColor: "#0f0f1a",
    border: "1px solid #0f3460",
    borderRadius: "4px",
    color: "white",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  btn: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#e94560",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
  },
  error: {
    color: "#e74c3c",
    marginBottom: "16px",
    fontSize: "14px",
  },
  footer: {
    color: "#a8a8b3",
    textAlign: "center",
    marginTop: "16px",
    fontSize: "14px",
  },
  link: {
    color: "#e94560",
  },
};

export default Signup;