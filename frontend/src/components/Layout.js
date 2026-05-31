import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const userRole = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  const navItems = [
    { name: "Mission Control", path: "/dashboard", icon: "🚀", role: "admin" },
    { name: "Expeditions", path: "/trek-dashboard", icon: "🏔️", roles: ["admin", "manager", "camp_leader"] },
    { name: userRole === "trekker" ? "My Bookings" : "Bookings", path: "/bookings", icon: "📅", roles: ["admin", "manager", "sales", "camp_leader", "trekker"] },
    { name: "Lead Pipeline", path: "/leads", icon: "🎯", roles: ["admin", "manager", "sales"] },
    { name: "Trekkers", path: "/trekkers", icon: "👤", roles: ["admin", "manager", "sales"] },
    { name: "Inventory", path: "/products", icon: "📦", roles: ["admin", "manager", "camp_leader"] },
    { name: "Quotations", path: "/quotations", icon: "📄", roles: ["admin", "manager", "sales"] },
    { name: "Revenue", path: "/revenue", icon: "💰", roles: ["admin", "manager"] },
    { name: "Operational Log", path: "/tasks", icon: "📝", roles: ["admin", "manager", "camp_leader", "sales"] },
    { name: "Access Control", path: "/users", icon: "🛡️", role: "admin" },
  ];

  const filteredNav = navItems.filter(item => {
    if (item.role && item.role !== userRole) return false;
    if (item.roles && !item.roles.includes(userRole)) return false;
    return true;
  });

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    setIsSidebarOpen(false); // Close sidebar on route change
  }, [location.pathname]);

  return (
    <div className="app-container">
      {/* ── Mobile Top Bar ── */}
      <div className="mobile-only" style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 64,
        background: "rgba(15, 23, 42, 0.9)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--glass-border)", zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: "var(--accent-primary)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#fff", fontSize: 16 }}>Y</div>
          <span style={{ fontWeight: 950, color: "#fff", letterSpacing: "-0.5px" }}>Yatra<span style={{ color: "var(--accent-primary)" }}>Trek</span></span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{ background: "transparent", border: "none", color: "#fff", fontSize: 24, cursor: "pointer" }}
        >
          {isSidebarOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* ── Sidebar Overlay (Mobile) ── */}
      {isSidebarOpen && (
        <div 
          className="mobile-only-overlay" 
          onClick={() => setIsSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(2, 6, 23, 0.8)", backdropFilter: "blur(8px)", zIndex: 1001 }}
        />
      )}

      {/* ── Side Navigation ── */}
      <aside className={`app-sidebar ${isSidebarOpen ? "open" : ""}`}>
        {/* Logo Section */}
        <div className="desktop-only" style={{ display: "flex", alignItems: "center", gap: 14, padding: "40px 24px 32px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
          <div className="sidebar-logo">Y</div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 950, letterSpacing: "-1px", color: "#fff", margin: 0 }}>Yatra<span style={{ color: "var(--accent-primary)" }}>Trek</span></h1>
            <div style={{ fontSize: 10, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "2px", marginTop: -2 }}>CRM Platform</div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-nav">
          {filteredNav.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className={`nav-link ${active ? "active" : ""}`}>
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.name}</span>
                {active && <div className="active-dot" />}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="sidebar-footer">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div className="user-avatar">{username?.[0].toUpperCase()}</div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{username}</div>
              <div className="text-overline" style={{ color: "var(--accent-primary)", fontSize: "9px" }}>{userRole}</div>
            </div>
          </div>
          
          <button onClick={handleLogout} className="logout-btn">Terminate Session</button>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="main-content">
        {children}
      </main>

      <style>{`
        .app-sidebar {
          width: 300px; background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(40px);
          border-right: 1px solid var(--glass-border); display: flex; flex-direction: column;
          height: 100vh; position: sticky; top: 0; z-index: 1002; transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .sidebar-logo {
          width: 44px; height: 44px; background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          border-radius: 14px; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 16px rgba(249, 115, 22, 0.3); font-size: 22px; font-weight: 900; color: white;
        }
        .sidebar-nav { flex: 1; overflow-y: auto; padding: 32px 24px; display: flex; flex-direction: column; gap: 6px; }
        .nav-link {
          display: flex; align-items: center; gap: 12px; padding: 14px 20px; border-radius: 16px;
          text-decoration: none; font-size: 14px; font-weight: 600; color: var(--text-secondary);
          transition: 0.3s; border: 1px solid transparent;
        }
        .nav-link:hover { background: rgba(255, 255, 255, 0.03); transform: translateX(4px); color: #fff; }
        .nav-link.active { background: rgba(249, 115, 22, 0.1); color: var(--accent-primary); font-weight: 700; border-color: rgba(249, 115, 22, 0.1); }
        .nav-icon { font-size: 18px; }
        .nav-link:not(.active) .nav-icon { filter: grayscale(1) opacity(0.6); }
        .active-dot { margin-left: auto; width: 6px; height: 6px; border-radius: 50%; background: var(--accent-primary); }
        
        .sidebar-footer { padding: 24px; background: rgba(10, 15, 30, 0.8); border-top: 1px solid var(--glass-border); }
        .user-avatar { 
          width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, #334155, #1e293b);
          display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800; color: var(--text-primary); border: 1px solid var(--glass-border);
        }
        .logout-btn {
          background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2);
          color: #ef4444; border-radius: 12px; padding: 12px; font-size: 11px; font-weight: 900;
          cursor: pointer; transition: 0.3s; text-transform: uppercase; letter-spacing: 1px; width: 100%;
        }
        .logout-btn:hover { background: #ef4444; color: #fff; }

        @media (max-width: 992px) {
          .app-sidebar { position: fixed; left: -300px; }
          .app-sidebar.open { left: 0; }
          .desktop-only { display: none !important; }
          .main-content { padding-top: 80px !important; }
        }
      `}</style>
    </div>
  );
};

export default Layout;