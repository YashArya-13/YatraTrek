import api from "../api";
import Footer from "../components/Footer";
import PublicNav from "../components/PublicNav";
import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

export default function HotelDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [trek, setTrek] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const fallbackImg = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b";

  useEffect(() => {
    console.log(`Fetching trek detail for ID: ${id}`);
    api.get(`hotels/${id}/`).then(r => {
      console.log("Trek data received:", r.data);
      setTrek(r.data);
      setLoading(false);
    }).catch(err => {
      console.error(`Error fetching trek ${id}:`, err);
      setLoading(false);
    });
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return (
    <div style={{ background: "#020617", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#f97316", flexDirection: "column", gap: "20px" }}>
      <div className="loader-ring" />
      <div style={{ fontWeight: "700", letterSpacing: "2px" }}>CONNECTING TO EXPEDITION HQ...</div>
    </div>
  );
  
  if (!trek) return (
    <div style={{ background: "#020617", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff", padding: "40px", textAlign: "center" }}>
      <h2 style={{ fontSize: "40px", fontWeight: "950", marginBottom: "20px" }}>MISSION <span className="text-gradient">ABORTED.</span></h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: "40px" }}>The requested expedition data is unreachable or does not exist.</p>
      <button className="btn btn-primary" onClick={() => window.location.href = "/"}>RETURN TO BASE</button>
    </div>
  );

  const displayImages = trek.images?.length > 0 ? trek.images : [fallbackImg];

  return (
    <div style={{ background: "#020617", color: "#fff", fontFamily: "'Inter', sans-serif", minHeight: "100vh" }}>
      
      {/* ── Immersive Header ── */}
      <section style={{ position: "relative", height: "85vh", overflow: "hidden" }}>
        <img 
          src={displayImages[selectedImg] || displayImages[0]} 
          alt={trek.name} 
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "1.5s cubic-bezier(0.16, 1, 0.3, 1)" }} 
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #020617 0%, transparent 60%)" }} />
        
        <div style={{ position: "absolute", bottom: "60px", left: "80px", display: "flex", gap: "20px", zIndex: 10 }}>
          {displayImages.map((img, i) => (
            <div 
              key={i} 
              onClick={() => setSelectedImg(i)}
              style={{ 
                width: "140px", height: "90px", borderRadius: "20px", overflow: "hidden", 
                cursor: "pointer", border: selectedImg === i ? "3px solid #f97316" : "2px solid transparent",
                opacity: selectedImg === i ? 1 : 0.4, transition: "0.4s",
                boxShadow: selectedImg === i ? "0 10px 30px rgba(249,115,22,0.3)" : "none"
              }}
            >
              <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ))}
        </div>

        <button 
          onClick={() => navigate(-1)}
          style={{ 
            position: "absolute", top: "40px", left: "40px", background: "rgba(255,255,255,0.05)", 
            backdropFilter: "blur(30px)", border: "1px solid rgba(255,255,255,0.1)", 
            color: "#fff", padding: "16px 32px", borderRadius: "100px", cursor: "pointer",
            fontWeight: "800", fontSize: "14px", zIndex: 100, textTransform: "uppercase", letterSpacing: "2px"
          }}
        >← Return</button>
      </section>

      <div style={{ maxWidth: "1500px", margin: "0 auto", padding: "100px 80px", display: "grid", gridTemplateColumns: "1fr 450px", gap: "120px" }}>
        
        <div>
          <div style={{ marginBottom: "100px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "32px" }}>
              <span style={{ fontSize: "14px", fontWeight: "900", color: "#f97316", textTransform: "uppercase", letterSpacing: "4px" }}>
                 {trek.difficulty_display}
              </span>
              <div style={{ width: "80px", height: "1px", background: "rgba(255,255,255,0.1)" }} />
              <span style={{ fontSize: "14px", fontWeight: "900", color: "rgba(255,255,255,0.4)" }}>{trek.region}</span>
            </div>
            <h1 style={{ fontSize: "110px", fontWeight: 950, letterSpacing: "-7px", lineHeight: 0.85, marginBottom: "48px" }}>{trek.name}</h1>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px", marginBottom: "64px" }}>
               {[
                 { l: "MAX ALTITUDE", v: `${trek.max_altitude}m`, i: "🏔️" },
                 { l: "DURATION", v: `${trek.duration_days} Days`, i: "⏱️" },
                 { l: "BASE CAMP", v: trek.base_camp, i: "🏕️" }
               ].map((item, i) => (
                 <div key={i} className="glass-card" style={{ padding: "40px", textAlign: "center" }}>
                    <div style={{ fontSize: "11px", fontWeight: "900", color: "rgba(255,255,255,0.3)", marginBottom: "16px", letterSpacing: "2px" }}>{item.l}</div>
                    <div style={{ fontSize: "28px", fontWeight: "900", color: "#fff" }}>{item.v}</div>
                 </div>
               ))}
            </div>

            <p style={{ fontSize: "24px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, maxWidth: "900px" }}>{trek.description}</p>
          </div>

          {/* ── Route Intelligence ── */}
          <div style={{ marginBottom: "100px" }}>
            <h3 style={{ fontSize: "40px", fontWeight: "950", marginBottom: "60px", letterSpacing: "-2px" }}>Route Intelligence</h3>
            <div style={{ position: "relative", paddingLeft: "80px" }}>
               <div style={{ position: "absolute", left: "24px", top: "10px", bottom: "10px", width: "1px", background: "linear-gradient(to bottom, #f97316, transparent)" }} />
               {(trek.route_plan || []).map((day, i) => (
                 <div key={i} style={{ marginBottom: "64px", position: "relative" }}>
                    <div style={{ position: "absolute", left: "-80px", top: "0", width: "48px", height: "48px", borderRadius: "16px", background: "#f97316", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "900", color: "#fff", boxShadow: "0 10px 30px rgba(249,115,22,0.4)" }}>{day.day}</div>
                    <div style={{ fontSize: "26px", fontWeight: "900", color: "#fff", marginBottom: "12px", letterSpacing: "-1px" }}>{day.title}</div>
                    <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>{day.desc}</p>
                 </div>
               ))}
            </div>
          </div>

          <div id="rooms">
            <h3 style={{ fontSize: "40px", fontWeight: "950", marginBottom: "60px", letterSpacing: "-2px" }}>Expedition Operators</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              {(trek.rooms || []).map((pkg, i) => (
                <div key={pkg.id} className="glass-card" style={{ padding: "50px", display: "grid", gridTemplateColumns: "1fr 280px", gap: "60px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                      <div style={{ width: 40, height: 40, borderRadius: "12px", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>⛺</div>
                      <div>
                        <h4 style={{ fontSize: "28px", fontWeight: "950", color: "#fff", letterSpacing: "-1px" }}>{pkg.camp_details?.name || "Professional Expedition"}</h4>
                        <div style={{ fontSize: "12px", fontWeight: "800", color: "#f97316", textTransform: "uppercase", letterSpacing: "2px" }}>{pkg.camp_details?.specialty || "Elite Operator"}</div>
                      </div>
                    </div>
                    
                    <div style={{ display: "flex", gap: "24px", fontSize: "14px", color: "rgba(255,255,255,0.4)", marginBottom: "32px" }}>
                       <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><span style={{ color: "#fbbf24" }}>★</span> {pkg.camp_details?.rating || "4.8"}</span>
                       <span>•</span>
                       <span>{pkg.camp_details?.experience_years || "15"}+ Years Exp</span>
                       <span>•</span>
                       <span>{pkg.package_type_display}</span>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                       {(pkg.inclusions || []).map((inc, j) => (
                         <span key={j} style={{ 
                           fontSize: "11px", padding: "8px 16px", borderRadius: "10px", 
                           background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", 
                           color: "rgba(255,255,255,0.6)", fontWeight: "700" 
                         }}>✓ {inc}</span>
                       ))}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", display: "flex", flexDirection: "column", justifyContent: "center", borderLeft: "1px solid rgba(255,255,255,0.05)", paddingLeft: "40px" }}>
                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "8px", fontWeight: "700", letterSpacing: "1px" }}>ALL-INCLUSIVE</div>
                    <div style={{ fontSize: "42px", fontWeight: "950", marginBottom: "32px", color: "#fff", letterSpacing: "-2px" }}>₹{pkg.price_per_person.toLocaleString()}</div>
                    <button 
                      onClick={() => navigate(`/booking?hotel=${trek.id}&room=${pkg.id}`)}
                      className="btn btn-primary" style={{ padding: "18px 0", fontSize: "15px", fontWeight: "900" }}
                    >SELECT CAMP</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside style={{ position: "sticky", top: "120px", height: "fit-content" }}>
          <div className="glass-card" style={{ padding: "60px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "48px" }}>
               <div style={{ width: 72, height: 72, borderRadius: 24, background: "linear-gradient(135deg, #f97316, #fb923c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: "950", color: "#fff" }}>{trek.avg_rating}</div>
               <div>
                  <div style={{ fontWeight: "950", fontSize: "22px", letterSpacing: "-1px" }}>Summit Certified</div>
                  <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>{trek.total_reviews} Expedition Reports</div>
               </div>
            </div>
            
            <div style={{ textAlign: "center" }}>
               <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.3)", marginBottom: "40px", lineHeight: 1.8 }}>
                 Expedition slots are dynamic and subject to mountain conditions. Secure your position for the 2026 window.
               </p>
               <button 
                 onClick={() => document.getElementById('rooms').scrollIntoView({ behavior: 'smooth' })}
                 className="btn btn-secondary" style={{ width: "100%", padding: "20px 0", fontSize: "15px" }}
               >CHECK AVAILABILITY</button>
            </div>
          </div>
        </aside>
      </div>

      <style>{`
        .loader-ring { width: 60px; height: 60px; border: 4px solid rgba(249, 115, 22, 0.1); border-top-color: #f97316; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
      <Footer />
    </div>
  );
}
