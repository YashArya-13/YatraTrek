import React, { useState, useEffect } from "react";
import api from "../api";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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
      alert("Failed to update status");
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
