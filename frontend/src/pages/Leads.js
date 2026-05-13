import React, { useState, useEffect } from "react";
import api from "../api";

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [showModal, setShowModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", status: "new", notes: "" });
  const [activityData, setActivityData] = useState({ activity_type: "note", description: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchLeads(); }, []);

  useEffect(() => {
    let result = leads.filter(l => 
        (l.name.toLowerCase().includes(search.toLowerCase()) || 
         l.email?.toLowerCase().includes(search.toLowerCase())) &&
        (statusFilter === "all" || l.status === statusFilter)
    );
    setFilteredLeads(result);
  }, [search, statusFilter, leads]);

  const fetchLeads = async () => {
    try {
      const res = await api.get("leads/");
      setLeads(res.data);
      setFilteredLeads(res.data);
    } catch (err) {
      console.error("Failed to fetch", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (selectedLead) {
        await api.patch(`leads/${selectedLead.id}/`, formData);
      } else {
        await api.post("leads/", formData);
      }
      setShowModal(false);
      setSelectedLead(null);
      setFormData({ name: "", email: "", phone: "", status: "new", notes: "" });
      fetchLeads();
    } catch { alert("Failed to save."); }
    finally { setLoading(false); }
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(`leads/${selectedLead.id}/add_activity/`, activityData);
      setShowActivityModal(false);
      setActivityData({ activity_type: "note", description: "" });
      fetchLeads();
    } catch { alert("Failed to add activity."); }
    finally { setLoading(false); }
  };

  const statusColors = {
    new: "badge-warning",
    contacted: "badge-info",
    converted: "badge-success",
    lost: "badge-danger",
  };

  return (
    <div className="animate-fade">
      {/* ── Page Header ── */}
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: "24px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{ width: 32, height: 2, background: "var(--accent-primary)" }} />
            <div className="text-overline" style={{ color: "var(--accent-primary)" }}>Growth Engine</div>
          </div>
          <h1 className="display-2">Lead <span className="text-gradient">Pipeline</span></h1>
          <p className="text-lg" style={{ color: "var(--text-secondary)", marginTop: 8 }}>Convert high-altitude inquiries into confirmed expeditions.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowModal(true); setSelectedLead(null); setFormData({ name: "", email: "", phone: "", status: "new", notes: "" }); }}>
          + Register Prospect
        </button>
      </div>

      {/* ── Filters Bar ── */}
      <div className="glass-card" style={{ padding: "clamp(16px, 3vw, 24px)", marginBottom: 32, display: "flex", gap: 20, alignItems: "center", borderRadius: 24, flexWrap: "wrap" }}>
         <div style={{ flex: "1 1 300px", position: "relative" }}>
           <input className="form-control" placeholder="Filter by name, email or phone..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 44, borderRadius: 16 }} />
           <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 18, opacity: 0.5 }}>🔍</span>
         </div>
         <div className="filter-tabs" style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.03)", padding: 4, borderRadius: 18, border: "1px solid var(--glass-border)", overflowX: "auto", maxWidth: "100%" }}>
            {["all", "new", "contacted", "converted", "lost"].map(s => (
              <button 
                key={s} 
                onClick={() => setStatusFilter(s)} 
                className="btn"
                style={{ 
                  padding: "8px 16px", 
                  fontSize: 10, 
                  fontWeight: 800,
                  background: statusFilter === s ? "var(--accent-primary)" : "transparent",
                  color: statusFilter === s ? "#fff" : "var(--text-secondary)",
                  borderRadius: 14,
                  border: "none",
                  whiteSpace: "nowrap"
                }}
              >
                {s.toUpperCase()}
              </button>
            ))}
         </div>
      </div>

      {/* ── Pipeline View (Desktop Table / Mobile Cards) ── */}
      <div className="pipeline-view animate-fade">
        <div className="desktop-only crm-table-container">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Prospect Name</th><th>Contact Details</th><th>Lifecycle Stage</th><th>Engagement</th><th>Operations</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((l, i) => (
                <tr key={l.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div className="avatar-initial">{(l.name || "P")[0]}</div>
                        <div>
                          <div style={{ fontWeight: 800, color: "#fff", fontSize: 15 }}>{l.name}</div>
                          <div className="text-overline" style={{ opacity: 0.5, letterSpacing: "1px" }}>#LT-{String(l.id).padStart(4,'0')}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: 14, color: "#fff" }}>{l.email}</div>
                      <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{l.phone}</div>
                    </td>
                    <td><span className={`badge ${statusColors[l.status]}`}>{l.status}</span></td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 2 }}>
                          <div style={{ width: `${Math.min((l.activities?.length || 0) * 20, 100)}%`, height: "100%", background: "var(--accent-primary)", borderRadius: 2 }} />
                        </div>
                        <span className="text-xs" style={{ fontWeight: 700, color: "var(--text-muted)" }}>{l.activities?.length || 0}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="btn btn-secondary" style={{ padding: "8px 14px", fontSize: 11 }} onClick={() => { setSelectedLead(l); setFormData(l); setShowModal(true); }}>Edit</button>
                        <button className="btn btn-secondary" style={{ padding: "8px 14px", fontSize: 11 }} onClick={() => { setSelectedLead(l); setShowActivityModal(true); }}>Timeline</button>
                      </div>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mobile-only" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
           {filteredLeads.map((l) => (
             <div key={l.id} className="glass-card" style={{ padding: "20px", borderRadius: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                   <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div className="avatar-initial" style={{ width: 40, height: 40, fontSize: 16 }}>{(l.name || "P")[0]}</div>
                      <div>
                         <div style={{ fontWeight: 800, color: "#fff" }}>{l.name}</div>
                         <div className="text-overline" style={{ opacity: 0.5 }}>#LT-{String(l.id).padStart(4,'0')}</div>
                      </div>
                   </div>
                   <span className={`badge ${statusColors[l.status]}`}>{l.status}</span>
                </div>
                <div style={{ marginBottom: "16px" }}>
                   <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>{l.email}</div>
                   <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>{l.phone}</div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                   <button className="btn btn-secondary" style={{ flex: 1, padding: "10px", fontSize: 12 }} onClick={() => { setSelectedLead(l); setFormData(l); setShowModal(true); }}>Edit</button>
                   <button className="btn btn-secondary" style={{ flex: 1, padding: "10px", fontSize: 12 }} onClick={() => { setSelectedLead(l); setShowActivityModal(true); }}>Timeline</button>
                </div>
             </div>
           ))}
        </div>

        {filteredLeads.length === 0 && (
          <div style={{ padding: 80, textAlign: "center", color: "var(--text-muted)" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🛸</div>
            <div style={{ fontWeight: 800, fontSize: 18, color: "#fff" }}>No prospects found</div>
            <p>Your radar is currently clear of any matching inquiries.</p>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {(showModal || showActivityModal) && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(2, 6, 23, 0.9)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}>
           {showModal && (
             <div className="glass-card animate-fade" style={{ width: "100%", maxWidth: 540, padding: "clamp(24px, 8vw, 48px)", borderRadius: 32, maxHeight: "90vh", overflowY: "auto" }}>
                <h2 className="display-3" style={{ marginBottom: 8 }}>{selectedLead ? "Refine" : "Register"} <span className="text-gradient">Prospect</span></h2>
                <p className="text-sm" style={{ color: "var(--text-secondary)", marginBottom: 40 }}>Establish the foundation for a new trekking expedition.</p>
                
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                   <div className="form-group">
                      <label className="text-overline">Full Name</label>
                      <input className="form-control" required placeholder="Trekker's full identity" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                   </div>
                   <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                      <div className="form-group">
                         <label className="text-overline">Email Address</label>
                         <input className="form-control" type="email" placeholder="contact@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                      </div>
                      <div className="form-group">
                         <label className="text-overline">Phone Number</label>
                         <input className="form-control" placeholder="+91 00000 00000" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                      </div>
                   </div>
                   <div className="form-group">
                      <label className="text-overline">Pipeline Status</label>
                      <select className="form-control" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                         <option value="new">New Inquiry</option>
                         <option value="contacted">Contact Established</option>
                         <option value="converted">Expedition Booked</option>
                         <option value="lost">Lost Prospect</option>
                      </select>
                   </div>
                   <div className="form-group">
                      <label className="text-overline">Strategic Notes</label>
                      <textarea className="form-control" rows="3" placeholder="Context about the inquiry..." value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
                   </div>
                   <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                      <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{loading ? "Processing..." : "Secure Record"}</button>
                      <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Discard</button>
                   </div>
                </form>
             </div>
           )}

           {showActivityModal && selectedLead && (
             <div className="glass-card animate-fade" style={{ width: "100%", maxWidth: 640, padding: "clamp(24px, 8vw, 48px)", borderRadius: 32, maxHeight: "90vh", overflowY: "auto" }}>
                <h2 className="display-3" style={{ marginBottom: 8 }}>Expedition <span className="text-gradient">Timeline</span></h2>
                <p className="text-sm" style={{ color: "var(--text-secondary)", marginBottom: 40 }}>History for <b>{selectedLead.name}</b></p>
                
                <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 40 }}>
                   {(selectedLead.activities || []).map((a, i) => (
                     <div key={i} style={{ borderLeft: "2px solid var(--accent-primary)", paddingLeft: 20, position: "relative" }}>
                        <div style={{ position: "absolute", left: -6, top: 0, width: 10, height: 10, borderRadius: "50%", background: "var(--accent-primary)", boxShadow: "0 0 10px var(--accent-primary)" }} />
                        <div className="text-overline" style={{ color: "var(--accent-primary)", marginBottom: 4 }}>{a.activity_type} • {new Date(a.created_at).toLocaleDateString()}</div>
                        <p className="text-sm" style={{ color: "#fff", margin: 0 }}>{a.description}</p>
                     </div>
                   ))}
                </div>

                <form onSubmit={handleAddActivity} className="glass-card" style={{ padding: 20, background: "rgba(255,255,255,0.02)" }}>
                   <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, marginBottom: 16 }}>
                      <select className="form-control" value={activityData.activity_type} onChange={e => setActivityData({ ...activityData, activity_type: e.target.value })}>
                         <option value="note">📓 Note</option>
                         <option value="email">📧 Email</option>
                         <option value="call">📞 Call</option>
                      </select>
                      <input className="form-control" placeholder="Brief summary..." required value={activityData.description} onChange={e => setActivityData({ ...activityData, description: e.target.value })} />
                   </div>
                   <div style={{ display: "flex", gap: 12 }}>
                      <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{loading ? "Logging..." : "Commit"}</button>
                      <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowActivityModal(false)}>Close</button>
                   </div>
                </form>
             </div>
           )}
        </div>
      )}

      <style>{`
        .avatar-initial {
          width: 44px; height: 44px; border-radius: 14px;
          background: linear-gradient(135deg, rgba(249,115,22,0.1), rgba(249,115,22,0.05));
          display: flex; align-items: center; justify-content: center;
          font-weight: 900; color: var(--accent-primary); border: 1px solid rgba(249,115,22,0.2);
        }
        @media (max-width: 992px) {
          .desktop-only { display: none !important; }
          .mobile-only { display: flex !important; }
        }
      `}</style>
    </div>
  );
}