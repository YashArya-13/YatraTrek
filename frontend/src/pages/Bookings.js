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
      const res = await api.get("hotels/admin/bookings/");
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`hotels/admin/bookings/${id}/`, { status: newStatus });
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
              <th>Primary Trekker</th>
              <th>Assigned Expedition</th>
              <th>Base Camp</th>
              <th>Deployment Window</th>
              <th>Total Net</th>
              <th>Current Status</th>
              <th>Operations</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ padding: 100, textAlign: "center" }}>
                   <div style={{ fontSize: 48, marginBottom: 16 }}>⛺</div>
                   <div style={{ fontWeight: 800, fontSize: 18, color: "#fff" }}>No Reservations Logged</div>
                   <p style={{ color: "var(--text-muted)" }}>The expedition registry is currently empty.</p>
                </td>
              </tr>
            ) : (
              bookings.map((b, i) => (
                <tr key={b.id} style={{ animation: `fadeIn 0.5s ease-out forwards ${i * 0.05}s`, opacity: 0 }}>
                  <td>
                    <div style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 800, color: "var(--accent-primary)", background: "rgba(249,115,22,0.1)", padding: "4px 8px", borderRadius: 6, display: "inline-block" }}>
                      {b.booking_ref}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 800, color: "#fff", fontSize: 15 }}>{b.guest_name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{b.guest_email}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: "#e2e8f0" }}>{b.trek_name}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Batch #B-{String(b.id).padStart(3,'0')}</div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#f97316", fontWeight: 800, fontSize: 13 }}>
                      <span>⛺</span> {b.camp_name || "Unassigned"}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: 13, color: "#fff", fontWeight: 600 }}>{b.check_in || "TBD"}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Arrival Date</div>
                  </td>
                  <td>
                    <div style={{ fontSize: 16, fontWeight: 900, color: "var(--accent-primary)" }}>₹{(b.total_price || 0).toLocaleString()}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "var(--success)" }}>PAID IN FULL</div>
                  </td>
                  <td>
                    <span className={`badge badge-${getStatusClass(b.status)}`}>{b.status_display}</span>
                  </td>
                  <td>
                    <select 
                      className="form-control"
                      style={{ padding: "8px 12px", fontSize: 11, width: 130, borderRadius: 10 }}
                      value={b.status}
                      onChange={(e) => handleStatusChange(b.id, e.target.value)}
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="confirmed">✅ Confirmed</option>
                      <option value="on_trek">🏔️ On Trek</option>
                      <option value="completed">🏆 Completed</option>
                      <option value="cancelled">❌ Cancelled</option>
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
