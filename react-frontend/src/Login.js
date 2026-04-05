import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid username or password!");
    }
    setLoading(false);
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logoArea}>
          <div style={s.logo}>🔐</div>
          <h1 style={s.brandName}>VaultX</h1>
          <p style={s.tagline}>Your passwords. Encrypted. Safe. Always.</p>
        </div>
        <h2 style={s.heading}>Welcome back</h2>
        <p style={s.sub}>Sign in to your vault</p>
        {error && <div style={s.error}>{error}</div>}
        <div style={s.field}>
          <label style={s.label}>Username</label>
          <input
            style={s.input}
            placeholder="Enter your username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
          />
        </div>
        <div style={s.field}>
          <label style={s.label}>Password</label>
          <input
            style={s.input}
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
          />
        </div>
        <button style={{...s.btn, opacity: loading ? 0.7 : 1}} onClick={handleLogin}>
          {loading ? "Signing in..." : "Sign In →"}
        </button>
        <p style={s.footer}>
          New to VaultX? <Link to="/register" style={s.link}>Create account</Link>
        </p>
      </div>
    </div>
  );
}

const s = {
  page: { display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", backgroundColor: "#0c0c0e", fontFamily: "'Georgia', serif" },
  card: { width: "100%", maxWidth: "420px", backgroundColor: "#161620", border: "1px solid #2a2a40", borderRadius: "16px", padding: "48px 40px" },
  logoArea: { textAlign: "center", marginBottom: "32px" },
  logo: { fontSize: "40px", marginBottom: "8px" },
  brandName: { color: "#e8d5b7", fontSize: "28px", fontWeight: "700", margin: "0 0 6px", letterSpacing: "-0.5px" },
  tagline: { color: "#555577", fontSize: "13px", margin: 0, fontStyle: "italic" },
  heading: { color: "#e8d5b7", fontSize: "24px", fontWeight: "700", margin: "0 0 6px" },
  sub: { color: "#666688", fontSize: "14px", margin: "0 0 28px", fontStyle: "italic" },
  error: { backgroundColor: "#2a1515", border: "1px solid #ff4444", color: "#ff8888", padding: "12px 16px", borderRadius: "8px", fontSize: "14px", marginBottom: "20px" },
  field: { marginBottom: "20px" },
  label: { display: "block", color: "#8888aa", fontSize: "12px", marginBottom: "8px", letterSpacing: "0.5px", textTransform: "uppercase" },
  input: { width: "100%", padding: "14px 16px", backgroundColor: "#0c0c0e", border: "1px solid #2a2a40", borderRadius: "10px", color: "#e8d5b7", fontSize: "15px", outline: "none", boxSizing: "border-box", fontFamily: "inherit" },
  btn: { width: "100%", padding: "15px", backgroundColor: "#c9a84c", border: "none", borderRadius: "10px", color: "#0c0c0e", fontSize: "16px", fontWeight: "700", cursor: "pointer", marginTop: "8px", fontFamily: "inherit" },
  footer: { color: "#555577", textAlign: "center", marginTop: "24px", fontSize: "14px" },
  link: { color: "#c9a84c", textDecoration: "none" }
};

export default Login;