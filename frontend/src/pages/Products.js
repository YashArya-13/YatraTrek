import React, { useEffect, useState } from "react";
import api from "../api";

const CATEGORY_ICONS = {
  trek_package: "🏔️", equipment: "🥾", meal_plan: "🥘",
  transport: "🚙", insurance: "🛡️", other: "📦",
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", description: "", category: "trek_package", stock: 1, discount_pct: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadProducts(); }, []);
  const loadProducts = () => api.get("products/").then(res => setProducts(res.data)).catch(() => {});

  const openAdd = () => { setEditItem(null); setForm({ name: "", price: "", description: "", category: "trek_package", stock: 1, discount_pct: 0 }); setShowModal(true); };
  const openEdit = (p) => { setEditItem(p); setForm(p); setShowModal(true); };

  const handleSave = async () => {
    if (!form.name || !form.price) return;
    setLoading(true);
    try {
      const payload = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock), discount_pct: parseFloat(form.discount_pct) };
      if (editItem) await api.patch(`products/${editItem.id}/`, payload);
      else await api.post("products/", payload);
      loadProducts(); setShowModal(false);
    } catch { alert("Error saving."); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this expedition item?")) return;
    await api.delete(`products/${id}/`);
    loadProducts();
  };

  const filtered = products.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-fade">
      {/* ── Page Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{ width: 32, height: 2, background: "var(--accent-primary)" }} />
            <div style={{ fontSize: 12, fontWeight: 800, color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "3px" }}>Asset Management</div>
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 950, letterSpacing: "-0.04em", margin: 0 }}>Adventure <span className="text-gradient">Inventory</span></h1>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", marginTop: 8 }}>Manage trek packages, equipment rentals, and logistics resources.</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Expand Catalogue</button>
      </div>

      {/* ── Search & Filter ── */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 32, display: "flex", gap: 20, alignItems: "center", borderRadius: 24 }}>
         <div style={{ flex: 1, position: "relative" }}>
           <input className="form-control" placeholder="Search the adventure locker..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 44, borderRadius: 16 }} />
           <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 18, opacity: 0.5 }}>🔍</span>
         </div>
         <div style={{ fontSize: 13, fontWeight: 800, color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "1px", padding: "0 12px" }}>
           {products.length} Items Indexed
         </div>
      </div>

      {/* ── Inventory Grid ── */}
      {filtered.length === 0 ? (
        <div className="glass-card" style={{ padding: 100, textAlign: "center" }}>
          <div style={{ fontSize: 60, marginBottom: 24, opacity: 0.2 }}>🏔️</div>
          <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>Catalogue Empty</h3>
          <p style={{ color: "var(--text-muted)", maxWidth: 400, margin: "0 auto" }}>Your expedition locker is currently vacant. Add your first trek package or gear item to get started.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
          {filtered.map((p, i) => (
            <div key={p.id} className="glass-card" style={{ padding: 0, overflow: "hidden", animation: `fadeIn 0.5s ease-out forwards ${i * 0.05}s`, opacity: 0 }}>
              <div style={{
                height: 180, background: "rgba(249,115,22,0.03)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 64, position: "relative",
                borderBottom: "1px solid var(--glass-border)"
              }}>
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center, rgba(249,115,22,0.08) 0%, transparent 70%)" }} />
                <span style={{ zIndex: 1 }}>{CATEGORY_ICONS[p.category] || "📦"}</span>
                <div style={{ position: "absolute", top: 16, right: 16, display: "flex", gap: 8 }}>
                  <button onClick={() => openEdit(p)} className="btn-icon">✏️</button>
                  <button onClick={() => handleDelete(p.id)} className="btn-icon btn-icon-danger">🗑️</button>
                </div>
              </div>
              <div style={{ padding: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 900, color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 6 }}>{p.category?.replace('_', ' ')}</div>
                    <h3 style={{ fontSize: 20, fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>{p.name}</h3>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 22, fontWeight: 950, color: "var(--success)" }}>₹{parseFloat(p.price).toLocaleString()}</div>
                    {p.discount_pct > 0 && <div style={{ fontSize: 11, color: "var(--warning)", fontWeight: 800 }}>-{p.discount_pct}% PROMO</div>}
                  </div>
                </div>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 24, height: 44, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                  {p.description || "Premium high-altitude adventure resource vetted for quality and safety."}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 20, borderTop: "1px solid var(--glass-border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.stock > 0 ? "var(--success)" : "var(--error)" }} />
                    <span style={{ fontSize: 12, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase" }}>
                      {p.stock > 0 ? "In Stock" : "Unavailable"}
                    </span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 900, color: "#fff" }}>{p.stock} Units</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Asset Modal ── */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(2, 6, 23, 0.85)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
          <div className="glass-card animate-fade" style={{ width: "100%", maxWidth: 540, padding: 48, borderRadius: 32 }}>
             <h2 style={{ fontSize: 32, fontWeight: 950, marginBottom: 8 }}>{editItem ? "Edit" : "Expand"} <span className="text-gradient">Asset</span></h2>
             <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 40 }}>Define specifications for expedition gear or services.</p>
             
             <div className="form-group">
                <label className="form-label">Asset Identity</label>
                <input className="form-control" placeholder="e.g. Oxygen Cylinder - Pro 5L" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
             </div>
             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 4 }}>
                <div className="form-group">
                   <label className="form-label">Unit Rate (₹)</label>
                   <input className="form-control" type="number" placeholder="2500" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                </div>
                <div className="form-group">
                   <label className="form-label">Category</label>
                   <select className="form-control" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                     <option value="trek_package">🏔️ Trek Package</option>
                     <option value="equipment">🥾 Equipment/Gear</option>
                     <option value="meal_plan">🥘 Food & Meals</option>
                     <option value="transport">🚙 Transport</option>
                     <option value="insurance">🛡️ Insurance</option>
                     <option value="other">📦 Other</option>
                   </select>
                </div>
             </div>
             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 4 }}>
                <div className="form-group">
                   <label className="form-label">Total Inventory</label>
                   <input className="form-control" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
                </div>
                <div className="form-group">
                   <label className="form-label">Discount Percentage</label>
                   <input className="form-control" type="number" value={form.discount_pct} onChange={e => setForm({ ...form, discount_pct: e.target.value })} />
                </div>
             </div>
             <div className="form-group">
                <label className="form-label">Technical Description</label>
                <textarea className="form-control" rows={3} placeholder="Provide key features and specifications..." value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} />
             </div>
             <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave} disabled={loading}>
                   {loading ? "Syncing..." : editItem ? "Update Record" : "Add to Locker"}
                </button>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Discard</button>
             </div>
          </div>
        </div>
      )}

      <style>{`
        .btn-icon {
          width: 38px; height: 38px; border-radius: 12px; border: 1px solid var(--glass-border);
          background: rgba(15, 23, 42, 0.8); color: #fff; fontSize: 16px; cursor: pointer;
          display: flex; alignItems: center; justifyContent: center; transition: 0.3s;
        }
        .btn-icon:hover { background: var(--accent-primary); transform: scale(1.1); }
        .btn-icon-danger:hover { background: var(--error); }
      `}</style>
    </div>
  );
}