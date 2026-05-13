import React, { useEffect, useState } from "react";
import api from "../api";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = () => {
    setLoading(true);
    api.get("invoices/").then(res => setInvoices(res.data)).catch(() => { }).finally(() => setLoading(false));
  };

  const markPaid = async (id) => {
    try {
      await api.patch(`invoices/${id}/mark_paid/`);
      setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: "paid" } : inv));
    } catch { alert("Failed to update status."); }
  };

  const downloadPDF = async (invoice) => {
    const input = document.getElementById(`invoice-card-${invoice.id}`);
    if (!input) return;

    try {
      const canvas = await html2canvas(input, { scale: 2, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_INV-${String(invoice.id).padStart(4, "0")}.pdf`);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = invoices
    .filter(i => filterStatus === "all" || i.status === filterStatus)
    .filter(i => String(i.id).includes(search) || (i.lead_name || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-fade">
      {/* ── Page Header ── */}
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: "24px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{ width: 32, height: 2, background: "var(--accent-primary)" }} />
            <div className="text-overline" style={{ color: "var(--accent-primary)" }}>Financial Systems</div>
          </div>
          <h1 className="display-2">Financial <span className="text-gradient">Operations</span></h1>
          <p className="text-lg" style={{ color: "var(--text-secondary)", marginTop: 8 }}>Track revenue, expedition fees, and outstanding balances.</p>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2" style={{ gap: "24px", marginBottom: "40px" }}>
         <div className="glass-card" style={{ padding: "clamp(24px, 5vw, 32px)" }}>
            <div className="text-overline" style={{ color: "var(--text-muted)", marginBottom: "12px" }}>SETTLED REVENUE</div>
            <div className="display-3" style={{ color: "var(--success)" }}>₹{invoices.filter(i => i.status === "paid").reduce((s, i) => s + parseFloat(i.total), 0).toLocaleString()}</div>
         </div>
         <div className="glass-card" style={{ padding: "clamp(24px, 5vw, 32px)" }}>
            <div className="text-overline" style={{ color: "var(--text-muted)", marginBottom: "12px" }}>PENDING FEES</div>
            <div className="display-3" style={{ color: "var(--warning)" }}>₹{invoices.filter(i => i.status !== "paid").reduce((s, i) => s + parseFloat(i.total), 0).toLocaleString()}</div>
         </div>
      </div>

      {/* ── Filters ── */}
      <div className="glass-card" style={{ padding: "clamp(16px, 3vw, 24px)", marginBottom: "32px", display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
         <div style={{ flex: "1 1 300px", position: "relative" }}>
           <input className="form-control" placeholder="Search invoices..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: "44px", borderRadius: 16 }} />
           <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", opacity: 0.4, fontSize: 18 }}>🔍</span>
         </div>
         <div style={{ display: "flex", gap: "4px", background: "rgba(255,255,255,0.03)", padding: 4, borderRadius: 18, border: "1px solid var(--glass-border)", overflowX: "auto", maxWidth: "100%" }}>
            {["all", "pending", "paid", "overdue"].map(s => (
              <button 
                key={s} 
                onClick={() => setFilterStatus(s)} 
                className="btn"
                style={{ 
                  padding: "8px 16px", 
                  fontSize: 10, 
                  fontWeight: 800,
                  background: filterStatus === s ? "var(--accent-primary)" : "transparent",
                  color: filterStatus === s ? "#fff" : "var(--text-secondary)",
                  borderRadius: 14,
                  border: "none",
                  whiteSpace: "nowrap"
                }}
              >
                {s.toUpperCase()}
              </button>
            ))}
         </div>
      </div>

      {/* ── Invoice List ── */}
      <div className="invoice-view">
        <div className="desktop-only crm-table-container">
          <table className="crm-table">
            <thead>
              <tr>
                <th>INVOICE #</th><th>EXPEDITIONER</th><th>AMOUNT</th><th>STATUS</th><th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(inv => (
                <tr key={inv.id}>
                    <td style={{ fontWeight: "800", color: "var(--accent-primary)" }}>EXP-{String(inv.id).padStart(5, "0")}</td>
                    <td style={{ fontWeight: "600", color: "#fff" }}>{inv.lead_name || "Guest Trekker"}</td>
                    <td style={{ fontWeight: "900", color: "#fff" }}>₹{Number(inv.total).toLocaleString()}</td>
                    <td><span className={`badge badge-${inv.status}`}>{inv.status.toUpperCase()}</span></td>
                    <td>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button className="btn btn-secondary" style={{ padding: "8px 14px", fontSize: 11 }} onClick={() => downloadPDF(inv)}>PDF</button>
                        {inv.status !== "paid" && <button className="btn btn-primary" style={{ padding: "8px 14px", fontSize: 11 }} onClick={() => markPaid(inv.id)}>MARK PAID</button>}
                      </div>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mobile-only" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
           {filtered.map(inv => (
             <div key={inv.id} className="glass-card" style={{ padding: "20px", borderRadius: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                   <span style={{ fontWeight: "800", color: "var(--accent-primary)", fontSize: "12px" }}>EXP-{String(inv.id).padStart(5, "0")}</span>
                   <span className={`badge badge-${inv.status}`}>{inv.status.toUpperCase()}</span>
                </div>
                <div style={{ marginBottom: "20px" }}>
                   <div style={{ fontWeight: "700", color: "#fff", fontSize: "16px" }}>{inv.lead_name || "Guest Trekker"}</div>
                   <div style={{ fontSize: "20px", fontWeight: "900", color: "#fff", marginTop: "4px" }}>₹{Number(inv.total).toLocaleString()}</div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                   <button className="btn btn-secondary" style={{ flex: 1, padding: "10px", fontSize: 12 }} onClick={() => downloadPDF(inv)}>PDF</button>
                   {inv.status !== "paid" && <button className="btn btn-primary" style={{ flex: 1, padding: "10px", fontSize: 12 }} onClick={() => markPaid(inv.id)}>MARK PAID</button>}
                </div>
             </div>
           ))}
        </div>

        {/* Hidden PDF Templates (Keep outside normal flow) */}
        <div style={{ position: "absolute", left: "-9999px", top: 0, opacity: 0, pointerEvents: "none" }}>
           {filtered.map(inv => (
              <div key={`pdf-${inv.id}`} id={`invoice-card-${inv.id}`} style={{
                width: "800px", padding: "80px", background: "#ffffff", color: "#0f172a", fontFamily: "'Inter', sans-serif"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "60px", borderBottom: "8px solid #f97316", paddingBottom: "40px" }}>
                  <div><h1 style={{ fontSize: "40px", fontWeight: "950" }}>YatraTrek</h1><p style={{ fontWeight: "800", textTransform: "uppercase", letterSpacing: "2px" }}>Expedition Fee Invoice</p></div>
                  <div style={{ textAlign: "right" }}>
                    <h2 style={{ fontSize: "30px", fontWeight: "950" }}>TAX INVOICE</h2>
                    <p style={{ fontWeight: "700" }}>#EXP-{String(inv.id).padStart(5, "0")}</p>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "60px" }}>
                   <div style={{ width: "45%" }}><h4 style={{ color: "#f97316", textTransform: "uppercase", fontSize: "12px", marginBottom: "15px" }}>Bill To:</h4><h3 style={{ fontSize: "20px" }}>{inv.lead_name || "Guest Trekker"}</h3></div>
                   <div style={{ width: "45%", textAlign: "right" }}><h4 style={{ color: "#f97316", textTransform: "uppercase", fontSize: "12px", marginBottom: "15px" }}>From HQ:</h4><h3 style={{ fontSize: "20px" }}>YatraTrek Adventures</h3></div>
                </div>
                <div style={{ borderBottom: "2px solid #f1f5f9", paddingBottom: "20px", marginBottom: "30px", display: "flex", justifyContent: "space-between", fontWeight: "700" }}><span>DESCRIPTION</span><span>TOTAL</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "20px", marginBottom: "60px" }}><span>Expedition Participation Fee</span><span>₹{Number(inv.total).toLocaleString()}</span></div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}><div style={{ width: "300px", padding: "24px", background: "#f8fafc", borderRadius: "12px" }}><div style={{ display: "flex", justifyContent: "space-between", fontSize: "24px", fontWeight: "950" }}><span>TOTAL</span><span style={{ color: "#f97316" }}>₹{Number(inv.total).toLocaleString()}</span></div></div></div>
              </div>
           ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: 80, textAlign: "center", color: "var(--text-muted)" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>💰</div>
            <div style={{ fontWeight: 800, fontSize: 18, color: "#fff" }}>No financial records</div>
            <p>Your ledger is currently empty for the selected filters.</p>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 992px) {
          .desktop-only { display: none !important; }
          .mobile-only { display: flex !important; }
        }
      `}</style>
    </div>
  );
}