import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import PublicNav from "../components/PublicNav";
import Footer from "../components/Footer";

/* ── UI Components ── */

const ExpeditionCard = ({ trek, delay }) => {
  const navigate = useNavigate();
  const fallbackImg = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b";
  const [imgSrc, setImgSrc] = useState(trek.images?.length > 0 ? trek.images[0] : fallbackImg);

  return (
    <div 
      onClick={() => navigate(`/hotel/${trek.id}`)}
      className="exp-card glass-card"
      style={{
        position: "relative", 
        height: "clamp(400px, 50vh, 550px)", 
        borderRadius: "var(--radius-xl)", 
        overflow: "hidden",
        cursor: "pointer",
        animationDelay: `${delay}s`
      }}
    >
      <img 
        src={imgSrc} 
        onError={() => setImgSrc(fallbackImg)}
        alt={trek.name} 
        style={{ width: "100%", height: "100%", objectFit: "cover", transition: "0.8s cubic-bezier(0.16, 1, 0.3, 1)" }} 
        className="card-img"
      />
      {/* Card Content */}
      <div className="card-content" style={{ position: "absolute", bottom: "clamp(24px, 5%, 48px)", left: "clamp(24px, 5%, 48px)", right: "clamp(24px, 5%, 48px)", zIndex: 2 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "24px" }}>
           <span className="glass-panel text-overline" style={{ padding: "8px 16px", color: "#fff" }}>{trek.region}</span>
           <span className="text-overline" style={{ padding: "8px 16px", background: "rgba(249, 115, 22, 0.15)", borderRadius: "24px", color: "#f97316", border: "1px solid rgba(249, 115, 22, 0.2)" }}>{trek.difficulty_display}</span>
        </div>
        <h3 className="display-3" style={{ color: "#fff", marginBottom: "12px" }}>{trek.name}</h3>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px", flexWrap: "wrap", gap: "16px" }}>
           <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "18px" }}>⏱️</span>
              <span className="text-sm" style={{ color: "rgba(255,255,255,0.6)", fontWeight: "700" }}>{trek.duration_days} Day Expedition</span>
           </div>
           <div style={{ textAlign: "right" }}>
              <div className="text-overline" style={{ color: "var(--accent-primary)", marginBottom: "4px" }}>Starting From</div>
              <span style={{ fontSize: "28px", fontWeight: "950", color: "#fff" }}>₹{trek.price_min?.toLocaleString()}</span>
           </div>
        </div>
      </div>

      <style>{`
        .exp-card:hover img { transform: scale(1.1) rotate(1deg); }
        .exp-card:hover .card-overlay { background: linear-gradient(to top, rgba(249, 115, 22, 0.4) 0%, rgba(2, 6, 23, 0.6) 100%); }
        .exp-card:hover { transform: translateY(-15px) !important; border-color: rgba(249, 115, 22, 0.3); }
        @media (max-width: 640px) {
          .exp-card { height: 450px !important; }
        }
      `}</style>
    </div>
  );
};

export default function HotelLanding() {
  const [treks, setTreks] = useState([]);
  const [activeRegion, setActiveRegion] = useState("Uttarakhand");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`hotels/?city=${activeRegion}`).then(r => setTreks(r.data.results || []));
  }, [activeRegion]);

  const handleMouseMove = (e) => {
    if (window.innerWidth < 768) return;
    setMousePos({
      x: (e.clientX / window.innerWidth - 0.5) * 40,
      y: (e.clientY / window.innerHeight - 0.5) * 40
    });
  };

  return (
    <div onMouseMove={handleMouseMove} style={{ background: "#020617", minHeight: "100vh", color: "#fff", overflowX: "hidden" }}>
      <PublicNav activeItem="Expeditions" />
      
      {/* ── Immersive Hero Section ── */}
      <section className="section" style={{ height: "100vh", minHeight: "700px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 5%" }}>
        
        {/* Animated Background Layers */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden" }}>
           <img 
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b" 
              alt="Hero" 
              style={{ 
                width: "110%", height: "110%", objectFit: "cover", opacity: 0.3,
                transform: `translate(${mousePos.x * -0.5}px, ${mousePos.y * -0.5}px)`,
                transition: "0.1s linear"
              }} 
           />
           <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center, transparent 0%, #020617 100%)" }} />
           <div className="topographic-bg" style={{ position: "absolute", inset: 0, opacity: 0.3 }} />
        </div>

        {/* Floating Decorative Elements */}
        <div className="desktop-only" style={{ 
          position: "absolute", top: "20%", left: "10%", width: "300px", height: "300px", 
          background: "radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)", 
          filter: "blur(50px)", animation: "float 8s ease-in-out infinite" 
        }} />
        <div className="desktop-only" style={{ 
          position: "absolute", bottom: "20%", right: "10%", width: "400px", height: "400px", 
          background: "radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)", 
          filter: "blur(60px)", animation: "float 12s ease-in-out reverse infinite" 
        }} />

        <div style={{ zIndex: 1, maxWidth: "1200px", transform: `translate(${mousePos.x}px, ${mousePos.y}px)`, transition: "0.2s cubic-bezier(0.16, 1, 0.3, 1)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", padding: "10px 24px", borderRadius: "100px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", marginBottom: "40px" }}>
             <span className="animate-pulse-glow" style={{ width: 8, height: 8, borderRadius: "50%", background: "#f97316" }} />
             <span className="text-overline" style={{ color: "rgba(255,255,255,0.5)" }}>Peak Performance Protocol Engaged</span>
          </div>
          <h1 className="display-1" style={{ color: "#fff", marginBottom: "40px", textShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
            SCALE THE <br/> <span className="text-gradient" style={{ animation: "float 10s ease-in-out infinite" }}>INFINITE.</span>
          </h1>
          <p className="text-xl" style={{ color: "rgba(255,255,255,0.4)", maxWidth: "800px", margin: "0 auto 60px", lineHeight: 1.6, fontWeight: 500 }}>
            The world's most sophisticated expedition management platform. High-altitude logistics, real-time telemetry, and elite mountain leadership.
          </p>
          <div style={{ display: "flex", gap: "24px", justifyContent: "center", flexWrap: "wrap" }}>
             <button 
                className="btn btn-primary" 
                style={{ padding: "20px 50px", borderRadius: "20px" }}
                onClick={() => document.getElementById("destinations")?.scrollIntoView({ behavior: "smooth" })}
             >
                Launch Expedition
             </button>
             <button 
                className="btn btn-secondary" 
                style={{ padding: "20px 50px", borderRadius: "20px" }}
                onClick={() => navigate("/journal")}
             >
                Explore Archives
             </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="desktop-only" style={{ position: "absolute", bottom: "60px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", opacity: 0.5 }}>
           <div style={{ width: "1px", height: "80px", background: "linear-gradient(to bottom, var(--accent-primary), transparent)" }} />
           <span className="text-overline" style={{ fontSize: "10px" }}>Scroll to Descent</span>
        </div>
      </section>
      
      {/* ── Section Transition Divider ── */}
      <div style={{ height: "200px", background: "linear-gradient(to bottom, #020617, #0a0f1e)", position: "relative", overflow: "hidden" }}>
         <svg viewBox="0 0 1440 320" style={{ position: "absolute", bottom: 0, width: "100%", height: "100%", transform: "scaleY(1.5)" }}>
            <path fill="rgba(249,115,22,0.03)" d="M0,192L48,176C96,160,192,128,288,128C384,128,480,160,576,186.7C672,213,768,235,864,224C960,213,1056,171,1152,144C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
         </svg>
      </div>

      {/* ── Selection Hub ── */}
      <section id="destinations" className="section container">
        
        {/* Topographic Background Overlay */}
        <div className="topographic-bg" style={{ position: "absolute", inset: 0, opacity: 0.1, pointerEvents: "none" }} />

        <div className="hub-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "100px", position: "relative", zIndex: 1, flexWrap: "wrap", gap: "40px" }}>
           <div style={{ flex: "1", minWidth: "300px" }}>
             <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 2, background: "var(--accent-primary)" }} />
                <span className="text-overline" style={{ color: "var(--accent-primary)", letterSpacing: "4px" }}>Deployment Zones</span>
             </div>
             <h2 className="display-2" style={{ marginBottom: "20px" }}>SELECT YOUR <br/> <span className="text-gradient">BASE CAMP.</span></h2>
             <p className="text-xl" style={{ color: "var(--text-secondary)", maxWidth: "600px" }}>Strategically mapped routes across the most formidable peaks of the Indian subcontinent.</p>
           </div>
           <div style={{ display: "flex", background: "rgba(255,255,255,0.02)", padding: "8px", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(10px)", flexWrap: "wrap", justifyContent: "center" }}>
              {["Uttarakhand", "Himachal", "Ladakh"].map(reg => (
                <button 
                  key={reg} 
                  onClick={() => setActiveRegion(reg)}
                  style={{ 
                    padding: "16px clamp(20px, 4vw, 40px)", borderRadius: "100px", border: "none", cursor: "pointer", fontSize: "15px", fontWeight: "800",
                    background: activeRegion === reg ? "var(--accent-primary)" : "transparent",
                    color: activeRegion === reg ? "#fff" : "rgba(255,255,255,0.3)",
                    transition: "0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    boxShadow: activeRegion === reg ? "0 10px 20px rgba(249,115,22,0.3)" : "none"
                  }}
                >{reg}</button>
              ))}
           </div>
        </div>

        <div className="grid grid-cols-3">
           {treks.map((t, i) => (
             <ExpeditionCard key={t.id} trek={t} delay={i * 0.15} />
           ))}
        </div>
      </section>

      {/* ── Advanced Intelligence Section ── */}
      <section className="section" style={{ background: "linear-gradient(to bottom, #0a0f1e, #020617)" }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "clamp(40px, 8vw, 120px)", alignItems: "center" }}>
           <div className="animate-fade">
              <div className="text-overline" style={{ color: "#f97316", letterSpacing: "5px", marginBottom: "24px" }}>Operational Excellence</div>
              <h2 className="display-2" style={{ marginBottom: "40px" }}>LOGISTICS <br/> <span className="text-gradient">REDESIGNED.</span></h2>
              <p className="text-lg" style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "60px" }}>
                Our proprietary AI-driven logistics system ensures safety and optimization in the world's most hostile environments. Every ascent is backed by real-time satellite telemetry.
              </p>
              
              <div className="grid grid-cols-2" style={{ gap: "var(--space-lg)" }}>
                 {[
                   { t: "Live Telemetry", d: "Satellite-synced tracking for every squad.", i: "📡" },
                   { t: "Elite Command", d: "IFMGA certified leadership on every peak.", i: "🏔️" },
                   { t: "Oxygen Sync", d: "Real-time vitals monitoring via wearable tech.", i: "🫁" },
                   { t: "Weather Matrix", d: "Predictive modeling for safe summit windows.", i: "⚡" }
                 ].map((feat, i) => (
                   <div key={i} className="glass-card" style={{ padding: "var(--space-lg)" }}>
                      <div style={{ fontSize: "32px", marginBottom: "16px" }}>{feat.i}</div>
                      <div style={{ fontWeight: "900", fontSize: "18px", color: "#fff", marginBottom: "12px", letterSpacing: "-0.5px" }}>{feat.t}</div>
                      <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{feat.d}</p>
                   </div>
                 ))}
              </div>
           </div>

           <div style={{ position: "relative" }}>
              {/* Complex Graphic Container */}
              <div className="desktop-only" style={{ 
                position: "absolute", inset: "-40px", borderRadius: "60px", 
                border: "2px solid rgba(249,115,22,0.1)", animation: "rotate 20s linear infinite",
                zIndex: 0
              }} />
              
              <div style={{ position: "relative", height: "clamp(400px, 60vh, 750px)", borderRadius: "var(--radius-xl)", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", zIndex: 1, boxShadow: "0 50px 100px rgba(0,0,0,0.6)" }}>
                 <img src="https://images.unsplash.com/photo-1551632811-561732d1e306" alt="Route" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.8 }} />
                 
                 {/* Holographic HUD Elements */}
                 <div style={{ position: "absolute", inset: 0, background: "rgba(2, 6, 23, 0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div className="glass-panel animate-pulse-glow" style={{ padding: "clamp(24px, 5vw, 50px)", background: "rgba(2, 6, 23, 0.8)", backdropFilter: "blur(40px)", border: "2px solid rgba(249, 115, 22, 0.5)", textAlign: "center", position: "relative", maxWidth: "90%" }}>
                       <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "2px", background: "var(--accent-primary)", animation: "scanline 3s linear infinite" }} />
                       <div className="text-overline" style={{ color: "#f97316", marginBottom: "16px", letterSpacing: "4px" }}>SATELLITE UPLINK ACTIVE</div>
                       <div className="display-3" style={{ color: "#fff", letterSpacing: "-1px" }}>ANALYZING SUMMIT <br/> GRADIENT...</div>
                       <div style={{ marginTop: "24px", fontSize: "10px", color: "rgba(255,255,255,0.4)", fontWeight: 800 }}>8848M // WIND 12KM/H // TEMP -24C</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes revealUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 992px) {
          .desktop-only { display: none !important; }
        }
      `}</style>
    </div>
  );
}
