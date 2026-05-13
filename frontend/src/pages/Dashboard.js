import React, { useEffect, useState } from "react";
import api from "../api";

const MetricCard = ({ title, value, icon, trend }) => (
  <div className="glass-card" style={{ padding: "var(--space-lg)" }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, alignItems: "center" }}>
      <div style={{ fontSize: 24 }}>{icon}</div>
      <div style={{ fontSize: 10, fontWeight: 800, color: "var(--success)", background: "rgba(16, 185, 129, 0.1)", padding: "4px 8px", borderRadius: 6 }}>{trend}</div>
    </div>
    <div className="text-overline" style={{ color: "var(--text-muted)", marginBottom: 4 }}>{title}</div>
    <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: "-1px" }}>{value}</div>
  </div>
);

const StatusRow = ({ label, value, color }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>{label}</div>
    </div>
    <div style={{ fontSize: 14, fontWeight: 800 }}>{value}</div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    trekkers: 0,
    batches: 0,
    success_rate: "0%",
    revenue: 0,
    revenue_chart: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("hotels/dashboard/")
      .then(res => {
        const d = res.data;
        setStats({
          trekkers: d.stats.total_bookings * 4, // Estimate 4 per booking
          batches: d.stats.total_rooms,
          success_rate: `${100 - d.stats.cancelled}%`,
          revenue: d.stats.total_revenue || 0,
          revenue_chart: d.revenueChart || []
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color: "var(--accent-primary)", padding: 40, fontWeight: 800 }}>Initializing Mission Control...</div>;

  return (
    <div className="animate-fade">
      {/* ── Page Header ── */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 32, height: 2, background: "var(--accent-primary)" }} />
          <div className="text-overline" style={{ color: "var(--accent-primary)" }}>Intelligence Dashboard</div>
        </div>
        <h1 className="display-2">Operational <span className="text-gradient">Intelligence</span></h1>
        <p className="text-lg" style={{ color: "var(--text-secondary)", marginTop: 8 }}>Real-time telemetry and expedition analytics from active base camps.</p>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-4" style={{ marginBottom: 40, gap: "var(--space-lg)" }}>
        <MetricCard title="Active Trekkers" value={stats.trekkers} icon="👥" trend="+12% vs last month" />
        <MetricCard title="Squad Batches" value={stats.batches} icon="🏔️" trend="8 active currently" />
        <MetricCard title="Success Rate" value={stats.success_rate} icon="🎯" trend="Highest in region" />
        <MetricCard title="Total Revenue" value={`₹${stats.revenue.toLocaleString()}`} icon="💰" trend="+5.4% growth" />
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--space-lg)" }}>
        {/* Revenue Analytics Card */}
        <div className="glass-card" style={{ padding: "clamp(24px, 5vw, 40px)", gridColumn: "span var(--rev-span, 1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Revenue Stream</h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Monthly financial trajectory</p>
            </div>
            <div style={{ padding: "8px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 12, fontSize: 12, fontWeight: 700 }}>2026 Forecast</div>
          </div>
          
          <div style={{ height: 300, display: "flex", alignItems: "flex-end", gap: "clamp(8px, 2vw, 16px)", padding: "20px 0" }}>
            {stats.revenue_chart.map((d, i) => {
              const height = (d.revenue / 100000) * 100; // Scaling logic
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                  <div style={{ 
                    width: "100%", 
                    height: `${Math.max(height, 10)}%`, 
                    background: i === stats.revenue_chart.length - 1 
                      ? "linear-gradient(to top, var(--accent-primary), var(--accent-secondary))" 
                      : "rgba(255,255,255,0.05)",
                    borderRadius: "8px 8px 4px 4px",
                    position: "relative",
                    transition: "0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                    cursor: "pointer"
                  }} className="chart-bar">
                    <div className="chart-tooltip">₹{(d.revenue/1000).toFixed(1)}k</div>
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 800, color: i === stats.revenue_chart.length - 1 ? "var(--accent-primary)" : "var(--text-muted)", textTransform: "uppercase" }}>{d.name}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Distribution Card */}
        <div className="glass-card" style={{ padding: "clamp(24px, 5vw, 40px)", display: "flex", flexDirection: "column" }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 32 }}>Batch Status</h3>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", minHeight: "200px" }}>
            {/* Simulated Donut Chart */}
            <div style={{ 
              width: 180, height: 180, borderRadius: "50%", 
              border: "12px solid var(--bg-tertiary)",
              position: "relative",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "inset 0 0 20px rgba(0,0,0,0.5)"
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 32, fontWeight: 900, color: "var(--accent-primary)" }}>87%</div>
                <div className="text-overline" style={{ color: "var(--text-muted)" }}>Deployed</div>
              </div>
              <div style={{ 
                position: "absolute", inset: -12, borderRadius: "50%",
                border: "12px solid var(--accent-primary)",
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 50%)", // Simulated progress
                transform: "rotate(-45deg)"
              }} />
            </div>
          </div>
          <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 12 }}>
            <StatusRow label="In Field" value="12" color="var(--accent-primary)" />
            <StatusRow label="Preparation" value="4" color="var(--success)" />
            <StatusRow label="Debriefing" value="2" color="var(--text-muted)" />
          </div>
        </div>
      </div>

      <style>{`
        .chart-bar:hover { background: var(--accent-primary) !important; }
        .chart-bar:hover .chart-tooltip { opacity: 1; transform: translateY(-10px); }
        .chart-tooltip {
          position: absolute; top: -40px; left: 50%; transform: translateX(-50%);
          background: #fff; color: #020617; padding: 4px 8px; border-radius: 6px;
          font-size: 10px; font-weight: 800; opacity: 0; transition: 0.3s; pointer-events: none;
        }
        @media (min-width: 1200px) {
          .glass-card:first-child { --rev-span: 2; }
        }
        @media (max-width: 1024px) {
          .grid-cols-4 { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 640px) {
          .grid-cols-4 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}