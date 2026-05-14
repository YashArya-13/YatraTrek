import React, { useState, useEffect } from "react";
import api from "../api";


export default function Quotations() {
  const [products, setProducts] = useState([]);
  const [leads, setLeads] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [items, setItems] = useState([{ product: "", qty: 1, price: 0 }]);
  const [selectedLead, setSelectedLead] = useState("");
  const [notes, setNotes] = useState("");
  const [gstRate, setGstRate] = useState(18);
  const [showForm, setShowForm] = useState(false);
  const [shareTarget, setShareTarget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "success" });

  useEffect(() => {
    api.get("products/").then(res => setProducts(res.data)).catch(() => { });
    api.get("leads/").then(res => setLeads(res.data)).catch(() => { });
    loadQuotations();
  }, []);

  const loadQuotations = () => {
    api.get("quotations/").then(res => setQuotations(res.data)).catch(() => { });
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 3500);
  };

  const addItem = () => setItems([...items, { product: "", qty: 1, price: 0 }]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i, field, value) => {
    const updated = [...items];
    updated[i] = { ...updated[i], [field]: value };
    if (field === "product") {
      const prod = products.find(p => String(p.id) === String(value));
      updated[i].price = prod ? parseFloat(prod.price) : 0;
    }
    setItems(updated);
  };

  const subtotal = items.reduce((s, it) => s + (parseFloat(it.price) || 0) * (parseInt(it.qty) || 0), 0);
  const gstAmount = subtotal * (gstRate / 100);
  const total = subtotal + gstAmount;

  const handleSubmit = async () => {
    const validItems = items.filter(it => it.product);
    if (validItems.length === 0) return showToast("Please select at least one product.", "error");

    setLoading(true);
    try {
      await api.post("quotations/", {
        lead: selectedLead || null,
        notes,
        gst_rate: gstRate,
        items: validItems.map(it => ({
          product: it.product,
          qty: it.qty,
        })),
      });
      showToast("✅ Quotation generated successfully!");
      setItems([{ product: "", qty: 1, price: 0 }]);
      setSelectedLead("");
      setNotes("");
      setShowForm(false);
      loadQuotations();
    } catch (err) {
      showToast("Generation failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade">
      {/* ── Toast Notification ── */}
      {toast.msg && (
        <div style={{
          position: "fixed", top: 40, right: 40, zIndex: 2000,
          background: toast.type === "success" ? "var(--success)" : "var(--error)",
          color: "#fff", padding: "16px 32px", borderRadius: 16, fontWeight: 800,
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)", animation: "fadeIn 0.3s ease-out"
        }}>
          {toast.msg}
        </div>
      )}

      {/* ── Page Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{ width: 32, height: 2, background: "var(--accent-primary)" }} />
            <div style={{ fontSize: 12, fontWeight: 800, color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "3px" }}>Commercial Desk</div>
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 950, letterSpacing: "-0.04em", margin: 0 }}>Expedition <span className="text-gradient">Quotations</span></h1>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", marginTop: 8 }}>Draft and issue professional proposals for upcoming treks.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(f => !f)}>
          {showForm ? "✕ Discard Draft" : "+ New Quotation"}
        </button>
      </div>

      {/* ── Quotation Form ── */}
      {showForm && (
        <div className="glass-card animate-fade" style={{ padding: 48, marginBottom: 40, borderRadius: 32 }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 32 }}>Proposal <span className="text-gradient">Composer</span></h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, marginBottom: 32 }}>
            <div className="form-group">
              <label className="form-label">Link to Prospect</label>
              <select className="form-control" value={selectedLead} onChange={e => setSelectedLead(e.target.value)}>
                <option value="">— Independent Client —</option>
                {leads.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Tax Rate (GST %)</label>
              <input type="number" className="form-control" value={gstRate} onChange={e => setGstRate(parseFloat(e.target.value))} />
            </div>
            <div className="form-group">
              <label className="form-label">Special Provisions</label>
              <input className="form-control" placeholder="Optional notes for client…" value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 60px", gap: 16, marginBottom: 12, padding: "0 8px" }}>
              {["Product/Service", "Quantity", "Net Unit Price", ""].map((h, i) => (
                <div key={i} style={{ fontSize: 10, fontWeight: 900, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>{h}</div>
              ))}
            </div>

            {items.map((item, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 60px", gap: 16, marginBottom: 12 }}>
                <select className="form-control" value={item.product} onChange={e => updateItem(i, "product", e.target.value)}>
                  <option value="">Select Resource</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <input className="form-control" type="number" min="1" value={item.qty} onChange={e => updateItem(i, "qty", e.target.value)} />
                <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 14, border: "1px solid var(--glass-border)", padding: "14px 18px", fontSize: 14, fontWeight: 700, color: "var(--accent-primary)" }}>
                   ₹{item.price ? item.price.toLocaleString() : "0"}
                </div>
                <button className="btn-icon btn-icon-danger" style={{ width: "100%", height: "100%" }} onClick={() => removeItem(i)} disabled={items.length === 1}>✕</button>
              </div>
            ))}

            <button className="btn btn-secondary" onClick={addItem} style={{ padding: "10px 20px", fontSize: 11, borderRadius: 12 }}>+ Add Resource</button>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end", gap: 40 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 4 }}>Subtotal: <span style={{ color: "#fff", fontWeight: 700 }}>₹{subtotal.toLocaleString()}</span></div>
              <div style={{ color: "var(--text-muted)", fontSize: 13 }}>Tax ({gstRate}%): <span style={{ color: "#fff", fontWeight: 700 }}>₹{gstAmount.toLocaleString()}</span></div>
              <div style={{ fontSize: 32, fontWeight: 950, color: "var(--accent-primary)", marginTop: 8, letterSpacing: "-1px" }}>₹{total.toLocaleString()}</div>
            </div>
            <button className="btn btn-primary" style={{ padding: "18px 40px", fontSize: 14 }} onClick={handleSubmit} disabled={loading}>
              {loading ? "Processing..." : "📄 Authorize Proposal"}
            </button>
          </div>
        </div>
      )}

      {/* ── Quotations Table ── */}
      <div className="crm-table-container">
        <table className="crm-table">
          <thead>
            <tr>
              <th>Reference ID</th><th>Client Profile</th><th>Proposal Value</th><th>Issue Date</th><th>Operations</th>
            </tr>
          </thead>
          <tbody>
            {quotations.map((q, i) => (
              <tr key={q.id} style={{ animation: `fadeIn 0.5s ease-out forwards ${i * 0.05}s`, opacity: 0 }}>
                <td>
                  <div style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 800, color: "var(--accent-primary)", background: "rgba(249,115,22,0.1)", padding: "4px 8px", borderRadius: 6, display: "inline-block" }}>
                    QT-{String(q.id).padStart(4, "0")}
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: 800, color: "#fff", fontSize: 15 }}>{q.customer_name || "Independent Client"}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{q.customer_email || "N/A"}</div>
                </td>
                <td>
                  <div style={{ fontSize: 16, fontWeight: 900, color: "var(--success)" }}>₹{Number(q.total).toLocaleString()}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)" }}>INC. {q.gst_rate}% TAX</div>
                </td>
                <td>
                  <div style={{ fontSize: 13, color: "#fff", fontWeight: 600 }}>{new Date(q.created_at).toLocaleDateString()}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>System Generated</div>
                </td>
                <td>
                  <button className="btn btn-secondary" style={{ padding: "8px 16px", fontSize: 11, borderRadius: 10 }} onClick={() => setShareTarget(q)}>📤 Export / Share</button>
                </td>
              </tr>
            ))}
            {quotations.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: 100, textAlign: "center" }}>
                   <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
                   <div style={{ fontWeight: 800, fontSize: 18, color: "#fff" }}>No Proposals Issued</div>
                   <p style={{ color: "var(--text-muted)" }}>You haven't generated any expedition quotes yet.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Share Modal (Simplified for UI consistency) ── */}
      {shareTarget && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(2, 6, 23, 0.85)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
          <div className="glass-card animate-fade" style={{ width: "100%", maxWidth: 480, padding: 48, borderRadius: 32, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 24 }}>📤</div>
            <h2 style={{ fontSize: 28, fontWeight: 950, marginBottom: 8 }}>Export <span className="text-gradient">Proposal</span></h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 40 }}>Distribute quotation <b>QT-{String(shareTarget.id).padStart(4, "0")}</b> via digital channels.</p>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
               <button className="btn btn-secondary" style={{ padding: 20, flexDirection: "column", gap: 12 }}>
                  <span style={{ fontSize: 24 }}>📄</span>
                  <span>System PDF</span>
               </button>
               <button className="btn btn-secondary" style={{ padding: 20, flexDirection: "column", gap: 12 }}>
                  <span style={{ fontSize: 24 }}>💬</span>
                  <span>WhatsApp</span>
               </button>
            </div>
            <button className="btn btn-primary" style={{ width: "100%", padding: 16, marginBottom: 12 }}>🧾 Convert to Official Invoice</button>
            <button className="btn btn-secondary" style={{ width: "100%", padding: 16 }} onClick={() => setShareTarget(null)}>Return to Registry</button>
          </div>
        </div>
      )}

      <style>{`
        .btn-icon-danger:hover { background: var(--error) !important; border-color: var(--error) !important; color: #fff !important; }
      `}</style>
    </div>
  );
}