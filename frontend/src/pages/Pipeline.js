import React, { useEffect, useState } from "react";
import api from "../api";

export default function Pipeline() {
  const [leads, setLeads] = useState([]);
  const [dragging, setDragging] = useState(null);

  useEffect(() => { api.get("leads/").then(res => setLeads(res.data)).catch(()=>{}); }, []);

  const columns = [
    { key:"new",       label:"Inquiry",      color:"#3b82f6", icon:"🏔️" },
    { key:"contacted", label:"Briefing",     color:"#fbbf24", icon:"📞" },
    { key:"converted", label:"On Trek",      color:"#22c55e", icon:"🥾" },
    { key:"lost",      label:"Cancelled",    color:"#ef4444", icon:"❌" },
  ];

  const grouped = columns.reduce((a, col) => ({ ...a, [col.key]: leads.filter(l => l.status === col.key) }), {});

  const onDragStart = (lead) => setDragging(lead);
  const onDrop = async (status) => {
    if (!dragging || dragging.status === status) return;
    await api.patch(`leads/${dragging.id}/`, { status });
    setLeads(prev => prev.map(l => l.id === dragging.id ? { ...l, status } : l));
    setDragging(null);
  };

  return (
    <div style={{ animation: "fadeIn 0.5s ease-out" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#f97316", textTransform: "uppercase", letterSpacing: "2px", marginBottom: 4 }}>Trekker Journey</div>
        <h1 style={{ fontSize: 26, fontWeight: 900 }}>Trekker <span style={{ color: "#f97316" }}>Pipeline</span></h1>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>Drag cards to update trekker expedition status</p>
      </div>

      {/* Summary Bar */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {columns.map(col => (
          <div key={col.key} style={{
            flex: 1, padding: "14px 16px", borderRadius: 10,
            background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)",
            borderLeft: `3px solid ${col.color}`,
          }}>
            <div style={{ fontSize: 12, color: col.color, fontWeight: 600, marginBottom: 6 }}>{col.icon} {col.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{grouped[col.key]?.length || 0}</div>
          </div>
        ))}
      </div>

      {/* Kanban Board */}
      <div className="kanban-board">
        {columns.map(col => (
          <div key={col.key} className="kanban-col"
            style={{ borderTop: `3px solid ${col.color}` }}
            onDragOver={e => e.preventDefault()}
            onDrop={() => onDrop(col.key)}
          >
            <div className="kanban-col-header">
              <span className="kanban-col-title" style={{ color: col.color }}>{col.label}</span>
              <span className="kanban-count">{grouped[col.key]?.length || 0}</span>
            </div>

            {grouped[col.key]?.length === 0 ? (
              <div style={{ textAlign: "center", padding: "24px 0", color: "var(--text-muted)", fontSize: 12, borderRadius: 8, border: "2px dashed var(--border)" }}>
                Drop guests here
              </div>
            ) : (
              grouped[col.key].map(lead => (
                <div key={lead.id} className="kanban-card"
                  draggable
                  onDragStart={() => onDragStart(lead)}
                  style={{ opacity: dragging?.id === lead.id ? 0.5 : 1 }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 6,
                        background: "linear-gradient(135deg, #f97316, #ea580c)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 800, color: "#fff",
                      }}>{(lead.name || "P").charAt(0)}</div>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{lead.name || "Unknown"}</span>
                    </div>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: col.color, marginTop: 4 }} />
                  </div>
                  {lead.email && <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 3 }}>📧 {lead.email}</div>}
                  {lead.phone && <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>📞 {lead.phone}</div>}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ fontSize: 10, color: "var(--text-muted)" }}>Score:</span>
                      <span style={{ fontSize: 12, fontWeight: 800, color: lead.score > 70 ? "#22c55e" : lead.score > 40 ? "#fbbf24" : "var(--text-muted)" }}>{lead.score}%</span>
                    </div>
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{lead.activities?.length || 0} events</span>
                  </div>
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}