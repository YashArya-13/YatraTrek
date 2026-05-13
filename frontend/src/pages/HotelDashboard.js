import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import {
  XAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from "recharts";

const COLORS = ["#f97316", "#3b82f6", "#10b981", "#a855f7", "#ef4444", "#fbbf24"];

export default function HotelDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await api.get("hotels/dashboard/");
      setData(r.data);
    } catch (err) {
      console.error(err);
      setError("Failed to synchronize with Expedition HQ. Please check your satellite uplink.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return (
    <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
      <div className="loader-ring" />
      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "2px" }}>Syncing Command Center...</div>
      <style>{`
        .loader-ring { width: 48px; height: 48px; border: 4px solid rgba(249, 115, 22, 0.1); border-top-color: #f97316; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "24px" }}>
       <div style={{ fontSize: "64px" }}>🏔️</div>
       <div style={{ color: "#fff", fontWeight: "800", fontSize: 18 }}>{error}</div>
       <button className="btn btn-primary" onClick={fetchData}>Reconnect Uplink</button>
    </div>
  );

  const { stats, revenueChart, statusDistribution, topHotels, recentBookings } = data;

  return (
    <div className="animate-fade">
      {/* ── Page Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{ width: 32, height: 2, background: "var(--accent-primary)" }} />
            <div style={{ fontSize: 12, fontWeight: 800, color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "3px" }}>Regional Command</div>
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 950, letterSpacing: "-0.04em", margin: 0 }}>Expedition <span className="text-gradient">Control</span></h1>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", marginTop: 8 }}>Strategic overview of all active treks and regional logistics.</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button className="btn btn-secondary" onClick={() => window.open("/", "_blank")}>Portal View</button>
          <button className="btn btn-primary" onClick={() => navigate("/leads")}>Initiate Deployment</button>
        </div>
      </div>

      {/* ── Metric Grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", marginBottom: "40px" }}>
        {[
          { l: "ACTIVE TREKS", v: stats.total_hotels, i: "🏔️", c: "#f97316" },
          { l: "OPEN BATCHES", v: stats.total_rooms, i: "🏕️", c: "#3b82f6" },
          { l: "TOTAL TREKKERS", v: stats.total_bookings, i: "🥾", c: "#10b981" },
          { l: "GROSS REVENUE", v: `₹${(stats.total_revenue || 0).toLocaleString()}`, i: "💰", c: "#fbbf24" }
        ].map((s, i) => (
          <div key={i} className="glass-card" style={{ padding: "32px", position: "relative", overflow: "hidden" }}>
             <div style={{ fontSize: "10px", fontWeight: "900", color: "var(--text-muted)", letterSpacing: "2px", marginBottom: "12px" }}>{s.l}</div>
             <div style={{ fontSize: "32px", fontWeight: "950", color: "#fff" }}>{s.v}</div>
             <div style={{ position: "absolute", bottom: "24px", right: "24px", fontSize: "32px", opacity: 0.15 }}>{s.i}</div>
             <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "2px", background: `linear-gradient(to right, ${s.c}, transparent)` }} />
          </div>
        ))}
      </div>

      {/* ── Analytics Section ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "24px", marginBottom: "24px" }}>
        <div className="glass-card" style={{ padding: "40px" }}>
          <h3 style={{ fontSize: "20px", fontWeight: "900", marginBottom: "40px" }}>Revenue Trajectory</h3>
          <div style={{ height: "350px" }}>
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={revenueChart}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={11} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: 12 }} />
                  <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
               </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card" style={{ padding: "40px" }}>
          <h3 style={{ fontSize: "20px", fontWeight: "900", marginBottom: "40px" }}>Deployment Health</h3>
          <div style={{ height: "220px", position: "relative" }}>
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusDistribution} innerRadius={70} outerRadius={90} paddingAngle={10} dataKey="value" stroke="none">
                    {(statusDistribution || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: 12 }} />
                </PieChart>
             </ResponsiveContainer>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "40px" }}>
             {(statusDistribution || []).map((d, i) => (
               <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "14px", background: "rgba(255,255,255,0.02)", borderRadius: "14px", border: "1px solid var(--glass-border)" }}>
                  <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>{d.name}</span>
                  <span style={{ fontSize: "13px", fontWeight: "900", color: COLORS[i % COLORS.length] }}>{d.value}</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "24px" }}>
        <div className="glass-card" style={{ padding: "40px" }}>
           <h3 style={{ fontSize: "20px", fontWeight: "900", marginBottom: "32px" }}>Regional Rankings</h3>
           <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {(topHotels || []).map((h, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px", background: "rgba(255,255,255,0.02)", borderRadius: "20px", border: "1px solid var(--glass-border)" }}>
                   <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(249,115,22,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🏔️</div>
                      <div>
                        <div style={{ fontSize: "16px", fontWeight: "800", color: "#fff" }}>{h.name}</div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>{h.region}</div>
                      </div>
                   </div>
                   <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "22px", fontWeight: "950", color: "#f97316" }}>{h.bookings}</div>
                      <div style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 800 }}>Deployments</div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="glass-card" style={{ padding: "0", overflow: "hidden" }}>
           <div style={{ padding: 40, borderBottom: "1px solid var(--glass-border)" }}>
             <h3 style={{ fontSize: "20px", fontWeight: "900" }}>Satellite Feed</h3>
           </div>
           <table className="crm-table">
              <thead>
                <tr>
                  <th>Trekker Identity</th><th>Assignment & Base</th><th>Stage</th>
                </tr>
              </thead>
              <tbody>
                 {(recentBookings || []).slice(0, 5).map((b, i) => (
                   <tr key={i}>
                      <td style={{ fontWeight: "800", color: "#fff" }}>{b.guest_name}</td>
                      <td>
                         <div style={{ color: "#e2e8f0", fontSize: "14px", fontWeight: "700" }}>{b.trek_name}</div>
                         <div style={{ fontSize: "11px", color: "#f97316", letterSpacing: "1px", textTransform: "uppercase", fontWeight: 900, marginTop: "4px" }}>⛺ {b.camp_name || "Unassigned"}</div>
                      </td>
                      <td><span className={`badge badge-${getStatusClass(b.status)}`}>{b.status_display}</span></td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
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
