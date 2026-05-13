import React, { useState, useEffect } from "react";
import api from "../api";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [leads, setLeads] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "", description: "", due_date: "",
    priority: "medium", status: "pending", lead: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchTasks(); fetchLeads(); }, []);
  const fetchTasks = async () => { try { const res = await api.get("tasks/tasks/"); setTasks(res.data); } catch {} };
  const fetchLeads = async () => { try { const res = await api.get("leads/"); setLeads(res.data); } catch {} };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editTask) await api.patch(`tasks/tasks/${editTask.id}/`, formData);
      else await api.post("tasks/tasks/", formData);
      setShowModal(false); setEditTask(null);
      setFormData({ title: "", description: "", due_date: "", priority: "medium", status: "pending", lead: "" });
      fetchTasks();
    } catch { alert("Failed to save."); }
    finally { setLoading(false); }
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setFormData({ title: task.title, description: task.description, due_date: task.due_date.slice(0, 16), priority: task.priority, status: task.status, lead: task.lead || "" });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this task?")) {
      await api.delete(`tasks/tasks/${id}/`);
      fetchTasks();
    }
  };

  const priorityColors = { high: "#ef4444", medium: "#fbbf24", low: "#22c55e" };
  const statusColors = { pending: "#fbbf24", completed: "#22c55e", overdue: "#ef4444" };

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === "pending").length,
    completed: tasks.filter(t => t.status === "completed").length,
    overdue: tasks.filter(t => t.status === "overdue").length,
  };

  return (
    <div style={{ animation: "fadeIn 0.5s ease-out" }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#f97316", textTransform: "uppercase", letterSpacing: "2px", marginBottom: 4 }}>Operations</div>
          <h1 style={{ fontSize: 26, fontWeight: 900 }}>Task <span style={{ color: "#f97316" }}>Manager</span></h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>Track follow-ups and team actions</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowModal(true); setEditTask(null); setFormData({ title: "", description: "", due_date: "", priority: "medium", status: "pending", lead: "" }); }}>
          + New Task
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total", val: stats.total, color: "#f97316" },
          { label: "Pending", val: stats.pending, color: "#fbbf24" },
          { label: "Completed", val: stats.completed, color: "#22c55e" },
          { label: "Overdue", val: stats.overdue, color: "#ef4444" },
        ].map((s, i) => (
          <div key={i} style={{
            padding: "16px", borderRadius: 10,
            background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)",
            borderLeft: `3px solid ${s.color}`,
          }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Task List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {tasks.length === 0 ? (
          <div className="glass-card" style={{ padding: 60, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.3 }}>✅</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>No Tasks</div>
            <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Create a task to get started</p>
          </div>
        ) : tasks.map(t => (
          <div key={t.id} className="glass-card" style={{
            padding: "16px 20px", display: "flex", alignItems: "center",
            justifyContent: "space-between", gap: 16,
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(249,115,22,0.2)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0 }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: priorityColors[t.priority] || "#666", flexShrink: 0,
              }} />
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontSize: 14, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.title}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                  {t.lead_name ? `Guest: ${t.lead_name}` : "No guest linked"} · Due: {new Date(t.due_date).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 4,
                textTransform: "uppercase",
                background: `${priorityColors[t.priority]}15`,
                color: priorityColors[t.priority],
              }}>{t.priority}</span>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 4,
                textTransform: "uppercase",
                background: `${statusColors[t.status] || "#666"}15`,
                color: statusColors[t.status] || "#666",
              }}>{t.status}</span>
              <button onClick={() => handleEdit(t)} style={{
                padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)",
                color: "#fff", cursor: "pointer", transition: "0.3s",
              }}>Edit</button>
              <button onClick={() => handleDelete(t.id)} style={{
                padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)",
                color: "#ef4444", cursor: "pointer", transition: "0.3s",
              }}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2 className="modal-title">{editTask ? "Edit Task" : "New Task"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input className="form-control" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Guest (Optional)</label>
                <select className="form-control" value={formData.lead} onChange={e => setFormData({ ...formData, lead: e.target.value })}>
                  <option value="">Select a guest</option>
                  {leads.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input className="form-control" type="datetime-local" required value={formData.due_date} onChange={e => setFormData({ ...formData, due_date: e.target.value })} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
                <div>
                  <label className="form-label">Priority</label>
                  <select className="form-control" value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Status</label>
                  <select className="form-control" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>{loading ? "Saving..." : "Save"}</button>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
