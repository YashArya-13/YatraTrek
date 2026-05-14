import React, { useState, useEffect } from "react";
import api from "../api";

export default function Trekkers() {
  const [trekkers, setTrekkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrekkers();
  }, []);

  const fetchTrekkers = async () => {
    setLoading(true);
    try {
      const res = await api.get("treks/admin/bookings/");
      setTrekkers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
      <div className="loader-ring" />
      <div className="text-overline" style={{ color: "var(--text-muted)" }}>Establishing Satellite Link...</div>
    </div>
  );

  return (
    <div className="animate-fade">
      {/* ── Page Header ── */}
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: "24px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{ width: 32, height: 2, background: "var(--accent-primary)" }} />
            <div className="text-overline" style={{ color: "var(--accent-primary)" }}>Personnel Tracking</div>
          </div>
          <h1 className="display-2">Active <span className="text-gradient">Trekkers</span></h1>
          <p className="text-lg" style={{ color: "var(--text-secondary)", marginTop: 8 }}>Real-time biological telemetry and location tracking for all deployed personnel.</p>
        </div>
      </div>

      {/* ── Trekkers Grid ── */}
      <div className="grid grid-cols-3" style={{ gap: "var(--space-lg)" }}>
        {trekkers.length === 0 ? (
          <div className="glass-card" style={{ gridColumn: "1 / -1", padding: "clamp(40px, 10vw, 80px)", textAlign: "center" }}>
             <div style={{ fontSize: 48, marginBottom: 16 }}>👤</div>
             <div style={{ fontWeight: 800, fontSize: 18, color: "#fff" }}>No Deployed Personnel</div>
             <p className="text-sm" style={{ color: "var(--text-muted)" }}>There are currently no active personnel in the field.</p>
          </div>
        ) : (
          trekkers.map((t, i) => (
            <div key={t.id} className="glass-card animate-fade" style={{ padding: "clamp(24px, 5vw, 32px)", animationDelay: `${i * 0.1}s` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                 <div className="avatar-box">
                   {(t.guest_name || "T")[0]}
                 </div>
                 <div style={{ textAlign: "right" }}>
                   <div className="text-overline" style={{ color: "var(--accent-primary)", letterSpacing: "1px" }}>Status</div>
                   <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>{t.status_display}</div>
                 </div>
              </div>
              
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 18, fontWeight: 900, color: "#fff", marginBottom: 4 }}>{t.guest_name}</h4>
                <div className="text-xs" style={{ color: "var(--text-muted)", fontWeight: 600 }}>{t.guest_email}</div>
              </div>

              <div style={{ padding: 20, background: "rgba(255,255,255,0.02)", borderRadius: 16, border: "1px solid var(--glass-border)", marginBottom: 24 }}>
                <div className="text-overline" style={{ color: "var(--text-muted)", marginBottom: 8, fontSize: "9px" }}>Deployment</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>{t.trek_name}</div>
                <div style={{ fontSize: 11, color: "var(--accent-primary)", fontWeight: 800, marginTop: 4 }}>⛺ {t.camp_name || "Base Camp"}</div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                <div>
                   <div className="text-overline" style={{ color: "var(--text-muted)", fontSize: "9px" }}>Duration</div>
                   <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{t.check_in} — {t.check_out}</div>
                </div>
                <button className="btn btn-secondary" style={{ padding: "8px 16px", fontSize: 11, borderRadius: 10 }}>Vitals</button>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .avatar-box {
          width: 56px; height: 56px; border-radius: 16px; 
          background: linear-gradient(135deg, #334155, #1e293b); 
          display: flex; align-items: center; justify-content: center; 
          font-size: 24px; font-weight: 900; color: "#fff"; 
          border: 1px solid var(--glass-border);
        }
        @media (max-width: 1024px) {
          .grid-cols-3 { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 640px) {
          .grid-cols-3 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
