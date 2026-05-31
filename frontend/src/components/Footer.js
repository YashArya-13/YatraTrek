import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer style={{ padding: "clamp(60px, 10vw, 140px) clamp(20px, 5vw, 80px) 80px", borderTop: "1px solid rgba(255,255,255,0.05)", background: "#020617", position: "relative" }}>
       
       {/* Newsletter Glass Card */}
       <div className="glass-card" style={{ maxWidth: "1200px", margin: "clamp(-100px, -15vw, -220px) auto clamp(40px, 8vw, 100px)", padding: "clamp(24px, 5vw, 60px)", textAlign: "center", borderRadius: "40px", position: "relative", zIndex: 10 }}>
          <h3 className="display-3" style={{ marginBottom: "16px" }}>SUBSCRIBE TO <span className="text-gradient">COMMUNICATIONS.</span></h3>
          <p style={{ color: "var(--text-secondary)", marginBottom: "40px", maxWidth: "500px", margin: "0 auto 40px" }}>Receive monthly satellite briefings on route conditions and summit season updates.</p>
          <div style={{ display: "flex", gap: "16px", maxWidth: "600px", margin: "0 auto", flexWrap: "wrap" }}>
             <input className="form-control" placeholder="satellite.uplink@agency.com" style={{ padding: "16px 24px", borderRadius: "18px", flex: "1", minWidth: "200px" }} />
             <button className="btn btn-primary" style={{ padding: "0 40px", borderRadius: "18px", height: "56px" }}>Initialize</button>
          </div>
       </div>

       <div className="grid grid-cols-4" style={{ maxWidth: "1600px", margin: "0 auto 100px", gap: "clamp(40px, 5vw, 80px)" }}>
          <div style={{ gridColumn: "span var(--col-span, 1)" }}>
             <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
                <div style={{ width: 48, height: 48, borderRadius: 16, background: "var(--accent-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 900, color: "#fff", boxShadow: "0 10px 20px rgba(249,115,22,0.3)" }}>Y</div>
                <span style={{ fontSize: "28px", fontWeight: "950", letterSpacing: "-1px" }}>Yatra<span style={{ color: "var(--accent-primary)" }}>Trek</span></span>
             </div>
             <p style={{ color: "var(--text-secondary)", fontSize: "16px", lineHeight: 1.7, marginBottom: "32px" }}>
                Forging the future of high-altitude adventure. We provide the intelligence and leadership required to scale the world's most formidable peaks.
             </p>
              <div style={{ display: "flex", gap: "16px" }}>
                 {[
                    { icon: "🌐", label: "Network" },
                    { icon: "📸", label: "Visuals" },
                    { icon: "🐦", label: "Signals" },
                    { icon: "🎥", label: "Intel" }
                 ].map((s, i) => (
                   <a href="#" key={i} className="social-icon-link" title={s.label}>
                      <span>{s.icon}</span>
                   </a>
                 ))}
              </div>
          </div>
          
          <div className="footer-links">
             <h4 className="text-overline" style={{ color: "#fff", marginBottom: "32px" }}>Expeditions</h4>
             <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "flex-start" }}>
                {["Winter Summits", "Valley Crossings", "Base Camp Treks", "Glacial Routes", "Technical Climbs"].map(link => (
                  <Link to="/treks" key={link} className="footer-link-item">{link}</Link>
                ))}
             </div>
          </div>

          <div className="footer-links">
             <h4 className="text-overline" style={{ color: "#fff", marginBottom: "32px" }}>Intelligence</h4>
             <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "flex-start" }}>
                {["Safety Protocols", "Gear Architecture", "Satellite Tracking", "Weather Matrix", "Training Camps"].map(link => (
                  <Link to="/safety" key={link} className="footer-link-item">{link}</Link>
                ))}
             </div>
          </div>

          <div className="footer-links">
             <h4 className="text-overline" style={{ color: "#fff", marginBottom: "32px" }}>Foundation</h4>
             <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "flex-start" }}>
                {["Our Vision", "Impact 2026", "Leadership", "Press Office", "Carrier Hub"].map(link => (
                  <Link to="/about" key={link} className="footer-link-item">{link}</Link>
                ))}
             </div>
          </div>
       </div>

       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "40px", borderTop: "1px solid rgba(255,255,255,0.05)", flexWrap: "wrap", gap: "24px" }}>
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "13px", fontWeight: 700 }}>© 2026 YatraTrek HQ // All Operations Protected by Blockchain Encryption.</p>
          <div style={{ display: "flex", gap: "clamp(20px, 4vw, 40px)", flexWrap: "wrap" }}>
             {["Privacy Protocol", "Terms of Engagement", "Safety Charter"].map(item => (
               <Link to="/safety" key={item} className="footer-bottom-link">{item}</Link>
             ))}
          </div>
       </div>

       <style>{`
         .grid-cols-4 { grid-template-columns: 2fr 1fr 1fr 1fr; }
         @media (max-width: 1024px) {
           .grid-cols-4 { grid-template-columns: 1fr 1fr; }
           .grid-cols-4 > div:first-child { grid-column: span 2; --col-span: 2; }
         }
         @media (max-width: 640px) {
           .grid-cols-4 { grid-template-columns: 1fr; }
           .grid-cols-4 > div:first-child { grid-column: span 1; --col-span: 1; }
         }
         
         .social-icon-link { width: 44px; height: 44px; border-radius: 12px; background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.3s; text-decoration: none; color: inherit; }
         .social-icon-link:hover { background: rgba(249,115,22,0.1); border-color: rgba(249,115,22,0.3); transform: translateY(-3px); box-shadow: 0 5px 15px rgba(249,115,22,0.2); }
         
         .footer-link-item { color: var(--text-muted); font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); text-decoration: none; display: inline-block; }
         .footer-link-item:hover { color: var(--accent-primary); transform: translateX(5px); }
         
         .footer-bottom-link { color: rgba(255,255,255,0.4); font-size: 13px; font-weight: 700; cursor: pointer; transition: 0.3s; text-decoration: none; }
         .footer-bottom-link:hover { color: #fff; }
       `}</style>
    </footer>
  );
};

export default Footer;
