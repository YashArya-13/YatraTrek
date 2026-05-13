import React from "react";
import PublicNav from "../components/PublicNav";
import Footer from "../components/Footer";

export default function Safety() {
  return (
    <div style={{ background: "#020617", minHeight: "100vh", color: "#fff", fontFamily: "'Inter', sans-serif", overflowX: "hidden" }}>
      <PublicNav activeItem="Safety" />
      
      {/* ── Safety Hero ── */}
      <section style={{ height: "70vh", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
         <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <img src="https://images.unsplash.com/photo-1551830820-330a71b99659" alt="Safety" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.3 }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 0%, #020617 100%)" }} />
         </div>
         <div style={{ zIndex: 1 }} className="animate-fade">
            <h1 style={{ fontSize: "100px", fontWeight: 950, letterSpacing: "-6px", lineHeight: 0.9, color: "#fff", marginBottom: "24px" }}>
               MISSION <span className="text-gradient">SAFETY.</span>
            </h1>
            <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.5)", letterSpacing: "4px", textTransform: "uppercase", fontWeight: "900" }}>
               No Compromise. No Exceptions. No Retreat.
            </p>
         </div>
      </section>

      {/* ── Protocol Section ── */}
      <section style={{ padding: "120px 80px", maxWidth: "1600px", margin: "0 auto" }}>
         <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "100px", alignItems: "start" }}>
            <div>
               <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 40, height: 2, background: "var(--accent-primary)" }} />
                  <span style={{ fontSize: "14px", fontWeight: "900", color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "4px" }}>Protocol Alpha</span>
               </div>
               <h2 style={{ fontSize: "64px", fontWeight: 950, letterSpacing: "-3px", marginBottom: "40px", lineHeight: 0.9 }}>THE SURVIVAL <br/> ARCHITECTURE.</h2>
               <p style={{ fontSize: "20px", color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "60px" }}>
                  At YatraTrek, safety isn't a checklist—it's an engineering problem. We utilize a three-tier redundancy system for every high-altitude mission, ensuring that even in the event of hardware failure, our human protocols provide an unbreakable safety net.
               </p>
               
               <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
                  {[
                    { t: "Tier 1: Satellite Telemetry", d: "Every squad member is equipped with a dual-band satellite beacon, transmitting biometrics and GPS coordinates every 30 seconds to HQ.", i: "📡" },
                    { t: "Tier 2: Medical Vanguard", d: "Every expedition lead is a Wilderness First Responder (WFR). We maintain oxygen reserves and Gamow bags at every base camp.", i: "🏥" },
                    { t: "Tier 3: Aerial Evac Network", d: "We maintain 24/7 standby contracts with regional heli-rescue services for immediate extraction within a 2-hour window.", i: "🚁" }
                  ].map((p, i) => (
                    <div key={i} className="glass-card" style={{ padding: "40px", display: "flex", gap: "32px", alignItems: "start" }}>
                       <div style={{ fontSize: "40px" }}>{p.i}</div>
                       <div>
                          <h4 style={{ fontSize: "22px", fontWeight: "900", color: "#fff", marginBottom: "12px" }}>{p.t}</h4>
                          <p style={{ color: "var(--text-secondary)", fontSize: "16px", lineHeight: 1.6 }}>{p.d}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "40px", position: "sticky", top: "120px" }}>
               <div style={{ height: "500px", borderRadius: "40px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 40px 80px rgba(0,0,0,0.5)" }}>
                  <img src="https://images.unsplash.com/photo-1551632811-561732d1e306" alt="Gear" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
               </div>
               <div className="glass-card" style={{ padding: "48px", background: "rgba(249,115,22,0.05)", borderColor: "rgba(249,115,22,0.2)" }}>
                  <h3 style={{ fontSize: "24px", fontWeight: "900", marginBottom: "20px" }}>Emergency Frequency</h3>
                  <div style={{ fontFamily: "monospace", fontSize: "32px", fontWeight: "950", color: "var(--accent-primary)", marginBottom: "24px" }}>SAT-442.9 MHz</div>
                  <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.5 }}>
                     Dedicated satellite band for emergency extraction. Encrypted channel monitored by YatraTrek Logistics Command 24/7.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* ── Certification Section ── */}
      <section style={{ padding: "140px 80px", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
         <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "56px", fontWeight: 950, letterSpacing: "-3px", marginBottom: "40px" }}>CERTIFIED <span className="text-gradient">OPERATIONS.</span></h2>
            <div style={{ display: "flex", justifyContent: "center", gap: "60px", opacity: 0.6 }}>
               {["IFMGA", "WFR", "NIMS", "IMF"].map(c => (
                 <div key={c} style={{ fontSize: "32px", fontWeight: "950", letterSpacing: "5px" }}>{c}</div>
               ))}
            </div>
            <p style={{ marginTop: "60px", color: "var(--text-secondary)", fontSize: "18px" }}>
               Our guides are vetted through the most rigorous training programs in the world. We don't just follow standards; we set them.
            </p>
         </div>
      </section>

      <Footer />
    </div>
  );
}
