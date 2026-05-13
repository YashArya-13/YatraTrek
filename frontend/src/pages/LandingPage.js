import React, { useState, useEffect } from "react";
import api from "../api";

// ── Ultra-Modern Components ────────────────────────────────────────────────

const BentoItem = ({ title, subtitle, icon, className, delay }) => (
  <div className={`bento-item ${className}`} style={{ animation: `fadeInUp 0.8s ease-out ${delay}s both` }}>
    <div className="neural-line" style={{ top: '10%' }} />
    <div style={{ fontSize: "40px", marginBottom: "20px" }}>{icon}</div>
    <h3 style={{ fontSize: "24px", fontWeight: "800", color: "#fff", marginBottom: "10px" }}>{title}</h3>
    <p style={{ color: "var(--text-secondary)", fontSize: "15px", lineHeight: "1.6" }}>{subtitle}</p>
  </div>
);

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0); 
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post("leads/public-lead/", {
        name: form.name,
        email: form.email,
        notes: `AI Hub Inquiry: ${form.message}`
      });
      setStep(3);
    } catch (err) {
      alert("System sync failed. Please retry.");
    }
    setLoading(false);
  };

  return (
    <div style={{ position: "fixed", bottom: "40px", right: "40px", zIndex: 10000 }}>
      {!open && (
        <div
          onClick={() => setOpen(true)}
          style={{ width: "70px", height: "70px", borderRadius: "24px", background: "var(--neural-violet)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)", transition: "0.3s" }}
          className="float-anim"
        >
          <span style={{ fontSize: "30px" }}>🧠</span>
        </div>
      )}

      {open && (
        <div className="glass-card" style={{ width: "380px", height: "500px", borderRadius: "32px", border: "1px solid var(--neural-violet)", display: "flex", flexDirection: "column" }}>
           <div style={{ padding: "20px", borderBottom: "1px solid var(--glass-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 800, fontSize: "14px", letterSpacing: "1px" }}>NEURAL AGENT v1.0</div>
              <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "#fff", fontSize: "24px", cursor: "pointer" }}>×</button>
           </div>
           <div style={{ flex: 1, padding: "24px", display: "flex", flexDirection: "column", gap: "20px", overflowY: "auto" }}>
              <div style={{ background: "var(--glass-white)", padding: "16px", borderRadius: "16px 16px 16px 4px", fontSize: "14px", lineHeight: 1.5 }}>
                 Initializing connection... System ready. How can Y CRM accelerate your growth today?
              </div>

              {step === 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {["System Demo", "API Documentation", "Enterprise Pricing"].map(opt => (
                    <button key={opt} className="btn btn-secondary btn-sm" style={{ borderRadius: "12px", textAlign: "left" }} onClick={() => { setForm({ ...form, message: opt }); setStep(1); }}>
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {step === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Identity verification required. Your name?</div>
                  <input className="form-control" placeholder="Agent Name..." value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} autoFocus onKeyDown={e => e.key === 'Enter' && setStep(2)} />
                </div>
              )}

              {step === 2 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Secure transmission channel (Email)?</div>
                  <input className="form-control" placeholder="Email Address..." value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} autoFocus onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
                  <button className="btn btn-primary" onClick={handleSubmit} disabled={loading} style={{ borderRadius: "12px", background: "var(--neural-violet)", border: "none", color: "#fff" }}>
                    {loading ? "Syncing..." : "Establish Connection"}
                  </button>
                </div>
              )}

              {step === 3 && (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ fontSize: "40px", marginBottom: "20px" }}>⚡</div>
                  <div style={{ fontWeight: 800, fontSize: "18px", marginBottom: "8px" }}>Link Established</div>
                  <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>Our intelligence team will follow up shortly.</p>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-mesh" style={{ color: "#fff", fontFamily: "'Outfit', sans-serif", minHeight: "100vh" }}>
      
      {/* Navigation */}
      <nav style={{ 
        position: "fixed", top: 0, left: 0, width: "100%", zIndex: 1000, 
        padding: scrolled ? "15px 0" : "30px 0",
        background: scrolled ? "rgba(2, 3, 8, 0.8)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        transition: "0.4s"
      }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
             <div style={{ width: "32px", height: "32px", background: "var(--neural-violet)", borderRadius: "8px", boxShadow: "0 0 20px var(--violet-glow)" }} />
             <div style={{ fontSize: "24px", fontWeight: "900", letterSpacing: "-1px" }}>Y CRM</div>
          </div>
          <div style={{ display: "flex", gap: "40px", alignItems: "center" }}>
             <a href="#features" className="nav-link" style={{ fontSize: "14px", fontWeight: "600" }}>Features</a>
             <a href="#vision" className="nav-link" style={{ fontSize: "14px", fontWeight: "600" }}>Vision</a>
             <a href="/login" className="btn btn-primary" style={{ 
               padding: "10px 25px", borderRadius: "12px", background: "#fff", color: "#000", border: "none", fontWeight: "700" 
             }}>Sign In</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: "200px 0 100px", textAlign: "center", position: "relative" }}>
        <div className="container">
           <div className="reveal active">
              <div style={{ 
                display: "inline-block", padding: "8px 16px", background: "rgba(139, 92, 246, 0.1)", 
                border: "1px solid var(--neural-violet)", borderRadius: "100px", color: "var(--neural-violet)",
                fontSize: "12px", fontWeight: "800", letterSpacing: "2px", marginBottom: "30px"
              }}>
                NOW POWERED BY NEURAL ENGINE v2.0
              </div>
              <h1 className="tech-title">
                One Platform. <br />
                <span className="glow-text">Infinite Intelligence.</span>
              </h1>
              <p style={{ maxWidth: "650px", margin: "40px auto 60px", fontSize: "20px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                Y CRM isn't just a database. It's the neural backbone of your entire business operation—from lead capture to global scale.
              </p>
              <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
                 <button className="btn btn-primary" style={{ padding: "20px 50px", borderRadius: "16px", fontSize: "18px", fontWeight: "700", background: "var(--neural-violet)", border: "none", color: "#fff", boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)" }}>
                    Deploy System
                 </button>
                 <button className="btn btn-secondary" style={{ padding: "20px 50px", borderRadius: "16px", fontSize: "18px", fontWeight: "700", background: "rgba(255,255,255,0.05)", color: "#fff" }}>
                    Watch Protocol
                 </button>
              </div>
           </div>
        </div>

        {/* Dynamic Data Visualization (Placeholder for high-end look) */}
        <div style={{ marginTop: "100px", opacity: 0.5 }}>
           <div style={{ height: "400px", width: "100%", background: "linear-gradient(to bottom, transparent, rgba(139, 92, 246, 0.05), transparent)", position: "relative" }}>
              <div className="neural-line" style={{ top: "20%", animationDuration: "5s" }} />
              <div className="neural-line" style={{ top: "40%", animationDuration: "8s", direction: "reverse" }} />
              <div className="neural-line" style={{ top: "60%", animationDuration: "4s" }} />
           </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" style={{ padding: "100px 0" }}>
        <div className="container">
           <div style={{ marginBottom: "80px" }}>
              <h2 style={{ fontSize: "48px", fontWeight: "900", marginBottom: "20px" }}>Engineered for <br /><span className="text-gradient">Performance</span></h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "18px" }}>A modular ecosystem built to scale with your ambition.</p>
           </div>

           <div className="bento-grid">
              <BentoItem 
                className="bento-large"
                delay={0}
                icon="⚡"
                title="Lead Intelligence"
                subtitle="Our neural engine automatically scores and qualifies leads in real-time, ensuring your team only focuses on high-value opportunities."
              />
              <BentoItem 
                delay={0.1}
                icon="🛡️"
                title="RBAC Security"
                subtitle="Granular role-based access control for global teams."
              />
              <BentoItem 
                delay={0.2}
                icon="📊"
                title="Neural Analytics"
                subtitle="Predictive revenue modeling and trend detection."
              />
              <BentoItem 
                className="bento-wide"
                delay={0.3}
                icon="🛰️"
                title="Global Sync"
                subtitle="Zero-latency data synchronization across all your business touchpoints and public interfaces."
              />
              <BentoItem 
                delay={0.4}
                icon="🤖"
                title="Auto-Workflow"
                subtitle="Automated credentialing and SMTP protocols."
              />
              <BentoItem 
                delay={0.5}
                icon="💎"
                title="Premium UI"
                subtitle="A cockpit designed for clarity, speed, and precision."
              />
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "100px 0 60px", borderTop: "1px solid var(--glass-border)" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "40px" }}>
           <div>
              <div style={{ fontSize: "28px", fontWeight: "900", marginBottom: "15px" }}>Y CRM</div>
              <p style={{ color: "var(--text-muted)", maxWidth: "300px", fontSize: "14px" }}>
                The next generation of business intelligence. Built for the modern enterprise.
              </p>
           </div>
           <div style={{ display: "flex", gap: "60px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px" }}>
                 <span style={{ color: "#fff", fontWeight: "800" }}>System</span>
                 <span>API</span><span>Security</span><span>Global</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px" }}>
                 <span style={{ color: "#fff", fontWeight: "800" }}>Company</span>
                 <span>Vision</span><span>Log</span><span>Legal</span>
              </div>
           </div>
        </div>
      </footer>

      <Chatbot />

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 30px; }
        .nav-link { text-decoration: none; color: var(--text-secondary); transition: 0.3s; }
        .nav-link:hover { color: #fff; }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}
