import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [systemTime, setSystemTime] = useState(new Date().toLocaleTimeString());
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setSystemTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("users/login/", { username, password });
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("username", res.data.username);
      navigate("/dashboard");
    } catch (err) {
      setError("AUTHENTICATION FAILURE: INVALID CREDENTIALS");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{
      minHeight: "100vh",
      background: "#020617",
      display: "grid",
      gridTemplateColumns: "1fr 550px",
      fontFamily: "'Inter', sans-serif",
      color: "#fff",
      overflowX: "hidden"
    }}>
      
      {/* ── Visual Side (The Intelligence Core) ── */}
      <div className="visual-side" style={{ position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ 
          position: "absolute", inset: 0, 
          background: "radial-gradient(circle at center, rgba(249, 115, 22, 0.1) 0%, transparent 70%)",
          zIndex: 1
        }} />
        
        {/* Animated Background Image */}
        <img 
          src="https://images.unsplash.com/photo-1551632811-561732d1e306" 
          alt="Expedition" 
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.4, position: "absolute", zIndex: 0 }} 
        />
        
        {/* Holographic Overlay Elements */}
        <div style={{ zIndex: 2, textAlign: "left", padding: "clamp(24px, 5vw, 80px)", maxWidth: "800px" }}>
           <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", padding: "10px 24px", borderRadius: "100px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", marginBottom: "40px", backdropFilter: "blur(10px)" }}>
              <span className="pulse-dot" />
              <span className="text-overline" style={{ color: "#f97316" }}>Regional Command Active</span>
           </div>
           <h1 className="display-1" style={{ marginBottom: "32px", fontSize: "clamp(48px, 6vw, 90px)" }}>OPERATIONAL <br/> <span className="text-gradient">ACCESS.</span></h1>
           <p className="text-xl" style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.6, marginBottom: "60px" }}>
             Welcome to the YatraTrek Enterprise Intelligence Network. Connect to manage high-altitude logistics, satellite telemetry, and regional squad deployments.
           </p>

           <div className="grid grid-cols-2" style={{ gap: "32px", marginBottom: "64px" }}>
              {[
                { l: "Uptime", v: "99.98%", d: "Satellite Link" },
                { l: "Nodes", v: "142", d: "Base Camps" },
                { l: "Security", v: "AES-256", d: "Protocol" },
                { l: "Latency", v: "14ms", d: "Sync Speed" }
              ].map((s, i) => (
                <div key={i} style={{ borderLeft: "2px solid rgba(249, 115, 22, 0.3)", paddingLeft: "20px" }}>
                   <div className="text-overline" style={{ color: "rgba(255,255,255,0.3)" }}>{s.l}</div>
                   <div style={{ fontSize: "24px", fontWeight: "950", color: "#fff", margin: "4px 0" }}>{s.v}</div>
                   <div style={{ fontSize: "11px", color: "#f97316", fontWeight: 700 }}>{s.d}</div>
                </div>
              ))}
           </div>

           <div className="glass-card" style={{ padding: "24px", backdropFilter: "blur(20px)" }}>
              <div className="text-overline" style={{ color: "#f97316", marginBottom: "16px", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f97316" }} /> OPERATIONAL ALERTS
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                 <div className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>• Weather window for <span style={{ color: "#fff", fontWeight: 700 }}>Roopkund Basin</span> closing in 48h.</div>
                 <div className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>• Logistics resupply to <span style={{ color: "#fff", fontWeight: 700 }}>Sankri HQ</span> completed.</div>
                 <div className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>• Satellite firmware v4.2.1 deployment pending.</div>
              </div>
           </div>
        </div>

        {/* HUD UI Elements */}
        <div style={{ position: "absolute", bottom: "40px", right: "40px", zIndex: 3, textAlign: "right" }}>
           <div style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: "950", color: "rgba(255,255,255,0.1)", letterSpacing: "-2px" }}>{systemTime}</div>
           <div className="text-overline" style={{ color: "rgba(255,255,255,0.2)" }}>System Real-Time Clock</div>
        </div>
      </div>

      {/* ── Interaction Side (Login Form) ── */}
      <div className="form-side" style={{ background: "#0a0f1e", borderLeft: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", padding: "clamp(24px, 10%, 80px)" }}>
         <div style={{ marginBottom: "clamp(40px, 8vw, 80px)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }} onClick={() => navigate("/")}>
               <div style={{ width: 40, height: 40, borderRadius: 12, background: "#f97316", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: 20 }}>Y</div>
               <div style={{ fontWeight: "950", fontSize: 24, letterSpacing: "-1px" }}>Yatra<span style={{ color: "#f97316" }}>Trek</span></div>
            </div>
            <button 
               onClick={() => navigate("/")}
               className="btn btn-secondary"
               style={{ padding: "10px 20px", borderRadius: "100px", fontSize: "12px", border: "1px solid rgba(255,255,255,0.1)" }}
            >Public Portal</button>
         </div>

         <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: "450px", margin: "0 auto", width: "100%" }}>
            <h2 className="display-3" style={{ marginBottom: "12px" }}>Establish Link.</h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)", marginBottom: "48px" }}>Enter your operational credentials to initiate session.</p>

            {error && (
              <div style={{ background: "rgba(239, 68, 68, 0.1)", borderLeft: "4px solid #ef4444", padding: "20px", color: "#ef4444", fontWeight: 800, fontSize: "13px", marginBottom: "32px", borderRadius: "8px" }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
               <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="text-overline" style={{ color: "rgba(255,255,255,0.3)", display: "block", marginBottom: "12px" }}>Command Identity</label>
                  <div style={{ position: "relative" }}>
                     <input 
                       className="form-control" 
                       type="text" 
                       placeholder="Enter Username" 
                       required 
                       value={username} 
                       onChange={e => setUsername(e.target.value)}
                       style={{ padding: "20px 24px", paddingLeft: "54px", background: "rgba(255,255,255,0.02)", fontSize: "15px" }}
                     />
                     <span style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", fontSize: "18px", opacity: 0.3 }}>👤</span>
                  </div>
               </div>

               <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="text-overline" style={{ color: "rgba(255,255,255,0.3)", display: "block", marginBottom: "12px" }}>Security Token</label>
                  <div style={{ position: "relative" }}>
                     <input 
                       className="form-control" 
                       type={showPassword ? "text" : "password"} 
                       placeholder="Enter Password" 
                       required 
                       value={password} 
                       onChange={e => setPassword(e.target.value)}
                       style={{ padding: "20px 24px", paddingLeft: "54px", background: "rgba(255,255,255,0.02)", fontSize: "15px" }}
                     />
                     <span style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", fontSize: "18px", opacity: 0.3 }}>🔑</span>
                     <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ position: "absolute", right: "20px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: "18px" }}
                     >{showPassword ? "👁️" : "🙈"}</button>
                  </div>
               </div>

               <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={loading}
                  style={{ padding: "20px", fontSize: "15px", fontWeight: "900", borderRadius: "18px", marginTop: "16px", letterSpacing: "1px" }}
               >
                  {loading ? "AUTHENTICATING..." : "INITIATE UPLINK"}
               </button>
            </form>

            <div style={{ marginTop: "32px", textAlign: "center", display: "flex", flexDirection: "column", gap: "12px" }}>
               <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", textDecoration: "none", fontWeight: 700, cursor: "pointer" }}>Request Access Recovery 🛰️</span>
               <div 
                  onClick={() => navigate("/partner-registration")}
                  style={{ color: "#f97316", fontSize: "14px", fontWeight: "900", cursor: "pointer", textTransform: "uppercase", letterSpacing: "1px" }}
               >
                 Become a Camp Partner ➔
               </div>
            </div>
         </div>

         <div style={{ marginTop: "80px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", fontWeight: 700 }}>© 2026 YatraTrek HQ // Global Operations</div>
            <div style={{ display: "flex", gap: "20px" }}>
               <span style={{ fontSize: "11px", color: "#f97316", fontWeight: 900 }}>v4.2.0-STABLE</span>
            </div>
         </div>
      </div>

      <style>{`
        .pulse-dot { width: 10px; height: 10px; border-radius: 50%; background: #f97316; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(249, 115, 22, 0); } 100% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0); } }
        .text-gradient { background: linear-gradient(to right, #f97316, #fb923c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        
        @media (max-width: 1100px) {
          .login-container { grid-template-columns: 1fr !important; }
          .visual-side { display: none !important; }
          .form-side { border-left: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Login;