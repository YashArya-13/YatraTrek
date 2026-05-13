import React, { useState, useEffect } from "react";
import api from "../api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [camps, setCamps] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({ username: "", email: "", role: "sales", password: "", camp: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentRole = localStorage.getItem("role");
  const isAdmin = currentRole === "admin";

  useEffect(() => { 
    fetchUsers(); 
    if (isAdmin) fetchCamps();
  }, [isAdmin]);

  const fetchUsers = async () => {
    try { const res = await api.get("users/"); setUsers(res.data); } catch {}
  };

  const fetchCamps = async () => {
    try { const res = await api.get("hotels/admin/camps/"); setCamps(res.data); } catch {}
  };

  const openAddModal = () => {
    setEditUser(null); setFormData({ username: "", email: "", role: "sales", password: "", camp: "" });
    setError(""); setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditUser(user); setFormData({ username: user.username, email: user.email || "", role: user.role, password: "" });
    setError(""); setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    const payload = { ...formData };
    if (editUser && !payload.password) delete payload.password;
    try {
      if (editUser) await api.patch(`users/${editUser.id}/`, payload);
      else await api.post("users/", payload);
      setShowModal(false); setEditUser(null);
      setFormData({ username: "", email: "", role: "sales", password: "" });
      fetchUsers();
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        const messages = Object.entries(data).map(([f, m]) => `${f}: ${Array.isArray(m) ? m.join(", ") : m}`).join(" | ");
        setError(messages);
      } else { setError("Failed to save."); }
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this staff member?")) return;
    try { await api.delete(`users/${id}/`); fetchUsers(); } catch { alert("Failed."); }
  };

  const roleColors = { admin: "#f97316", manager: "#a855f7", sales: "#3b82f6" };

  return (
    <div style={{ animation: "fadeIn 0.5s ease-out" }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#f97316", textTransform: "uppercase", letterSpacing: "2px", marginBottom: 4 }}>Administration</div>
          <h1 style={{ fontSize: 26, fontWeight: 900 }}>Staff <span style={{ color: "#f97316" }}>Management</span></h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
            {isAdmin ? "Manage staff roles and system access" : "View staff members"}
          </p>
        </div>
        {isAdmin && <button className="btn btn-primary" onClick={openAddModal}>+ Add Staff</button>}
      </div>

      {/* Staff Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
        {users.map(u => (
          <div key={u.id} className="glass-card" style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 10,
                  background: `linear-gradient(135deg, ${roleColors[u.role] || "#666"}, ${roleColors[u.role] || "#666"}88)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, fontWeight: 900, color: "#fff",
                }}>{u.username.charAt(0).toUpperCase()}</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{u.username}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{u.email || "No email"}</div>
                </div>
              </div>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 6,
                textTransform: "uppercase",
                background: `${roleColors[u.role] || "#666"}15`,
                color: roleColors[u.role] || "#aaa",
                marginBottom: 4, display: "inline-block"
              }}>{u.role}</span>
              {u.role === "camp_leader" && u.camp_name && (
                <div style={{ fontSize: 10, color: "#f97316", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px" }}>
                  ⛺ {u.camp_name}
                </div>
              )}
            </div>

            {isAdmin && (
              <div style={{ display: "flex", gap: 8, marginTop: 10, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
                <button onClick={() => openEditModal(u)} style={{
                  flex: 1, padding: "8px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                  background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)",
                  color: "#fff", cursor: "pointer", transition: "0.3s",
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#f97316"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                >Edit</button>
                <button onClick={() => handleDelete(u.id)} style={{
                  padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                  background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)",
                  color: "#ef4444", cursor: "pointer", transition: "0.3s",
                }}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="glass-card" style={{ padding: 60, textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.3 }}>👥</div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>No Staff Members</div>
        </div>
      )}

      {/* Modal */}
      {showModal && isAdmin && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2 className="modal-title">{editUser ? "Edit Staff" : "New Staff Member"}</h2>

            {error && (
              <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "12px", marginBottom: 18, fontSize: 13, color: "#fca5a5" }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input className="form-control" required value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} disabled={!!editUser} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-control" type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-control" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value, camp: e.target.value !== 'camp_leader' ? '' : formData.camp })}>
                  <option value="admin">Administrator</option>
                  <option value="manager">Manager</option>
                  <option value="sales">Staff</option>
                  <option value="camp_leader">Camp Owner</option>
                </select>
              </div>
              
              {formData.role === "camp_leader" && (
                <div className="form-group">
                  <label className="form-label">Assign Camp</label>
                  <select className="form-control" required value={formData.camp || ""} onChange={e => setFormData({ ...formData, camp: e.target.value })}>
                    <option value="" disabled>Select a Camp...</option>
                    {camps.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">
                  Password {editUser && <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(leave blank to keep current)</span>}
                </label>
                <input className="form-control" type="password" placeholder="••••••••" required={!editUser} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                  {loading ? "Saving..." : editUser ? "Update" : "Add Staff"}
                </button>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => { setShowModal(false); setError(""); }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
