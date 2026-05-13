import React from "react";
import PublicNav from "../components/PublicNav";
import Footer from "../components/Footer";

export default function About() {
  return (
    <div style={{ background: "#020617", minHeight: "100vh", color: "#fff", fontFamily: "'Inter', sans-serif", overflowX: "hidden" }}>
      <PublicNav activeItem="About" />
      
      {/* ── Immersive Hero ── */}
      <section style={{ height: "90vh", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 40px" }}>
         <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b" alt="Mountains" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.2 }} />
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center, transparent 0%, #020617 100%)" }} />
         </div>

         <div style={{ zIndex: 1, maxWidth: "1200px" }} className="animate-fade">
            <div style={{ fontSize: "14px", fontWeight: "900", color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "5px", marginBottom: "32px" }}>Operational Vision</div>
            <h1 style={{ fontSize: "120px", fontWeight: 950, letterSpacing: "-8px", lineHeight: 0.8, color: "#fff", marginBottom: "40px" }}>
               WE DEFINE THE <br/> <span className="text-gradient">NEW FRONTIER.</span>
            </h1>
            <p style={{ fontSize: "22px", color: "rgba(255,255,255,0.5)", maxWidth: "800px", margin: "0 auto", lineHeight: 1.6 }}>
               YatraTrek isn't just an agency. We are an adventure technology firm dedicated to pushing the boundaries of what's possible in the world's most formidable environments.
            </p>
         </div>
      </section>

      {/* ── Core Philosophy ── */}
      <section style={{ padding: "120px 80px", maxWidth: "1600px", margin: "0 auto" }}>
         <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "120px", alignItems: "center" }}>
            <div className="glass-card" style={{ padding: "60px", borderRadius: "40px" }}>
               <h2 style={{ fontSize: "48px", fontWeight: 950, letterSpacing: "-2px", marginBottom: "32px" }}>Strategic <br/> Intelligence.</h2>
               <p style={{ color: "var(--text-secondary)", fontSize: "18px", lineHeight: 1.8, marginBottom: "40px" }}>
                  Founded in 2021 by a collective of high-altitude logistics experts and aerospace engineers, YatraTrek was built to solve the most complex challenges of Himalayan exploration. We combine human intuition with real-time data.
               </p>
               <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  {[
                    { t: "Advanced Logistics", d: "Satellite-optimized supply chains for remote base camps." },
                    { t: "Elite Leadership", d: "IFMGA-certified guides with minimum 10 years of peak experience." },
                    { t: "Zero-Impact Operations", d: "Proprietary waste-management systems protecting fragile ecosystems." }
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: "20px" }}>
                       <div style={{ fontSize: "24px" }}>💎</div>
                       <div>
                          <div style={{ fontWeight: "900", color: "#fff", marginBottom: "4px" }}>{item.t}</div>
                          <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>{item.d}</div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
            <div style={{ position: "relative", height: "700px", borderRadius: "50px", overflow: "hidden", boxShadow: "0 50px 100px rgba(0,0,0,0.5)" }}>
               <img src="https://images.unsplash.com/photo-1551632811-561732d1e306" alt="About" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
               <div style={{ position: "absolute", bottom: "40px", left: "40px", padding: "32px", background: "rgba(2,6,23,0.8)", backdropFilter: "blur(20px)", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ fontSize: "32px", fontWeight: "950", color: "#f97316" }}>2026</div>
                  <div style={{ fontSize: "12px", fontWeight: "800", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "2px" }}>Next Gen Deployment</div>
               </div>
            </div>
         </div>
      </section>

      {/* ── Impact Stats ── */}
      <section style={{ padding: "100px 80px", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
         <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "40px", maxWidth: "1600px", margin: "0 auto" }}>
            {[
              { v: "500+", l: "Successful Summits" },
              { v: "15k+", l: "Trekking Personnel" },
              { v: "0.01%", l: "Incedent Probability" },
              { v: "100%", l: "Solar Powered Base Camps" }
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                 <div style={{ fontSize: "64px", fontWeight: "950", color: "var(--accent-primary)", letterSpacing: "-3px" }}>{s.v}</div>
                 <div style={{ fontSize: "12px", fontWeight: "900", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "2px", marginTop: "8px" }}>{s.l}</div>
              </div>
            ))}
         </div>
      </section>

      {/* ── Sustainability ── */}
      <section style={{ padding: "180px 80px", textAlign: "center" }}>
         <h2 style={{ fontSize: "64px", fontWeight: 950, letterSpacing: "-3px", marginBottom: "40px" }}>THE <span className="text-gradient">LEGACY</span> PROTOCOL.</h2>
         <p style={{ fontSize: "20px", color: "var(--text-secondary)", maxWidth: "900px", margin: "0 auto 80px", lineHeight: 1.8 }}>
            We believe in leaving the mountains better than we found them. Our "Legacy Protocol" involves active reforestation, glacier monitoring, and empowering local communities through high-tech educational initiatives.
         </p>
         <button className="btn btn-primary" style={{ padding: "20px 60px", fontSize: "16px" }}>Download Impact Report 2025</button>
      </section>

      <Footer />
    </div>
  );
}
