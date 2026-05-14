import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

const PartnerRegistration = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    camp_name: "",
    base_camp: "",
    route_details: "",
    subscription_plan: "basic"
  });
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("users/register-camp/", formData);
      setSuccess(true);
      // Auto-login or ask them to login
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || "REGISTRATION FAILURE: PLEASE CHECK YOUR INPUTS");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{
      minHeight: "100vh",
      background: "#020617",
      display: "grid",
      gridTemplateColumns: "1fr 600px",
      fontFamily: "'Inter', sans-serif",
      color: "#fff",
      overflowX: "hidden"
    }}>
      
      {/* ── Visual Side ── */}
      <div className="visual-side" style={{ position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ 
          position: "absolute", inset: 0, 
          background: "radial-gradient(circle at center, rgba(249, 115, 22, 0.1) 0%, transparent 70%)",
          zIndex: 1
        }} />
        <img 
          src="https://images.unsplash.com/photo-1522163182402-834f871fd851?w=1200" 
          alt="Expedition Camp" 
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.3, position: "absolute", zIndex: 0 }} 
        />
        
        <div style={{ zIndex: 2, textAlign: "left", padding: "clamp(24px, 5vw, 80px)", maxWidth: "800px" }}>
           <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", padding: "10px 24px", borderRadius: "100px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", marginBottom: "40px", backdropFilter: "blur(10px)" }}>
              <span className="pulse-dot" />
              <span className="text-overline" style={{ color: "#f97316" }}>Partner Network Expansion</span>
           </div>
           <h1 className="display-1" style={{ marginBottom: "32px", fontSize: "clamp(48px, 6vw, 90px)" }}>JOIN THE <br/> <span className="text-gradient">ALLIANCE.</span></h1>
           <p className="text-xl" style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.6, marginBottom: "60px" }}>
             Equip your expedition company with enterprise-grade logistics tracking, global distribution, and professional CRM capabilities.
           </p>

           <div className="grid grid-cols-2" style={{ gap: "32px", marginBottom: "64px" }}>
              {[
                { l: "Reach", v: "Global", d: "Trekkers Network" },
                { l: "Tools", v: "CRM", d: "Logistics Dashboard" },
                { l: "Growth", v: "2.4x", d: "Average Booking Lift" },
                { l: "Support", v: "24/7", d: "Satellite Uplink" }
              ].map((s, i) => (
                <div key={i} style={{ borderLeft: "2px solid rgba(249, 115, 22, 0.3)", paddingLeft: "20px" }}>
                   <div className="text-overline" style={{ color: "rgba(255,255,255,0.3)" }}>{s.l}</div>
                   <div style={{ fontSize: "24px", fontWeight: "950", color: "#fff", margin: "4px 0" }}>{s.v}</div>
                   <div style={{ fontSize: "11px", color: "#f97316", fontWeight: 700 }}>{s.d}</div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* ── Interaction Side (Registration Form) ── */}
      <div className="form-side" style={{ background: "#0a0f1e", borderLeft: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", padding: "clamp(24px, 10%, 80px)", overflowY: "auto" }}>
         <div style={{ marginBottom: "40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }} onClick={() => navigate("/")}>
               <div style={{ width: 40, height: 40, borderRadius: 12, background: "#f97316", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: 20 }}>Y</div>
               <div style={{ fontWeight: "950", fontSize: 24, letterSpacing: "-1px" }}>Yatra<span style={{ color: "#f97316" }}>Trek</span></div>
            </div>
            <button 
               onClick={() => navigate("/login")}
               className="btn btn-secondary"
               style={{ padding: "10px 20px", borderRadius: "100px", fontSize: "12px", border: "1px solid rgba(255,255,255,0.1)" }}
            >Existing Partner Login</button>
         </div>

         <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: "480px", margin: "0 auto", width: "100%" }}>
            
            {success ? (
               <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ fontSize: "64px", marginBottom: "24px" }}>🛰️</div>
                  <h2 className="display-3" style={{ marginBottom: "16px", color: "#10b981" }}>Uplink Established</h2>
                  <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "32px", fontSize: "16px" }}>
                    Your camp has been successfully registered to the YatraTrek Intelligence Network. Redirecting to operational command...
                  </p>
                  <div className="loader-ring" style={{ margin: "0 auto", borderColor: "rgba(16, 185, 129, 0.1)", borderTopColor: "#10b981" }} />
               </div>
            ) : (
               <>
                  <h2 className="display-3" style={{ marginBottom: "12px" }}>Register Camp.</h2>
                  <p className="text-sm" style={{ color: "var(--text-secondary)", marginBottom: "40px" }}>Step {step} of 2: {step === 1 ? 'Command Identity' : 'Logistics Profile'}</p>

                  {error && (
                    <div style={{ background: "rgba(239, 68, 68, 0.1)", borderLeft: "4px solid #ef4444", padding: "20px", color: "#ef4444", fontWeight: 800, fontSize: "13px", marginBottom: "32px", borderRadius: "8px" }}>
                      ⚠️ {error}
                    </div>
                  )}

                  <form onSubmit={step === 2 ? handleRegister : (e) => { e.preventDefault(); setStep(2); }} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                     
                     {step === 1 && (
                        <div className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                           <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="text-overline" style={{ color: "rgba(255,255,255,0.3)", display: "block", marginBottom: "12px" }}>Administrator Name</label>
                              <input className="form-control" type="text" placeholder="e.g. mountain_admin" required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} style={{ padding: "18px", background: "rgba(255,255,255,0.02)", fontSize: "15px" }} />
                           </div>
                           <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="text-overline" style={{ color: "rgba(255,255,255,0.3)", display: "block", marginBottom: "12px" }}>Secure Password</label>
                              <input className="form-control" type="password" placeholder="••••••••" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={{ padding: "18px", background: "rgba(255,255,255,0.02)", fontSize: "15px" }} />
                           </div>
                           <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="text-overline" style={{ color: "rgba(255,255,255,0.3)", display: "block", marginBottom: "12px" }}>Contact Email</label>
                              <input className="form-control" type="email" placeholder="hq@yourcamp.com" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ padding: "18px", background: "rgba(255,255,255,0.02)", fontSize: "15px" }} />
                           </div>
                           
                           <button type="submit" className="btn btn-primary" style={{ padding: "20px", fontSize: "15px", fontWeight: "900", borderRadius: "18px", marginTop: "8px", letterSpacing: "1px" }}>
                              PROCEED TO LOGISTICS ➔
                           </button>
                        </div>
                     )}

                     {step === 2 && (
                        <div className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                           <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="text-overline" style={{ color: "rgba(255,255,255,0.3)", display: "block", marginBottom: "12px" }}>Camp Organization Name</label>
                              <input className="form-control" type="text" placeholder="e.g. Himalayan Explorers Ltd." required value={formData.camp_name} onChange={e => setFormData({...formData, camp_name: e.target.value})} style={{ padding: "18px", background: "rgba(255,255,255,0.02)", fontSize: "15px" }} />
                           </div>
                           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                              <div className="form-group" style={{ marginBottom: 0 }}>
                                 <label className="text-overline" style={{ color: "rgba(255,255,255,0.3)", display: "block", marginBottom: "12px" }}>Primary Base Camp</label>
                                 <input className="form-control" type="text" placeholder="e.g. Sankri Village" required value={formData.base_camp} onChange={e => setFormData({...formData, base_camp: e.target.value})} style={{ padding: "18px", background: "rgba(255,255,255,0.02)", fontSize: "15px" }} />
                              </div>
                              <div className="form-group" style={{ marginBottom: 0 }}>
                                 <label className="text-overline" style={{ color: "rgba(255,255,255,0.3)", display: "block", marginBottom: "12px" }}>Primary Route</label>
                                 <input className="form-control" type="text" placeholder="e.g. Kedarkantha Peak" required value={formData.route_details} onChange={e => setFormData({...formData, route_details: e.target.value})} style={{ padding: "18px", background: "rgba(255,255,255,0.02)", fontSize: "15px" }} />
                              </div>
                           </div>

                           <div className="form-group" style={{ marginBottom: 0, marginTop: "8px" }}>
                              <label className="text-overline" style={{ color: "rgba(255,255,255,0.3)", display: "block", marginBottom: "16px" }}>Select Subscription Tier</label>
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                                 {['basic', 'pro', 'enterprise'].map(plan => (
                                    <div 
                                       key={plan}
                                       onClick={() => setFormData({...formData, subscription_plan: plan})}
                                       style={{ 
                                          padding: "16px", borderRadius: "16px", textAlign: "center", cursor: "pointer", transition: "all 0.2s",
                                          border: formData.subscription_plan === plan ? "2px solid #f97316" : "2px solid rgba(255,255,255,0.05)",
                                          background: formData.subscription_plan === plan ? "rgba(249, 115, 22, 0.05)" : "transparent"
                                       }}
                                    >
                                       <div style={{ textTransform: "uppercase", fontSize: "11px", fontWeight: "900", color: formData.subscription_plan === plan ? "#f97316" : "rgba(255,255,255,0.4)", marginBottom: "4px" }}>{plan}</div>
                                       <div style={{ fontSize: "18px", fontWeight: "950", color: formData.subscription_plan === plan ? "#fff" : "rgba(255,255,255,0.6)" }}>
                                          {plan === 'basic' ? 'Free' : plan === 'pro' ? '₹2.9k' : 'Custom'}
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>

                           <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                              <button type="button" onClick={() => setStep(1)} className="btn btn-secondary" style={{ padding: "20px", fontSize: "15px", borderRadius: "18px" }}>
                                 BACK
                              </button>
                              <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1, padding: "20px", fontSize: "15px", fontWeight: "900", borderRadius: "18px", letterSpacing: "1px" }}>
                                 {loading ? "INITIALIZING..." : "SECURE REGISTRATION"}
                              </button>
                           </div>
                        </div>
                     )}
                  </form>
               </>
            )}

         </div>

         <div style={{ marginTop: "40px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", fontWeight: 700 }}>© 2026 YatraTrek HQ // Global Operations</div>
         </div>
      </div>

      <style>{`
        .pulse-dot { width: 10px; height: 10px; border-radius: 50%; background: #f97316; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(249, 115, 22, 0); } 100% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0); } }
        .text-gradient { background: linear-gradient(to right, #f97316, #fb923c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .loader-ring { width: 48px; height: 48px; border: 4px solid rgba(255,255,255,0.1); border-top-color: #fff; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        @media (max-width: 1100px) {
          .login-container { grid-template-columns: 1fr !important; }
          .visual-side { display: none !important; }
          .form-side { border-left: none !important; }
        }
      `}</style>
    </div>
  );
};

export default PartnerRegistration;
