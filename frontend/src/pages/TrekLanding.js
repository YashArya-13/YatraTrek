import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import PublicNav from "../components/PublicNav";
import Footer from "../components/Footer";

/* ── UI Components ── */

const Snowfall = () => {
  return (
    <div className="snow-container">
      {[...Array(30)].map((_, i) => (
        <div 
          key={i} 
          className="snowflake" 
          style={{
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            animationDuration: `${Math.random() * 10 + 5}s`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: Math.random() * 0.6 + 0.2
          }} 
        />
      ))}
    </div>
  );
};

const ExpeditionCard = ({ trek, delay }) => {
  const navigate = useNavigate();
  const fallbackImg = "/assets/treks/view1.png";
  const [imgSrc, setImgSrc] = useState(trek.images?.length > 0 ? trek.images[0] : fallbackImg);

  return (
    <div 
      onClick={() => navigate(`/trek/${trek.id}`)}
      className="exp-card frost-glass"
      style={{
        position: "relative", 
        height: "clamp(400px, 50vh, 550px)", 
        borderRadius: "24px", 
        overflow: "hidden",
        cursor: "pointer",
        animationDelay: `${delay}s`,
        border: "1px solid rgba(255,255,255,0.1)"
      }}
    >
      <img 
        src={imgSrc} 
        onError={() => setImgSrc(fallbackImg)}
        alt={trek.name} 
        style={{ width: "100%", height: "100%", objectFit: "cover", transition: "1.2s cubic-bezier(0.16, 1, 0.3, 1)" }} 
        className="card-img"
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10, 25, 47, 0.9) 0%, transparent 60%)" }} />
      
      {/* Card Content */}
      <div className="card-content" style={{ position: "absolute", bottom: "32px", left: "32px", right: "32px", zIndex: 2 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px" }}>
           <span style={{ fontSize: "10px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "2px", padding: "6px 14px", background: "rgba(255,255,255,0.1)", color: "#fff", borderRadius: "100px", backdropFilter: "blur(10px)" }}>{trek.region}</span>
           <span style={{ fontSize: "10px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "2px", padding: "6px 14px", background: "rgba(245,158,11,0.2)", color: "var(--accent-secondary)", borderRadius: "100px", border: "1px solid rgba(245,158,11,0.3)" }}>{trek.difficulty_display}</span>
        </div>
        <h3 style={{ fontSize: "32px", fontWeight: "950", color: "#fff", marginBottom: "8px", letterSpacing: "-1.5px" }}>{trek.name}</h3>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px" }}>
           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)", fontWeight: "700" }}>{trek.duration_days} Days in the Wild</span>
           </div>
           <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "10px", fontWeight: "900", color: "var(--accent-primary)", marginBottom: "4px", letterSpacing: "1px" }}>RESERVE AT</div>
              <span style={{ fontSize: "24px", fontWeight: "950", color: "#fff" }}>₹{trek.price_min?.toLocaleString()}</span>
           </div>
        </div>
      </div>

      <style>{`
        .exp-card:hover img { transform: scale(1.08); }
        .exp-card:hover { transform: translateY(-10px); border-color: var(--accent-primary); box-shadow: 0 20px 40px rgba(245,158,11,0.15); }
      `}</style>
    </div>
  );
};

export default function TrekLanding() {
  const [treks, setTreks] = useState([]);
  const [activeRegion, setActiveRegion] = useState("Uttarakhand");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`treks/?region=${activeRegion}`)
      .then(r => setTreks(r.data.results || []))
      .catch(err => {
        console.error("Satellite uplink failure:", err);
        setTreks([]);
      });
  }, [activeRegion]);

  const handleMouseMove = (e) => {
    if (window.innerWidth < 768) return;
    setMousePos({
      x: (e.clientX / window.innerWidth - 0.5) * 30,
      y: (e.clientY / window.innerHeight - 0.5) * 30
    });
  };

  return (
    <div onMouseMove={handleMouseMove} style={{ background: "var(--bg-primary)", minHeight: "100vh", color: "var(--text-primary)", overflowX: "hidden", fontFamily: "'Outfit', sans-serif" }}>
      <PublicNav activeItem="Expeditions" />
      <Snowfall />
      
      {/* ── Immersive Nature Hero ── */}
      <section style={{ height: "100vh", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        
        <div style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden" }}>
           {/* Sun rays animation behind mountains */}
           <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translate(-50%, -50%)", width: "200%", height: "200%", zIndex: 0 }}>
              <div className="sun-rays" />
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center, rgba(251,191,36,0.3) 0%, transparent 60%)" }} />
           </div>
           
           {/* Primary Mountain Image - Clearly Visible */}
           <img 
              src="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&q=80&w=2000" 
              alt="Himalayas at Sunrise" 
              style={{ 
                position: "relative",
                width: "110%", height: "110%", objectFit: "cover", zIndex: 1,
                transform: `translate(${mousePos.x * -0.3}px, ${mousePos.y * -0.3}px)`,
                transition: "0.2s ease-out"
              }} 
           />
           {/* Subtle gradient just to make text readable at bottom, not obscuring the mountains */}
           <div style={{ position: "absolute", inset: 0, zIndex: 2, background: "linear-gradient(to bottom, rgba(10,10,12,0.1) 0%, rgba(10,10,12,0.4) 60%, var(--bg-primary) 100%)" }} />
        </div>

        <div style={{ zIndex: 3, textAlign: "center", maxWidth: "1000px", padding: "0 24px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", padding: "12px 32px", borderRadius: "100px", background: "rgba(10,10,12,0.4)", border: "1px solid rgba(245,158,11,0.3)", backdropFilter: "blur(20px)", marginBottom: "48px", boxShadow: "0 10px 25px rgba(245,158,11,0.2)" }}>
             <span style={{ fontSize: "12px", fontWeight: "900", color: "var(--accent-secondary)", letterSpacing: "3px" }}>FIRST LIGHT PROTOCOL</span>
          </div>
          <h1 style={{ fontSize: "clamp(60px, 12vw, 140px)", fontWeight: 950, letterSpacing: "-0.04em", lineHeight: 0.85, marginBottom: "40px", textShadow: "0 20px 40px rgba(0,0,0,0.8)" }}>
            BEYOND THE <br/> <span style={{ color: "var(--accent-primary)", textShadow: "0 0 40px rgba(245,158,11,0.4)" }}>SUMMIT.</span>
          </h1>
          <p style={{ fontSize: "20px", color: "rgba(255,255,255,0.8)", maxWidth: "700px", margin: "0 auto 64px", lineHeight: 1.6, fontWeight: 500, textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
            Experience the Himalayas illuminated by the first light. Curated expeditions for those who seek the golden hour on the world's highest peaks.
          </p>
          <div style={{ display: "flex", gap: "24px", justifyContent: "center", flexWrap: "wrap" }}>
             <button 
                className="btn btn-primary" 
                style={{ padding: "24px 60px", borderRadius: "20px", fontSize: "16px" }}
                onClick={() => document.getElementById("destinations")?.scrollIntoView({ behavior: "smooth" })}
             >
                Start Your Journey
             </button>
             <button 
                className="btn btn-secondary" 
                style={{ padding: "24px 60px", borderRadius: "20px", fontSize: "16px" }}
                onClick={() => navigate("/journal")}
             >
                The Adventure Log
             </button>
          </div>
          {/* Scroll Indicator */}
          <div className="desktop-only" style={{ position: "absolute", bottom: "60px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", opacity: 0.5 }}>
             <div style={{ width: "1px", height: "80px", background: "linear-gradient(to bottom, #ff7e5f, transparent)" }} />
             <span className="text-overline" style={{ fontSize: "10px" }}>Explore Below</span>
          </div>
        </div>
      </section>
      
      {/* ── Mountain Peak Divider ── */}
      <div className="mountain-divider">
         <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120H1440V40L1320 60L1180 0L1020 80L860 20L680 100L520 10L360 90L180 30L0 120Z" fill="var(--bg-secondary)"/>
         </svg>
      </div>
 
       {/* ── Selection Hub ── */}
       <section id="destinations" style={{ position: "relative", padding: "140px 0", background: "var(--bg-secondary)" }}>
         
         {/* Immersive Background Layer - High Visibility */}
         <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=2000" alt="Alpine Range" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.4 }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, var(--bg-secondary) 0%, rgba(18, 19, 24, 0.4) 40%, var(--bg-primary) 100%)" }} />
         </div>
         
         <div className="container" style={{ position: "relative", zIndex: 1 }}>
           <div className="hub-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "80px", flexWrap: "wrap", gap: "40px", borderBottom: "1px solid var(--border)", paddingBottom: "40px" }}>
              <div style={{ flex: "1", minWidth: "300px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                   <div style={{ width: 40, height: 2, background: "var(--accent-primary)" }} />
                   <span style={{ fontSize: "14px", fontWeight: "900", color: "var(--accent-secondary)", letterSpacing: "5px" }}>THE ALPINE MAP</span>
                </div>
                <h2 style={{ fontSize: "clamp(48px, 6vw, 72px)", fontWeight: 950, marginBottom: "20px", letterSpacing: "-2px", color: "var(--text-primary)", textShadow: "0 10px 30px rgba(0,0,0,0.8)" }}>
                   SELECT YOUR <br/> <span style={{ color: "var(--accent-primary)" }}>BASE CAMP.</span>
                </h2>
                <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.7)", maxWidth: "600px", lineHeight: 1.6, fontWeight: 500, textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
                   Explore hand-picked base camps strategically located across the most formidable and breathtaking ranges of the Indian subcontinent.
                </p>
              </div>
              <div style={{ display: "flex", background: "rgba(10,10,12,0.5)", padding: "10px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)", flexWrap: "wrap", justifyContent: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }}>
                 {["Uttarakhand", "Himachal", "Ladakh"].map(reg => (
                   <button 
                     key={reg} 
                     onClick={() => setActiveRegion(reg)}
                     style={{ 
                       padding: "16px 32px", borderRadius: "16px", border: "none", cursor: "pointer", fontSize: "15px", fontWeight: "800",
                       background: activeRegion === reg ? "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))" : "transparent",
                       color: activeRegion === reg ? "#fff" : "rgba(255,255,255,0.5)",
                       transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                       boxShadow: activeRegion === reg ? "0 10px 20px rgba(245,158,11,0.3)" : "none",
                       letterSpacing: "1px"
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
         </div>
       </section>
 
       {/* ── Alpine Intelligence Section ── */}
       <section className="section" style={{ background: "var(--bg-primary)" }}>
         <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "clamp(40px, 8vw, 120px)", alignItems: "center" }}>
            <div className="animate-fade">
               <div style={{ fontSize: "12px", fontWeight: "900", color: "var(--accent-secondary)", letterSpacing: "5px", marginBottom: "24px" }}>UNCOMPROMISED SAFETY</div>
               <h2 style={{ fontSize: "64px", fontWeight: 950, marginBottom: "40px", letterSpacing: "-3px", color: "var(--text-primary)" }}>WILDERNESS <br/> <span style={{ color: "var(--accent-primary)" }}>COMMAND.</span></h2>
               <p style={{ fontSize: "18px", color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "60px", fontWeight: 500 }}>
                 Our expeditions are built on a foundation of elite mountain expertise and cutting-edge safety protocols. We don't just guide; we lead with precision in the world's most challenging terrains.
               </p>
               
               <div className="grid grid-cols-2" style={{ gap: "24px" }}>
                  {[
                    { t: "Live Comms", d: "Satellite communication for every squad.", i: "📡" },
                    { t: "Expert Guides", d: "IFMGA certified leaders on every peak.", i: "🧗" },
                    { t: "Vitals Sync", d: "Health monitoring for every trekker.", i: "❤️" },
                    { t: "Peak Forecast", d: "Predictive modeling for safe windows.", i: "🏔️" }
                  ].map((feat, i) => (
                    <div key={i} className="frost-glass" style={{ padding: "32px", borderRadius: "24px" }}>
                       <div style={{ fontSize: "32px", marginBottom: "16px" }}>{feat.i}</div>
                       <div style={{ fontWeight: "900", fontSize: "18px", color: "var(--text-primary)", marginBottom: "12px", letterSpacing: "-0.5px" }}>{feat.t}</div>
                       <p className="text-sm" style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>{feat.d}</p>
                    </div>
                  ))}
               </div>
            </div>
 
            <div style={{ position: "relative" }}>
               <div style={{ position: "relative", height: "clamp(400px, 60vh, 750px)", borderRadius: "40px", overflow: "hidden", border: "1px solid var(--border)", zIndex: 1, boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }}>
                  <img src="https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&q=80&w=1200" alt="Golden Alpine View" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }} />
                  
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10, 10, 12, 0.6), transparent)", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: "40px" }}>
                     <div className="frost-glass" style={{ padding: "40px", textAlign: "center", position: "relative", maxWidth: "90%", borderRadius: "32px" }}>
                        <div style={{ fontSize: "12px", fontWeight: "900", color: "var(--accent-secondary)", marginBottom: "16px", letterSpacing: "4px" }}>REAL-TIME ELEVATION</div>
                        <div style={{ fontSize: "40px", fontWeight: "950", color: "var(--text-primary)", letterSpacing: "-2px" }}>ASCENDING TO <br/> NEW HEIGHTS</div>
                        <div style={{ marginTop: "24px", fontSize: "12px", color: "var(--text-secondary)", fontWeight: 800 }}>VIBRANT NATURE // PURE AIR // BEYOND LIMITS</div>
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
