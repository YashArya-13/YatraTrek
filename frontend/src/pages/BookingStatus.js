import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";

export default function BookingStatus() {
  const { ref } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    api.get(`treks/booking/${ref}/`).then(r => {
      setBooking(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [ref]);

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this luxury booking?")) return;
    setCancelling(true);
    try {
      const res = await api.post(`treks/booking/${ref}/cancel/`);
      setBooking(res.data);
      toast.success("Booking Cancelled");
    } catch (err) {
      toast.error(err.response?.data?.error || "Cannot cancel booking");
    }
    setCancelling(false);
  };

  if (loading) return <div style={{ background: "#050505", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#f97316" }}>Retrieving your reservation...</div>;
  if (!booking) return <div style={{ background: "#050505", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>Reservation not found</div>;

  const statusColors = {
    pending: "#fbbf24",
    confirmed: "#22c55e",
    checked_in: "#3b82f6",
    checked_out: "#a855f7",
    cancelled: "#ef4444",
  };
  const sc = statusColors[booking.status] || "#f97316";

  return (
    <div style={{ background: "#050505", color: "#fff", fontFamily: "'Outfit', sans-serif", minHeight: "100vh", padding: "80px 40px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", animation: "revealUp 0.8s ease-out" }}>
        
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
           <div style={{ width: 80, height: 80, borderRadius: "50%", background: `${sc}15`, border: `2px solid ${sc}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", margin: "0 auto 24px" }}>
             {booking.status === 'confirmed' ? '✓' : '🏨'}
           </div>
           <h1 style={{ fontSize: "40px", fontWeight: 950, letterSpacing: "-2px", marginBottom: "12px" }}>Booking {booking.status_display}</h1>
           <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "16px" }}>Confirmation Reference: <span style={{ color: "#f97316", fontWeight: "900", letterSpacing: "1px" }}>{booking.booking_ref}</span></p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
           <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "32px", padding: "40px" }}>
              <h3 style={{ fontSize: "12px", fontWeight: "900", color: "#f97316", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "24px" }}>Property Details</h3>
              <div style={{ display: "flex", gap: "20px", marginBottom: "24px" }}>
                 <img src={booking.trek_image} alt="" style={{ width: "80px", height: "80px", borderRadius: "16px", objectFit: "cover" }} />
                 <div>
                    <div style={{ fontSize: "18px", fontWeight: "800" }}>{booking.trek_name}</div>
                    <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>{booking.trek_city}</div>
                 </div>
              </div>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#fff", padding: "12px 16px", background: "rgba(255,255,255,0.05)", borderRadius: "12px" }}>
                 {booking.room_type}
              </div>
           </div>

           <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "32px", padding: "40px" }}>
              <h3 style={{ fontSize: "12px", fontWeight: "900", color: "#f97316", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "24px" }}>Guest Details</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                 <div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>Primary Guest</div>
                    <div style={{ fontSize: "16px", fontWeight: "700" }}>{booking.guest_name}</div>
                 </div>
                 <div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>Email Address</div>
                    <div style={{ fontSize: "16px", fontWeight: "700" }}>{booking.guest_email}</div>
                 </div>
              </div>
           </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(40px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "32px", padding: "40px", marginBottom: "40px" }}>
           <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
              {[
                { l: "Check-in", v: booking.check_in },
                { l: "Check-out", v: booking.check_out },
                { l: "Nights", v: booking.nights },
                { l: "Total Paid", v: `₹${booking.total_price?.toLocaleString()}`, c: "#f97316" }
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ fontSize: "10px", fontWeight: "900", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "8px" }}>{item.l}</div>
                  <div style={{ fontSize: "18px", fontWeight: "900", color: item.c || "#fff" }}>{item.v}</div>
                </div>
              ))}
           </div>
        </div>

        <div style={{ display: "flex", gap: "20px" }}>
           <button onClick={() => navigate("/")} style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "18px", borderRadius: "18px", fontWeight: "800", cursor: "pointer" }}>Back to Home</button>
           {booking.status !== 'cancelled' && (
             <button onClick={handleCancel} disabled={cancelling} style={{ flex: 1, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", padding: "18px", borderRadius: "18px", fontWeight: "800", cursor: "pointer" }}>
               {cancelling ? "Processing..." : "Cancel Reservation"}
             </button>
           )}
        </div>

      </div>
      <style>{`
        @keyframes revealUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
