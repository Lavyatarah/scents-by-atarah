import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const API = "/api";

type Product = {
  id: string;
  name: string;
  price: string;
  desc: string;
  size: string;
  longevity: string;
  top: string[];
  heart: string[];
  base: string[];
  category: string;
  type: string;
  brand: string;
  isNew: boolean;
  imageUrl: string;
};

const EMPTY_PRODUCT: Omit<Product, "id"> = {
  name: "", price: "", desc: "", size: "100ml", longevity: "",
  top: [], heart: [], base: [],
  category: "Unisex", type: "Eau de Parfum (EDP)", brand: "Lattafa",
  isNew: false, imageUrl: "",
};

const CATEGORIES = ["Women's", "Men's", "Unisex"];
const TYPES = ["Eau de Parfum (EDP)", "Deodorant", "Air Freshener", "All Over Spray"];
const BRANDS = ["Lattafa", "Lattafa Pride"];

export default function Admin() {
  const [, navigate] = useLocation();
  const [token, setToken] = useState(() => localStorage.getItem("admin_token") || "");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [adding, setAdding] = useState(false);
  const [newProduct, setNewProduct] = useState({ ...EMPTY_PRODUCT });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const authHeader = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  async function login() {
    setLoginError("");
    const res = await fetch(`${API}/admin/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      const { token: t } = await res.json() as { token: string };
      localStorage.setItem("admin_token", t);
      setToken(t);
    } else {
      setLoginError("Incorrect password. Try again.");
    }
  }

  async function loadProducts() {
    const res = await fetch(`${API}/products`);
    if (res.ok) setProducts(await res.json() as Product[]);
  }

  async function saveEdit() {
    if (!editing) return;
    setSaving(true);
    const res = await fetch(`${API}/products/${editing.id}`, {
      method: "PUT", headers: authHeader, body: JSON.stringify(editing),
    });
    setSaving(false);
    if (res.ok) {
      await loadProducts();
      setEditing(null);
      showToast("Product updated successfully!");
    } else if (res.status === 401) {
      localStorage.removeItem("admin_token");
      setToken("");
    }
  }

  async function saveNew() {
    setSaving(true);
    const res = await fetch(`${API}/products`, {
      method: "POST", headers: authHeader, body: JSON.stringify(newProduct),
    });
    setSaving(false);
    if (res.ok) {
      await loadProducts();
      setAdding(false);
      setNewProduct({ ...EMPTY_PRODUCT });
      showToast("Product added successfully!");
    }
  }

  async function deleteProduct(id: string) {
    const res = await fetch(`${API}/products/${id}`, { method: "DELETE", headers: authHeader });
    if (res.ok) {
      await loadProducts();
      setDeleteConfirm(null);
      showToast("Product deleted.");
    }
  }

  useEffect(() => {
    if (token) loadProducts();
  }, [token]);

  function notesField(label: string, value: string[], onChange: (v: string[]) => void) {
    return (
      <div>
        <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">{label} Notes (comma-separated)</label>
        <input
          className="w-full bg-background border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
          value={value.join(", ")}
          onChange={(e) => onChange(e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
        />
      </div>
    );
  }

  function ProductForm({ data, onChange }: { data: Omit<Product, "id"> | Product; onChange: (d: typeof data) => void }) {
    return (
      <div className="grid gap-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Product Name *</label>
            <input className="w-full bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary"
              value={data.name} onChange={e => onChange({ ...data, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Price (Ksh) *</label>
            <input className="w-full bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary"
              value={data.price} onChange={e => onChange({ ...data, price: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Description</label>
          <textarea className="w-full bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary"
            rows={2} value={data.desc} onChange={e => onChange({ ...data, desc: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Image URL (paste a link to your product photo)</label>
          <input className="w-full bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary"
            placeholder="https://example.com/your-photo.jpg"
            value={data.imageUrl} onChange={e => onChange({ ...data, imageUrl: e.target.value })} />
          {data.imageUrl && (
            <img src={data.imageUrl} alt="Preview" className="mt-2 h-24 object-contain border border-border" onError={e => ((e.target as HTMLImageElement).style.display = "none")} />
          )}
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Category</label>
            <select className="w-full bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary"
              value={data.category} onChange={e => onChange({ ...data, category: e.target.value })}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Type</label>
            <select className="w-full bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary"
              value={data.type} onChange={e => onChange({ ...data, type: e.target.value })}>
              {TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Brand</label>
            <select className="w-full bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary"
              value={data.brand} onChange={e => onChange({ ...data, brand: e.target.value })}>
              {BRANDS.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Size</label>
            <input className="w-full bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary"
              value={data.size} onChange={e => onChange({ ...data, size: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Longevity</label>
            <input className="w-full bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary"
              placeholder="e.g. 8–12 hours"
              value={data.longevity} onChange={e => onChange({ ...data, longevity: e.target.value })} />
          </div>
        </div>
        {notesField("Top", data.top, (v) => onChange({ ...data, top: v }))}
        {notesField("Heart", data.heart, (v) => onChange({ ...data, heart: v }))}
        {notesField("Base", data.base, (v) => onChange({ ...data, base: v }))}
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={data.isNew} onChange={e => onChange({ ...data, isNew: e.target.checked })} />
          <span className="text-sm text-foreground">Mark as New Arrival</span>
        </label>
      </div>
    );
  }

  // Login screen
  if (!token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm border border-border p-10 bg-card">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl text-foreground mb-1">Scent by Atarah</h1>
            <p className="text-muted-foreground text-sm">Admin Panel</p>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Password</label>
              <input
                type="password"
                className="w-full bg-background border border-border px-4 py-3 text-foreground focus:outline-none focus:border-primary"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && login()}
                placeholder="Enter admin password"
              />
            </div>
            {loginError && <p className="text-red-500 text-xs">{loginError}</p>}
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-none py-6 uppercase tracking-widest" onClick={login}>
              Sign In
            </Button>
            <button onClick={() => navigate("/")} className="text-xs text-muted-foreground hover:text-primary text-center transition-colors">
              ← Back to website
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-foreground py-4 sticky top-0 z-40">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-xl text-primary-foreground">Admin Panel</h1>
            <p className="text-primary text-xs italic">Scent by Atarah</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/shop")} className="text-xs text-primary-foreground/70 hover:text-primary transition-colors hidden md:block">
              View Shop ↗
            </button>
            <button onClick={() => { localStorage.removeItem("admin_token"); setToken(""); }}
              className="text-xs uppercase tracking-widest text-primary-foreground/50 hover:text-primary border border-white/20 px-4 py-2 transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-10">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "Total Products", value: products.length },
            { label: "New Arrivals", value: products.filter(p => p.isNew).length },
            { label: "Brands", value: new Set(products.map(p => p.brand)).size },
          ].map((s, i) => (
            <div key={i} className="border border-border p-5 text-center">
              <p className="font-serif text-3xl text-primary mb-1">{s.value}</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Product list */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl text-foreground">Products</h2>
          <Button onClick={() => { setAdding(true); setNewProduct({ ...EMPTY_PRODUCT }); }}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-none uppercase tracking-widest text-xs px-6 py-5">
            + Add Product
          </Button>
        </div>

        <div className="grid gap-4">
          {products.map((p) => (
            <div key={p.id} className="border border-border bg-card p-5 flex items-center gap-4 hover:border-primary/40 transition-colors">
              <div className="w-14 h-14 shrink-0 bg-background border border-border flex items-center justify-center overflow-hidden">
                {p.imageUrl
                  ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                  : <span className="text-2xl">🌿</span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-serif text-foreground font-semibold">{p.name}</h3>
                  {p.isNew && <span className="bg-primary text-primary-foreground text-[10px] uppercase px-2 py-0.5">New</span>}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{p.brand} · {p.category} · {p.type}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-serif font-bold text-foreground">Ksh {p.price}</p>
                <p className="text-xs text-muted-foreground">{p.size}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => setEditing({ ...p })}
                  className="border border-primary text-primary text-xs px-4 py-2 hover:bg-primary/10 transition-colors uppercase tracking-widest">
                  Edit
                </button>
                <button onClick={() => setDeleteConfirm(p.id)}
                  className="border border-red-500/40 text-red-500 text-xs px-3 py-2 hover:bg-red-500/10 transition-colors">
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editing && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70" onClick={() => setEditing(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
              className="fixed inset-4 md:inset-12 z-50 bg-card overflow-y-auto">
              <div className="p-6 md:p-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-2xl text-foreground">Edit: {editing.name}</h2>
                  <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground text-2xl">✕</button>
                </div>
                <ProductForm data={editing} onChange={(d) => setEditing(d as Product)} />
                <div className="flex gap-3 mt-8">
                  <Button onClick={saveEdit} disabled={saving}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-none px-8 py-5 uppercase tracking-widest text-xs">
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button variant="outline" onClick={() => setEditing(null)}
                    className="border-border rounded-none px-8 py-5 uppercase tracking-widest text-xs">
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Modal */}
      <AnimatePresence>
        {adding && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70" onClick={() => setAdding(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
              className="fixed inset-4 md:inset-12 z-50 bg-card overflow-y-auto">
              <div className="p-6 md:p-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-2xl text-foreground">Add New Product</h2>
                  <button onClick={() => setAdding(false)} className="text-muted-foreground hover:text-foreground text-2xl">✕</button>
                </div>
                <ProductForm data={newProduct} onChange={(d) => setNewProduct(d as typeof newProduct)} />
                <div className="flex gap-3 mt-8">
                  <Button onClick={saveNew} disabled={saving || !newProduct.name}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-none px-8 py-5 uppercase tracking-widest text-xs">
                    {saving ? "Adding..." : "Add Product"}
                  </Button>
                  <Button variant="outline" onClick={() => setAdding(false)}
                    className="border-border rounded-none px-8 py-5 uppercase tracking-widest text-xs">
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70" onClick={() => setDeleteConfirm(null)} />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-card border border-border p-8 w-full max-w-sm">
              <h3 className="font-serif text-xl mb-3 text-foreground">Delete Product?</h3>
              <p className="text-muted-foreground text-sm mb-6">This cannot be undone. The product will be removed from your shop.</p>
              <div className="flex gap-3">
                <Button onClick={() => deleteProduct(deleteConfirm)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-none uppercase tracking-widest text-xs py-5">
                  Delete
                </Button>
                <Button variant="outline" onClick={() => setDeleteConfirm(null)}
                  className="flex-1 border-border rounded-none uppercase tracking-widest text-xs py-5">
                  Cancel
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-foreground text-primary-foreground px-6 py-3 text-sm z-50 border border-primary/40">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
