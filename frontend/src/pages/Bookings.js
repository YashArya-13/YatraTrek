import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming"); // "upcoming" or "history"
  const userRole = localStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get("treks/admin/bookings/");
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`treks/admin/bookings/${id}/`, { status: newStatus });
      fetchBookings();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleCancel = async (ref) => {
    if (!window.confirm("Are you sure you want to cancel this expedition reservation?")) return;
    try {
      await api.post(`treks/booking/${ref}/cancel/`);
      toast.success("Expedition Cancelled Successfully");
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to cancel booking");
    }
  };

  if (loading) return (
    <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
      <div className="loader-ring" />
      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "2px" }}>Syncing Reservations...</div>
      <style>{`
        .loader-ring { width: 48px; height: 48px; border: 4px solid rgba(249, 115, 22, 0.1); border-top-color: #f97316; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#22c55e';
      case 'pending': return '#fbbf24';
      case 'on_trek': return '#3b82f6';
      case 'completed': return '#a855f7';
      case 'cancelled': return '#ef4444';
      default: return '#f97316';
    }
  };

  const upcomingBookings = bookings.filter(b => ['pending', 'confirmed', 'on_trek'].includes(b.status));
  const historyBookings = bookings.filter(b => ['completed', 'cancelled'].includes(b.status));
  const displayedBookings = activeTab === "upcoming" ? upcomingBookings : historyBookings;

  if (userRole === "trekker") {
    return (
      <div className="animate-fade" style={{ fontFamily: "'Outfit', sans-serif", color: "#fff", minHeight: "80vh" }}>
        {/* ── Page Header ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <div style={{ width: 32, height: 2, background: "var(--accent-primary)" }} />
              <div style={{ fontSize: 12, fontWeight: 800, color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "3px" }}>Explorer Headquarters</div>
            </div>
            <h1 style={{ fontSize: 42, fontWeight: 950, letterSpacing: "-0.04em", margin: 0 }}>My <span className="text-gradient">Expeditions</span></h1>
            <p style={{ fontSize: 16, color: "var(--text-secondary)", marginTop: 8 }}>View details, print digital invoices, or manage your upcoming treks.</p>
          </div>
          <button 
            onClick={() => navigate("/treks")}
            style={{
              padding: "12px 24px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
              color: "#fff",
              border: "none",
              fontWeight: "800",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(249, 115, 22, 0.3)",
              transition: "transform 0.2s ease",
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.03)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            ⛺ Find New Adventure
          </button>
        </div>

        {/* ── Interactive Tabs Selector ── */}
        <div style={{ 
          display: "flex", 
          gap: 16, 
          borderBottom: "1px solid rgba(255,255,255,0.06)", 
          paddingBottom: 16, 
          marginBottom: 36 
        }}>
          {[
            { id: "upcoming", label: "Active Expeditions", count: upcomingBookings.length, icon: "🏔️" },
            { id: "history", label: "Past & History", count: historyBookings.length, icon: "📜" }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: isActive ? "rgba(249, 115, 22, 0.1)" : "transparent",
                  border: isActive ? "1px solid rgba(249, 115, 22, 0.2)" : "1px solid transparent",
                  borderRadius: "12px",
                  padding: "10px 20px",
                  color: isActive ? "var(--accent-primary)" : "var(--text-secondary)",
                  fontSize: "14px",
                  fontWeight: "800",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "all 0.3s ease"
                }}
                onMouseOver={(e) => {
                  if (!isActive) e.currentTarget.style.color = "#fff";
                }}
                onMouseOut={(e) => {
                  if (!isActive) e.currentTarget.style.color = "var(--text-secondary)";
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span style={{ 
                  background: isActive ? "var(--accent-primary)" : "rgba(255,255,255,0.05)", 
                  color: isActive ? "#000" : "var(--text-muted)", 
                  padding: "2px 8px", 
                  borderRadius: "20px", 
                  fontSize: "11px",
                  fontWeight: "900"
                }}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Booking Grid ── */}
        {displayedBookings.length === 0 ? (
          <div style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "32px",
            padding: "80px 40px",
            textAlign: "center",
            maxWidth: "600px",
            margin: "40px auto 0",
          }}>
            <div style={{ fontSize: 64, marginBottom: 24 }}>
              {activeTab === "upcoming" ? "🎒" : "🏕️"}
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 12 }}>
              {activeTab === "upcoming" ? "No Active Expeditions" : "No Past History Logged"}
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.6, marginBottom: 30 }}>
              {activeTab === "upcoming" 
                ? "You don't have any upcoming treks booked right now. Ready to scale magnificent peaks?" 
                : "You haven't completed or cancelled any historical expeditions yet."}
            </p>
            {activeTab === "upcoming" && (
              <button 
                onClick={() => navigate("/treks")}
                style={{
                  padding: "16px 36px",
                  borderRadius: "18px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff",
                  fontWeight: "800",
                  cursor: "pointer",
                  transition: "0.2s"
                }}
                onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
              >
                Explore Treks
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 30 }}>
            {displayedBookings.map((b, i) => {
              const statusColor = getStatusColor(b.status);
              return (
                <div 
                  key={b.id} 
                  style={{
                    background: "rgba(15, 23, 42, 0.4)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "28px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.3s ease, border-color 0.3s ease",
                    animation: `fadeInUp 0.6s ease-out forwards ${i * 0.1}s`,
                    opacity: 0,
                    transform: "translateY(20px)"
                  }}
                  className="trekker-card"
                >
                  {/* Card Header Image */}
                  <div style={{ position: "relative", height: "180px", overflow: "hidden" }}>
                    <img 
                      src={b.trek_image || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800"} 
                      alt={b.trek_name} 
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(15,23,42,0.95))" }} />
                    
                    {/* Booking Reference Overlay */}
                    <div style={{ position: "absolute", top: 16, left: 16, background: "rgba(15,23,42,0.75)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", padding: "6px 12px", fontFamily: "monospace", fontSize: 11, fontWeight: "900", color: "var(--accent-primary)", letterSpacing: "1px" }}>
                      {b.booking_ref}
                    </div>

                    {/* Cost Overlay */}
                    <div style={{ position: "absolute", top: 16, right: 16, background: "rgba(16,185,129,0.9)", backdropFilter: "blur(4px)", borderRadius: "8px", padding: "6px 12px", fontSize: 13, fontWeight: "900", color: "#fff" }}>
                      ₹{(b.total_price || 0).toLocaleString()}
                    </div>

                    {/* Trek Name Overlay */}
                    <div style={{ position: "absolute", bottom: 12, left: 20, right: 20 }}>
                      <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "900", color: "#fff", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>{b.trek_name}</h3>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "12px", color: "rgba(255,255,255,0.6)", marginTop: 4 }}>
                        <span>📍</span> {b.trek_region || "Himalayas"}
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
                    
                    {/* Date Window */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "16px", padding: "14px 16px" }}>
                      <div>
                        <div style={{ fontSize: "9px", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 800, letterSpacing: "1px", marginBottom: 4 }}>Check In</div>
                        <div style={{ fontSize: "13px", fontWeight: 700, color: "#e2e8f0" }}>{b.check_in || "TBD"}</div>
                      </div>
                      <div style={{ borderLeft: "1px solid rgba(255,255,255,0.06)", paddingLeft: 16 }}>
                        <div style={{ fontSize: "9px", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 800, letterSpacing: "1px", marginBottom: 4 }}>Check Out</div>
                        <div style={{ fontSize: "13px", fontWeight: 700, color: "#e2e8f0" }}>{b.check_out || "TBD"}</div>
                      </div>
                    </div>

                    {/* Squad Details & Status */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: "700", color: "#f1f5f9" }}>
                          👥 {b.trekkers_count} Explorer{b.trekkers_count > 1 ? "s" : ""}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: 4 }}>
                          ⛺ {b.camp_name || "Unassigned Camp"}
                        </div>
                      </div>
                      <span style={{ 
                        padding: "6px 14px", 
                        borderRadius: "100px", 
                        background: `${statusColor}15`, 
                        border: `1px solid ${statusColor}30`, 
                        color: statusColor, 
                        fontSize: "11px", 
                        fontWeight: "900", 
                        textTransform: "uppercase",
                        letterSpacing: "1px"
                      }}>
                        {b.status_display}
                      </span>
                    </div>

                    {/* Card Actions */}
                    <div style={{ display: "flex", gap: 12, marginTop: "auto", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 20 }}>
                      <button 
                        onClick={() => navigate(`/booking-status/${b.booking_ref}`)}
                        style={{ 
                          flex: 1, 
                          background: "rgba(255,255,255,0.03)", 
                          border: "1px solid rgba(255,255,255,0.1)", 
                          color: "#fff", 
                          padding: "12px", 
                          borderRadius: "12px", 
                          fontWeight: "800", 
                          fontSize: "12px",
                          cursor: "pointer",
                          transition: "0.2s"
                        }}
                        className="btn-details"
                        onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                        onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                      >
                        📄 View Invoice & Details
                      </button>
                      {(b.status === 'pending' || b.status === 'confirmed') && (
                        <button 
                          onClick={() => handleCancel(b.booking_ref)}
                          style={{ 
                            background: "rgba(239,68,68,0.1)", 
                            border: "1px solid rgba(239,68,68,0.25)", 
                            color: "#ef4444", 
                            padding: "12px 16px", 
                            borderRadius: "12px", 
                            fontWeight: "800", 
                            fontSize: "12px",
                            cursor: "pointer",
                            transition: "0.2s"
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = "rgba(239,68,68,0.2)";
                            e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = "rgba(239,68,68,0.1)";
                            e.currentTarget.style.borderColor = "rgba(239,68,68,0.25)";
                          }}
                        >
                          ❌ Cancel Trek
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(24px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .trekker-card:hover {
            transform: translateY(-6px) !important;
            border-color: rgba(249, 115, 22, 0.2) !important;
            box-shadow: 0 12px 24px rgba(0,0,0,0.3);
          }
          .text-gradient {
            background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        `}</style>
      </div>
    );
  }

  // Back-office CRM Registry View for Staff / Admin
  return (
    <div className="animate-fade">
      {/* ── Page Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{ width: 32, height: 2, background: "var(--accent-primary)" }} />
            <div style={{ fontSize: 12, fontWeight: 800, color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "3px" }}>Deployment Center</div>
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 950, letterSpacing: "-0.04em", margin: 0 }}>Active <span className="text-gradient">Reservations</span></h1>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", marginTop: 8 }}>Orchestrate trekker logistics and expedition deployments.</p>
        </div>
      </div>

      {/* ── Reservations Table ── */}
      <div className="crm-table-container">
        <table className="crm-table">
          <thead>
            <tr>
              <th>ID & Reference</th>
              <th>Trekker Details & Comms</th>
              <th>Assigned Expedition</th>
              <th>Deployment Window</th>
              <th>Total Net</th>
              <th>Current Status</th>
              <th>Operations</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: 100, textAlign: "center" }}>
                   <div style={{ fontSize: 48, marginBottom: 16 }}>⛺</div>
                   <div style={{ fontWeight: 800, fontSize: 18, color: "#fff" }}>No Reservations Logged</div>
                   <p style={{ color: "var(--text-muted)" }}>The expedition registry is currently empty.</p>
                </td>
              </tr>
            ) : (
              bookings.map((b, i) => (
                <tr key={b.id} style={{ animation: `fadeIn 0.5s ease-out forwards ${i * 0.05}s`, opacity: 0 }}>
                  <td>
                    <div style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 800, color: "var(--accent-primary)", background: "rgba(245,158,11,0.1)", padding: "4px 8px", borderRadius: 6, display: "inline-block", marginBottom: "8px" }}>
                      {b.booking_ref}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Booked: {new Date(b.created_at).toLocaleDateString()}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 800, color: "#fff", fontSize: 15, marginBottom: "4px" }}>
                       {b.guest_name} 
                       <span style={{ fontSize: 11, fontWeight: 800, color: "var(--bg-primary)", background: "var(--accent-secondary)", padding: "2px 6px", borderRadius: "4px", marginLeft: "8px" }}>
                         {b.trekkers_count} Pax
                       </span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: "4px" }}>✉️ {b.guest_email}</div>
                    {b.guest_phone && (
                      <div style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 8 }}>
                         <span style={{ color: "var(--text-muted)" }}>📞 {b.guest_phone}</span>
                         <a href={`https://wa.me/${b.guest_phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" style={{ color: "#25D366", textDecoration: "none", fontWeight: "700", background: "rgba(37,211,102,0.1)", padding: "2px 6px", borderRadius: "4px" }}>WhatsApp</a>
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: "#e2e8f0", marginBottom: "4px" }}>{b.trek_name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--accent-primary)", fontWeight: 800, fontSize: 12, marginBottom: "8px" }}>
                      <span>⛺</span> {b.camp_name || "Unassigned"}
                    </div>
                    {b.special_requests && (
                      <div style={{ fontSize: 11, color: "var(--warning)", background: "rgba(245,158,11,0.05)", padding: "6px", borderRadius: "6px", border: "1px solid rgba(245,158,11,0.2)" }}>
                         <strong>Notes:</strong> {b.special_requests}
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontSize: 13, color: "#fff", fontWeight: 700, marginBottom: "4px" }}>IN: {b.check_in || "TBD"}</div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)" }}>OUT: {b.check_out || "TBD"}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: 16, fontWeight: 900, color: "var(--accent-primary)" }}>₹{(b.total_price || 0).toLocaleString()}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "var(--success)", background: "rgba(16,185,129,0.1)", padding: "2px 6px", borderRadius: "4px", display: "inline-block", marginTop: "4px" }}>PAID IN FULL</div>
                  </td>
                  <td>
                    <span className={`badge badge-${getStatusClass(b.status)}`}>{b.status_display}</span>
                  </td>
                  <td>
                    <select 
                      className="form-control"
                      style={{ padding: "8px 12px", fontSize: 12, width: 140, borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", color: "#fff", fontWeight: 600 }}
                      value={b.status}
                      onChange={(e) => handleStatusChange(b.id, e.target.value)}
                    >
                      <option value="pending" style={{ color: "#000" }}>⏳ Pending</option>
                      <option value="confirmed" style={{ color: "#000" }}>✅ Confirmed</option>
                      <option value="on_trek" style={{ color: "#000" }}>🏔️ On Trek</option>
                      <option value="completed" style={{ color: "#000" }}>🏆 Completed</option>
                      <option value="cancelled" style={{ color: "#000" }}>❌ Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const getStatusClass = (status) => {
  switch(status) {
    case 'confirmed': return 'success';
    case 'pending': return 'warning';
    case 'on_trek': return 'info';
    case 'cancelled': return 'danger';
    default: return 'info';
  }
};
