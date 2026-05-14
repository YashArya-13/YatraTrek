import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PublicNav = ({ activeItem }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav style={{ 
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      padding: scrolled ? "12px 5%" : "20px 5%", display: "flex", justifyContent: "space-between", alignItems: "center",
      background: scrolled ? "rgba(2, 6, 23, 0.85)" : "transparent", 
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
      transition: "0.4s cubic-bezier(0.16, 1, 0.3, 1)"
    }}>
      {/* Logo Section */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", zIndex: 1001 }} onClick={() => navigate("/")}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #f97316, #fb923c)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 24, fontWeight: 950, boxShadow: "0 0 20px rgba(249,115,22,0.3)" }}>Y</div>
        <span style={{ fontSize: 22, fontWeight: 950, letterSpacing: "-1px", color: "#fff" }}>Yatra<span style={{ color: "var(--accent-primary)" }}>Trek</span></span>
      </div>

      {/* Desktop Menu */}
      <div className="nav-links desktop-only" style={{ display: "flex", gap: "40px" }}>
        {["Expeditions", "About", "Safety", "Journal", "Partner"].map(item => (
          <span 
            key={item} 
            className="nav-link"
            style={{ 
                fontSize: "12px", fontWeight: "800", 
                color: item.toLowerCase() === activeItem?.toLowerCase() ? "#fff" : "rgba(255,255,255,0.5)", 
                cursor: "pointer", transition: "0.3s", textTransform: "uppercase", letterSpacing: "1.5px" 
            }} 
            onClick={() => {
              if (item === "Expeditions") {
                  if (window.location.pathname === "/") {
                      document.getElementById("expeditions")?.scrollIntoView({ behavior: "smooth" });
                  } else {
                      navigate("/#expeditions");
                  }
              } else if (item === "Partner") {
                  navigate("/partner-registration");
              } else {
                  navigate(`/${item.toLowerCase()}`);
              }
            }}
          >
            {item}
          </span>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <button 
          className="btn btn-primary desktop-only" 
          style={{ padding: "10px 24px", borderRadius: "100px" }}
          onClick={() => {
              const token = localStorage.getItem("access");
              navigate(token ? "/dashboard" : "/login");
          }}
        >
          Enterprise Uplink
        </button>

        {/* Mobile Toggle */}
        <div 
          className="mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{ cursor: "pointer", display: "none", flexDirection: "column", gap: "6px", zIndex: 1001 }}
        >
          <div style={{ width: "25px", height: "2px", background: "#fff", transition: "0.3s", transform: isMobileMenuOpen ? "rotate(45deg) translate(5px, 6px)" : "none" }} />
          <div style={{ width: "25px", height: "2px", background: "#fff", transition: "0.3s", opacity: isMobileMenuOpen ? 0 : 1 }} />
          <div style={{ width: "25px", height: "2px", background: "#fff", transition: "0.3s", transform: isMobileMenuOpen ? "rotate(-45deg) translate(5px, -6px)" : "none" }} />
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div style={{ 
        position: "fixed", top: 0, left: 0, width: "100%", height: "100vh", 
        background: "rgba(2, 6, 23, 0.98)", backdropFilter: "blur(40px)",
        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "32px",
        zIndex: 1000, transition: "0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        opacity: isMobileMenuOpen ? 1 : 0,
        pointerEvents: isMobileMenuOpen ? "all" : "none",
        transform: isMobileMenuOpen ? "translateY(0)" : "translateY(-10px)"
      }}>
        {["Expeditions", "About", "Safety", "Journal", "Partner"].map(item => (
          <span 
            key={item} 
            className="display-3"
            style={{ color: "#fff", cursor: "pointer" }}
            onClick={() => {
              if (item === "Expeditions") {
                if (window.location.pathname === "/") {
                  document.getElementById("expeditions")?.scrollIntoView({ behavior: "smooth" });
                } else {
                  navigate("/#expeditions");
                }
              } else if (item === "Partner") {
                navigate("/partner-registration");
              } else {
                navigate(`/${item.toLowerCase()}`);
              }
              setIsMobileMenuOpen(false);
            }}
          >
            {item}
          </span>
        ))}
        <button 
          className="btn btn-primary" 
          style={{ width: "240px", marginTop: "20px" }}
          onClick={() => {
            const token = localStorage.getItem("access");
            navigate(token ? "/dashboard" : "/login");
            setIsMobileMenuOpen(false);
          }}
        >
          Enterprise Uplink
        </button>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .nav-links, .desktop-only { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
      `}</style>
    </nav>
  );
};

export default PublicNav;
