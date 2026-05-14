import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const trekId = searchParams.get("trek");
  const roomId = searchParams.get("room");
  const [dates, setDates] = useState({
    checkIn: searchParams.get("check_in") || new Date().toISOString().split('T')[0],
    checkOut: searchParams.get("check_out") || ""
  });

  const [trek, setTrek] = useState(null);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [guest, setGuest] = useState({ name: "", email: "", phone: "", requests: "", trekkers: 1 });

  useEffect(() => {
    if (!trekId || !roomId) {
      console.error("Missing trekId or roomId");
      navigate("/");
      return;
    }
    Promise.all([
      api.get(`treks/${trekId}/`),
      api.get(`treks/packages/${roomId}/`)
    ]).then(([hRes, rRes]) => {
      setTrek(hRes.data);
      setRoom(rRes.data);
      
      // Calculate initial checkout if not provided
      if (!searchParams.get("check_out")) {
        const duration = hRes.data.duration_days || 5;
        const start = new Date(dates.checkIn);
        const end = new Date(start.getTime() + 86400000 * duration);
        setDates(d => ({ ...d, checkOut: end.toISOString().split('T')[0] }));
      } else {
        setDates(d => ({ ...d, checkOut: searchParams.get("check_out") }));
      }
      
      setLoading(false);
    }).catch(err => {
      console.error("Error loading booking data:", err);
      navigate("/");
    });
  }, [trekId, roomId, navigate]);

  const handleStartDateChange = (val) => {
    if (!val) {
      setDates({ checkIn: "", checkOut: "" });
      return;
    }
    const duration = trek?.duration_days || 5;
    const start = new Date(val);
    if (isNaN(start.getTime())) {
      setDates({ checkIn: val, checkOut: "" });
      return;
    }
    const end = new Date(start.getTime() + 86400000 * duration);
    setDates({
      checkIn: val,
      checkOut: end.toISOString().split('T')[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post("treks/book/", {
        trek_id: trekId,
        room_id: roomId,
        guest_name: guest.name,
        guest_email: guest.email,
        guest_phone: guest.phone,
        check_in: dates.checkIn,
        check_out: dates.checkOut,
        trekkers_count: guest.trekkers,
        special_requests: guest.requests
      });
      toast.success("Expedition Slots Reserved!");
      navigate(`/booking-status/${res.data.booking_ref}`);
    } catch {
      toast.error("Failed to process booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ background: "#050505", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#f97316" }}>Preparing your expedition...</div>;

  const total = room.price_per_person * guest.trekkers;

  return (
    <div style={{ background: "#050505", color: "#fff", fontFamily: "'Outfit', sans-serif", minHeight: "100vh", padding: "80px 40px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 450px", gap: "80px" }}>
        
        <div style={{ animation: "revealUp 0.8s ease-out" }}>
          <h1 style={{ fontSize: "48px", fontWeight: 950, letterSpacing: "-2.5px", marginBottom: "40px" }}>Reserve Your <br /><span style={{ color: "#f97316" }}>Expedition Slots</span></h1>
          
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px" }}>
              <div>
                <label style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "10px" }}>Expedition Start Date</label>
                <input required type="date" value={dates.checkIn} onChange={e => handleStartDateChange(e.target.value)} style={inputStyle} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <label style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "10px" }}>Lead Trekker Name</label>
                <input required placeholder="Your full name" value={guest.name} onChange={e => setGuest({...guest, name: e.target.value})} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "10px" }}>Phone Number</label>
                <input required placeholder="+91" value={guest.phone} onChange={e => setGuest({...guest, phone: e.target.value})} style={inputStyle} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
              <div>
                <label style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "10px" }}>Email Address</label>
                <input required type="email" placeholder="email@example.com" value={guest.email} onChange={e => setGuest({...guest, email: e.target.value})} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "10px" }}>No. of Trekkers</label>
                <input required type="number" min="1" max="10" value={guest.trekkers} onChange={e => setGuest({...guest, trekkers: parseInt(e.target.value)})} style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "10px" }}>Medical & Dietary Notes</label>
              <textarea placeholder="Any medical conditions or food allergies?" rows={4} value={guest.requests} onChange={e => setGuest({...guest, requests: e.target.value})} style={{ ...inputStyle, borderRadius: "20px", resize: "none" }} />
            </div>

            <div style={{ marginTop: "20px", padding: "24px", borderRadius: "20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
               By confirming, you certify that all trekkers are physically fit for high-altitude activities. 
               <br /><br />
               <strong style={{ color: "#fff" }}>Gear rental can be handled at the base camp.</strong>
            </div>

            <button disabled={submitting} type="submit" style={{ 
              background: "#f97316", color: "#fff", border: "none", padding: "20px", 
              borderRadius: "20px", fontSize: "16px", fontWeight: "900", cursor: submitting ? "not-allowed" : "pointer",
              transition: "0.3s", boxShadow: "0 20px 40px rgba(249,115,22,0.2)"
            }}>
              {submitting ? "PROCESSING..." : "CONFIRM EXPEDITION"}
            </button>
          </form>
        </div>

        <aside style={{ animation: "revealUp 0.8s ease-out 0.2s both" }}>
          <div style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(40px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "32px", padding: "40px", position: "sticky", top: "40px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "900", marginBottom: "30px", letterSpacing: "-0.5px" }}>Expedition Summary</h3>
            
            <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
              <img src={trek.images?.[0]} alt="" style={{ width: "80px", height: "80px", borderRadius: "16px", objectFit: "cover" }} />
              <div>
                <div style={{ fontSize: "16px", fontWeight: "800", color: "#fff" }}>{trek.name}</div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>{room.package_type_display} · {trek.duration_days} Days</div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "30px", padding: "20px 0", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
               <div style={{ display: "flex", justifyContent: "space-between" }}>
                 <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>Region</span>
                 <span style={{ fontSize: "14px", fontWeight: "700" }}>{trek.region}</span>
               </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>Dates</span>
                  <span style={{ fontSize: "14px", fontWeight: "700" }}>{dates.checkIn} - {dates.checkOut}</span>
                </div>
               <div style={{ display: "flex", justifyContent: "space-between" }}>
                 <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>Price Per Head</span>
                 <span style={{ fontSize: "14px", fontWeight: "700" }}>₹{room.price_per_person.toLocaleString()}</span>
               </div>
               <div style={{ display: "flex", justifyContent: "space-between" }}>
                 <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>Trekkers Count</span>
                 <span style={{ fontSize: "14px", fontWeight: "700" }}>x {guest.trekkers}</span>
               </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
               <span style={{ fontSize: "18px", fontWeight: "800" }}>Total Cost</span>
               <span style={{ fontSize: "32px", fontWeight: "950", color: "#f97316" }}>₹{total.toLocaleString()}</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", background: "rgba(34,197,94,0.1)", borderRadius: "12px", color: "#22c55e", fontSize: "12px", fontWeight: "700" }}>
               ✓ Certified Trek Leader Assigned
            </div>
          </div>
        </aside>
      </div>

      <style>{`
        @keyframes revealUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "16px 20px", background: "rgba(255,255,255,0.04)", 
  border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", 
  color: "#fff", fontSize: "15px", fontWeight: "500", outline: "none", transition: "0.3s"
};
