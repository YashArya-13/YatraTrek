import React from "react";
import PublicNav from "../components/PublicNav";
import Footer from "../components/Footer";

export default function Journal() {
  const posts = [
    {
      title: "The Silent Ascent: Winter at Kedarkantha.",
      excerpt: "Analyzing the physiological effects of -25°C exposure on expedition squads during the peak winter window.",
      author: "Capt. Aryan Singh",
      date: "Oct 12, 2025",
      img: "https://images.unsplash.com/photo-1551830820-330a71b99659",
      cat: "Field Reports"
    },
    {
      title: "Satellite Connectivity in Deep Canyons.",
      excerpt: "How our new Star-Link integration is bridging the communication gap in the Zanskar Valley.",
      author: "Dr. Elena Vance",
      date: "Sep 28, 2025",
      img: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
      cat: "Technology"
    },
    {
      title: "Sustainable Summitry: The Zero-Waste Protocol.",
      excerpt: "The engineering behind our new biodegradable packaging systems for high-altitude deployment.",
      author: "K. Deshmukh",
      date: "Aug 15, 2025",
      img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
      cat: "Sustainability"
    }
  ];

  return (
    <div style={{ background: "#020617", minHeight: "100vh", color: "#fff", fontFamily: "'Inter', sans-serif", overflowX: "hidden" }}>
      <PublicNav activeItem="Journal" />
      
      <section style={{ padding: "160px 80px 80px", maxWidth: "1600px", margin: "0 auto" }}>
         <div style={{ marginBottom: "100px", textAlign: "center" }}>
            <div style={{ fontSize: "14px", fontWeight: "900", color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "5px", marginBottom: "24px" }}>Expedition Archives</div>
            <h1 style={{ fontSize: "100px", fontWeight: 950, letterSpacing: "-6px", lineHeight: 0.9, marginBottom: "40px" }}>THE <span className="text-gradient">JOURNAL.</span></h1>
            <p style={{ fontSize: "20px", color: "var(--text-secondary)", maxWidth: "800px", margin: "0 auto", lineHeight: 1.6 }}>
               Field reports, technical intelligence, and stories from the cutting edge of Himalayan exploration.
            </p>
         </div>

         {/* Featured Post */}
         <div className="glass-card" style={{ padding: "0", marginBottom: "80px", display: "grid", gridTemplateColumns: "1.2fr 1fr", overflow: "hidden", borderRadius: "50px" }}>
            <div style={{ height: "600px" }}>
               <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4" alt="Featured" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ padding: "80px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
               <div style={{ fontSize: "12px", fontWeight: "900", color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "3px", marginBottom: "20px" }}>Featured Intel</div>
               <h2 style={{ fontSize: "48px", fontWeight: 950, letterSpacing: "-2px", marginBottom: "32px", lineHeight: 1 }}>Mapping the Unmapped: The Upper Spiti Survey.</h2>
               <p style={{ fontSize: "18px", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "40px" }}>
                  Our latest mission utilized drone-based LIDAR to map hidden glacial caves in the Upper Spiti region. Discover how this data is changing our winter route planning.
               </p>
               <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "#334155" }} />
                  <div>
                     <div style={{ fontWeight: "800", color: "#fff" }}>Vikram Rathore</div>
                     <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Expedition Lead // Sep 2025</div>
                  </div>
               </div>
            </div>
         </div>

         {/* Post Grid */}
         <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "40px" }}>
            {posts.map((post, i) => (
              <div key={i} className="glass-card" style={{ padding: "0", borderRadius: "40px", overflow: "hidden", transition: "0.3s" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-10px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                 <div style={{ height: "300px" }}>
                    <img src={post.img} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                 </div>
                 <div style={{ padding: "40px" }}>
                    <div style={{ fontSize: "10px", fontWeight: "900", color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "16px" }}>{post.cat}</div>
                    <h3 style={{ fontSize: "24px", fontWeight: "900", color: "#fff", marginBottom: "20px", lineHeight: 1.2 }}>{post.title}</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "15px", lineHeight: 1.6, marginBottom: "32px" }}>{post.excerpt}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "24px", borderTop: "1px solid var(--glass-border)" }}>
                       <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "700" }}>{post.date}</span>
                       <span style={{ fontSize: "12px", color: "#fff", fontWeight: "800", cursor: "pointer" }}>Read Intel ↗</span>
                    </div>
                 </div>
              </div>
            ))}
         </div>
      </section>

      <Footer />
    </div>
  );
}
