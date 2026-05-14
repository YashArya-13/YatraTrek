import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api";
import PublicNav from "../components/PublicNav";
import Footer from "../components/Footer";

/* ── UI Components ────────────────────────────────────── */

const TrekCard = ({ trek, delay }) => {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => navigate(`/trek/${trek.id}`)}
      style={{
        display: "flex", gap: "0", borderRadius: "24px", overflow: "hidden",
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
        cursor: "pointer", transition: "0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        marginBottom: "24px", opacity: 0, transform: "translateY(30px)",
        animation: `revealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s forwards`
      }}
      className="interactive-card"
    >
      <div style={{ width: "380px", minHeight: "280px", flexShrink: 0, overflow: "hidden", position: "relative" }}>
        <img src={trek.images?.[0] || ""} alt={trek.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "0.6s" }}
        />
        {trek.is_featured && (
          <div style={{
            position: "absolute", top: "20px", left: "20px",
            background: "#f97316", color: "#fff", fontSize: "10px", fontWeight: "900",
            padding: "6px 14px", borderRadius: "8px", textTransform: "uppercase", letterSpacing: "2px",
            boxShadow: "0 10px 20px rgba(249,115,22,0.3)"
          }}>Trending</div>
        )}
      </div>

      <div style={{ flex: 1, padding: "32px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "11px", color: "#f97316", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px" }}>
               {trek.difficulty_display} Difficulty
            </span>
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", fontWeight: "600" }}>{trek.region}</span>
          </div>
          <h2 style={{ fontSize: "28px", fontWeight: "900", color: "#fff", marginBottom: "10px", letterSpacing: "-1px" }}>{trek.name}</h2>
          <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
             <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>🏔️ {trek.max_altitude}m</div>
             <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>⏱️ {trek.duration_days} Days</div>
             <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>🗓️ {trek.best_season}</div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {(trek.amenities || []).slice(0, 6).map((a, i) => (
              <span key={i} style={{
                fontSize: "10px", padding: "5px 12px", borderRadius: "6px",
                background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(255,255,255,0.06)", fontWeight: "600"
              }}>{a}</span>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              color: "#fff", padding: "8px 12px", borderRadius: "100px", fontSize: "16px", fontWeight: "900",
            }}>{trek.avg_rating}</div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "800", color: "#fff" }}>Verified Base</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{trek.total_reviews} reviews</div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}>Starts from</div>
            <div style={{ fontSize: "32px", fontWeight: "900", color: "#fff", lineHeight: 1 }}>₹{trek.price_min?.toLocaleString()}</div>
          </div>
        </div>
      </div>
      <style>{`
        .interactive-card:hover { border-color: #f97316; transform: translateX(10px); }
        .interactive-card:hover img { transform: scale(1.05); }
        @keyframes revealUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default function TrekListing() {
  const [searchParams] = useSearchParams();
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    sort: searchParams.get("sort") || "featured",
    difficulty: searchParams.get("difficulty") || "",
    region: searchParams.get("region") || "",
  });

  const city = searchParams.get("city") || "";

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (filters.sort) params.set("sort", filters.sort);
    if (filters.difficulty) params.set("difficulty", filters.difficulty);
    if (filters.region) params.set("region", filters.region);

    api.get(`treks/?${params.toString()}`).then(r => {
      setTreks(r.data.results || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [city, filters]);

  return (
    <div style={{ background: "#050505", color: "#fff", fontFamily: "'Outfit', sans-serif", minHeight: "100vh" }}>
      
      <PublicNav activeItem="Expeditions" />

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "60px 40px", display: "grid", gridTemplateColumns: "300px 1fr", gap: "60px" }}>
        
        <aside style={{ position: "sticky", top: "120px", height: "fit-content" }}>
          <div style={{ marginBottom: "40px" }}>
            <h1 style={{ fontSize: "40px", fontWeight: 950, letterSpacing: "-2px", marginBottom: "8px" }}>Treks</h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "15px" }}>{treks.length} expeditions found</p>
          </div>

          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "24px", padding: "30px" }}>
            <div style={{ marginBottom: "30px" }}>
              <label style={{ fontSize: "10px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "2px", color: "#f97316", display: "block", marginBottom: "12px" }}>Region</label>
              <select 
                value={filters.region} 
                onChange={e => setFilters({ ...filters, region: e.target.value })}
                style={{ width: "100%", padding: "12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff", fontSize: "14px", outline: "none", marginBottom: "20px" }}
              >
                <option value="">All Regions</option>
                <option value="Uttarakhand">Uttarakhand</option>
                <option value="Himachal">Himachal</option>
                <option value="Ladakh">Ladakh</option>
              </select>

              <label style={{ fontSize: "10px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "2px", color: "#f97316", display: "block", marginBottom: "12px" }}>Difficulty</label>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { id: "", label: "All Levels" },
                  { id: "easy", label: "Easy" },
                  { id: "moderate", label: "Moderate" },
                  { id: "difficult", label: "Difficult" },
                  { id: "expert", label: "Expert" }
                ].map(d => (
                  <button key={d.id} onClick={() => setFilters({ ...filters, difficulty: d.id })}
                    style={{
                      padding: "12px 16px", borderRadius: "12px", fontSize: "13px", fontWeight: "700", textAlign: "left",
                      border: filters.difficulty === d.id ? "1px solid #f97316" : "1px solid rgba(255,255,255,0.06)",
                      background: filters.difficulty === d.id ? "rgba(249,115,22,0.1)" : "rgba(255,255,255,0.02)",
                      color: filters.difficulty === d.id ? "#f97316" : "rgba(255,255,255,0.5)",
                      cursor: "pointer", transition: "0.3s"
                    }}
                  >{d.label}</button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: "10px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "2px", color: "#f97316", display: "block", marginBottom: "12px" }}>Sort By</label>
              <select 
                value={filters.sort} 
                onChange={e => setFilters({ ...filters, sort: e.target.value })}
                style={{ width: "100%", padding: "12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff", fontSize: "14px", outline: "none" }}
              >
                <option value="featured">Featured</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </aside>

        <main>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ height: "280px", borderRadius: "24px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", animation: "pulse 2s infinite" }} />
              ))}
            </div>
          ) : treks.length === 0 ? (
            <div style={{ textAlign: "center", padding: "100px 0" }}>
               <h2 style={{ fontSize: "32px", fontWeight: "900", marginBottom: "16px" }}>No Treks Found</h2>
               <p style={{ color: "rgba(255,255,255,0.4)" }}>Try another region or adjust your difficulty filter.</p>
            </div>
          ) : (
            treks.map((t, i) => (
              <TrekCard key={t.id} trek={t} delay={i * 0.15} />
            ))
          )}
        </main>
      </div>

      <style>{`
        @keyframes pulse { 0% { opacity: 0.3; } 50% { opacity: 0.1; } 100% { opacity: 0.3; } }
        select option { background: #050505; color: #fff; }
      `}</style>
      <Footer />
    </div>
  );
}
