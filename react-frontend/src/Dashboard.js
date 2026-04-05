import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [passwords, setPasswords] = useState([]);
  const [websiteName, setWebsiteName] = useState("");
  const [websiteUsername, setWebsiteUsername] = useState("");
  const [encryptedPassword, setEncryptedPassword] = useState("");
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchPasswords();
  }, []);

  const fetchPasswords = async () => {
    try {
      const res = await axios.get("http://localhost:8080/passwords/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPasswords(res.data);
    } catch (err) {
      navigate("/login");
    }
  };

  const addPassword = async () => {
    try {
      await axios.post("http://localhost:8080/passwords/add",
        { websiteName, websiteUsername, encryptedPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWebsiteName("");
      setWebsiteUsername("");
      setEncryptedPassword("");
      setShowForm(false);
      fetchPasswords();
    } catch (err) {
      alert("Failed to add password!");
    }
  };

  const deletePassword = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/passwords/delete/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPasswords();
    } catch (err) {
      alert("Failed to delete!");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🔐 Password Manager</h1>
        <div>
          <span style={styles.welcome}>Welcome, {username}!</span>
          <button style={styles.logoutBtn} onClick={logout}>Logout</button>
        </div>
      </div>

      <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "+ Add Password"}
      </button>

      {showForm && (
        <div style={styles.form}>
          <input style={styles.input} placeholder="Website Name" value={websiteName} onChange={(e) => setWebsiteName(e.target.value)} />
          <input style={styles.input} placeholder="Username/Email" value={websiteUsername} onChange={(e) => setWebsiteUsername(e.target.value)} />
          <input style={styles.input} placeholder="Password" type="password" value={encryptedPassword} onChange={(e) => setEncryptedPassword(e.target.value)} />
          <button style={styles.saveBtn} onClick={addPassword}>Save Password</button>
        </div>
      )}

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Website</th>
            <th style={styles.th}>Username</th>
            <th style={styles.th}>Password</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {passwords.map((p) => (
            <tr key={p.id} style={styles.tr}>
              <td style={styles.td}>{p.websiteName}</td>
              <td style={styles.td}>{p.websiteUsername}</td>
              <td style={styles.td}>••••••••</td>
              <td style={styles.td}>
                <button style={styles.deleteBtn} onClick={() => deletePassword(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {passwords.length === 0 && (
        <p style={{ color: "#888", textAlign: "center", marginTop: "40px" }}>No passwords saved yet!</p>
      )}
    </div>
  );
}

const styles = {
  container: { backgroundColor: "#0a0a0a", minHeight: "100vh", padding: "20px", fontFamily: "monospace" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  title: { color: "#00ff88" },
  welcome: { color: "#888", marginRight: "15px" },
  logoutBtn: { backgroundColor: "#ff4444", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" },
  addBtn: { backgroundColor: "#00ff88", color: "#000", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", marginBottom: "20px" },
  form: { backgroundColor: "#1a1a1a", padding: "20px", borderRadius: "12px", marginBottom: "20px", border: "1px solid #333" },
  input: { width: "100%", padding: "10px", marginBottom: "10px", backgroundColor: "#0a0a0a", border: "1px solid #333", borderRadius: "6px", color: "#fff", boxSizing: "border-box" },
  saveBtn: { backgroundColor: "#00ff88", color: "#000", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { color: "#00ff88", padding: "12px", textAlign: "left", borderBottom: "1px solid #333", backgroundColor: "#1a1a1a" },
  tr: { borderBottom: "1px solid #222" },
  td: { color: "#fff", padding: "12px" },
  deleteBtn: { backgroundColor: "#ff4444", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }
};

export default Dashboard;