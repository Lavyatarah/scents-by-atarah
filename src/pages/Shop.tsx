import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import badeeAlOudImg from "../assets/badee-al-oud.png";
import oudMystereImg from "../assets/oud-mystere.png";
import gardenReverieImg from "../assets/garden-reverie.png";
import velvetDuskImg from "../assets/velvet-dusk.png";
import anghamImg from "../assets/angham-second-song.png";
import mayarCherryImg from "../assets/mayar-cherry.png";

const WHATSAPP_LINK = "https://wa.me/254768702377";

const DEFAULT_IMAGES: Record<string, string> = {
  "badee-al-oud": badeeAlOudImg,
  "angham-second-song": anghamImg,
  "mayar-cherry": mayarCherryImg,
};

type Product = {
  id: string;
  name: string;
  price: string;
  desc: string;
  img: string;
  size: string;
  longevity: string;
  top: string[];
  heart: string[];
  base: string[];
  category: string;
  type: string;
  brand: string;
  isNew?: boolean;
  isBundle?: boolean;
};

const CATEGORIES = ["Women's", "Men's", "Unisex"] as const;
const TYPES = ["Eau de Parfum (EDP)", "Deodorant", "Air Freshener", "All Over Spray"] as const;
const BRANDS = ["Lattafa", "Lattafa Pride"] as const;

type FilterState = {
  special: "all" | "new" | "bundle";
  category: string;
  type: string;
  brand: string;
};

export default function Shop() {
  const [, navigate] = useLocation();
  const [filters, setFilters] = useState<FilterState>({ special: "all", category: "", type: "", brand: "" });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then((data: Array<{ id: string; imageUrl?: string } & Omit<Product, "id" | "img">>) => {
        setAllProducts(data.map(p => ({
          ...p,
          img: p.imageUrl || "",
        })));
      })
      .catch(() => setAllProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = allProducts.filter((p) => {
    if (filters.special === "new" && !p.isNew) return false;
    if (filters.special === "bundle" && !p.isBundle) return false;
    if (filters.category && p.category !== filters.category) return false;
    if (filters.type && p.type !== filters.type) return false;
    if (filters.brand && p.brand !== filters.brand) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const clearFilters = () => setFilters({ special: "all", category: "", type: "", brand: "" });

  const activeFilterCount = [
    filters.special !== "all",
    !!filters.category,
    !!filters.type,
    !!filters.brand,
  ].filter(Boolean).length;

  const SidebarContent = () => (
    <div className="flex flex-col gap-6">
      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search fragrances..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-background border border-border px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
        />
      </div>

      {/* Special */}
      <div>
        <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-bold">Browse</h4>
        {(["all", "new", "bundle"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilters(f => ({ ...f, special: s }))}
            className={`block w-full text-left py-2 px-3 text-sm transition-colors ${filters.special === s ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary" : "text-foreground hover:text-primary"}`}
          >
            {s === "all" ? "All Fragrances" : s === "new" ? "✦ New Arrivals" : "🎁 Bundles"}
          </button>
        ))}
      </div>

      {/* By Category */}
      <div>
        <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-bold">By Category</h4>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setFilters(f => ({ ...f, category: f.category === c ? "" : c }))}
            className={`block w-full text-left py-2 px-3 text-sm transition-colors ${filters.category === c ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary" : "text-foreground hover:text-primary"}`}
          >
            {c} Fragrances
          </button>
        ))}
      </div>

      {/* By Type */}
      <div>
        <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-bold">By Type</h4>
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setFilters(f => ({ ...f, type: f.type === t ? "" : t }))}
            className={`block w-full text-left py-2 px-3 text-sm transition-colors ${filters.type === t ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary" : "text-foreground hover:text-primary"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* By Brand */}
      <div>
        <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-bold">By Brand</h4>
        {BRANDS.map((b) => (
          <button
            key={b}
            onClick={() => setFilters(f => ({ ...f, brand: f.brand === b ? "" : b }))}
            className={`block w-full text-left py-2 px-3 text-sm transition-colors ${filters.brand === b ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary" : "text-foreground hover:text-primary"}`}
          >
            {b}
          </button>
        ))}
      </div>

      {activeFilterCount > 0 && (
        <button onClick={clearFilters} className="text-xs text-muted-foreground underline hover:text-primary">
          Clear all filters ({activeFilterCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Top nav bar */}
      <nav className="bg-foreground sticky top-0 z-40 py-4 border-b border-white/10">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex flex-col">
            <span className="font-serif text-xl font-bold text-primary-foreground tracking-wide">Scent by Atarah</span>
            <span className="font-serif text-xs italic text-primary">Artisan Perfumery</span>
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="text-xs uppercase tracking-widest text-primary-foreground/70 hover:text-primary transition-colors hidden md:block"
            >
              ← Back to Home
            </button>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-none px-5 py-2 text-xs uppercase tracking-wider flex items-center gap-2"
              onClick={() => window.open(`${WHATSAPP_LINK}?text=Hi, I need help tracking my order`, "_blank")}
            >
              <FaWhatsapp /> Track My Package
            </Button>
          </div>
        </div>
      </nav>

      {/* Delivery Banner */}
      <div className="bg-primary/10 border-b border-primary/20 py-3">
        <div className="container mx-auto px-6 flex flex-wrap items-center justify-center gap-4 md:gap-8 text-xs text-foreground/80">
          <span className="flex items-center gap-1">🏙️ <strong className="text-primary">Nairobi CBD</strong> — Ksh 150</span>
          <span className="text-border hidden md:block">|</span>
          <span className="flex items-center gap-1">🌆 <strong className="text-primary">Nairobi Suburbs</strong> — Ksh 250</span>
          <span className="text-border hidden md:block">|</span>
          <span className="flex items-center gap-1">🚚 <strong className="text-primary">Outside Nairobi</strong> — Ksh 400</span>
          <span className="text-border hidden md:block">|</span>
          <span className="flex items-center gap-1">📦 <strong className="text-primary">Countrywide</strong> — 1–3 business days</span>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        {/* Page header */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-serif text-3xl text-foreground">Shop All Fragrances</h1>
            <p className="text-muted-foreground text-sm mt-1">{filtered.length} product{filtered.length !== 1 ? "s" : ""} found</p>
          </div>
          {/* Mobile filter toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden flex items-center gap-2 border border-border px-4 py-2 text-sm text-foreground hover:border-primary transition-colors"
          >
            Filters {activeFilterCount > 0 && <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">{activeFilterCount}</span>}
          </button>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-56 shrink-0">
            <SidebarContent />
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-24 text-muted-foreground">
                <p className="font-serif text-xl animate-pulse">Loading fragrances…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-24 text-muted-foreground">
                <p className="font-serif text-xl mb-2">No fragrances found</p>
                <p className="text-sm mb-4">Try adjusting your filters</p>
                <button onClick={clearFilters} className="text-primary underline text-sm">Clear all filters</button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col cursor-pointer"
                    onClick={() => setSelectedProduct(item)}
                  >
                    <div className="relative w-full h-52 overflow-hidden bg-background">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {item.isNew && <span className="bg-primary text-primary-foreground text-[10px] uppercase tracking-widest px-2 py-0.5">New</span>}
                        {item.isBundle && <span className="bg-foreground text-primary-foreground text-[10px] uppercase tracking-widest px-2 py-0.5">Bundle</span>}
                      </div>
                      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-all flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 text-primary-foreground text-[10px] uppercase tracking-widest border border-primary-foreground/50 px-3 py-1.5 bg-foreground/60 backdrop-blur-sm">
                          View Details
                        </span>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <p className="text-[10px] uppercase tracking-widest text-primary mb-1">{item.brand} · {item.category}</p>
                      <h3 className="font-serif text-lg text-foreground mb-1 group-hover:text-primary transition-colors">{item.name}</h3>
                      <p className="text-xs text-muted-foreground mb-3 flex-grow">{item.desc}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <p className="font-serif font-bold text-foreground">Ksh {item.price}</p>
                        <span className="text-[10px] text-muted-foreground border border-border px-2 py-0.5">{item.type.split(" ")[0]}</span>
                      </div>
                      <Button
                        className="w-full mt-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-none uppercase tracking-widest text-[10px] py-4"
                        onClick={(e) => { e.stopPropagation(); window.open(`${WHATSAPP_LINK}?text=Hi, I would like to order ${item.name} (Ksh ${item.price})`, "_blank"); }}
                      >
                        <FaWhatsapp className="mr-1" /> Order on WhatsApp
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60" onClick={() => setSidebarOpen(false)} />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-card overflow-y-auto p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-lg">Filters</h3>
                <button onClick={() => setSidebarOpen(false)} className="text-muted-foreground hover:text-foreground text-xl">✕</button>
              </div>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedProduct(null)} />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-card max-h-[90vh] overflow-y-auto md:top-1/2 md:bottom-auto md:left-1/2 md:right-auto md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[85vh]"
            >
              <button onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-10 text-muted-foreground hover:text-foreground w-9 h-9 flex items-center justify-center border border-border hover:border-primary transition-colors">
                ✕
              </button>
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-2/5 bg-background flex items-center justify-center p-8 min-h-[240px]">
                  <img src={selectedProduct.img} alt={selectedProduct.name} className="max-h-56 object-contain drop-shadow-2xl" />
                </div>
                <div className="flex-1 p-8 flex flex-col">
                  <p className="text-xs uppercase tracking-widest text-primary mb-1">{selectedProduct.brand} · {selectedProduct.size}</p>
                  <h2 className="font-serif text-3xl text-foreground mb-1">{selectedProduct.name}</h2>
                  <p className="text-muted-foreground text-sm font-light mb-1">{selectedProduct.desc}</p>
                  <p className="text-xs text-muted-foreground mb-4">Longevity: <span className="text-primary">{selectedProduct.longevity}</span></p>
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {[{ label: "Top", notes: selectedProduct.top }, { label: "Heart", notes: selectedProduct.heart }, { label: "Base", notes: selectedProduct.base }].map(({ label, notes }) => (
                      <div key={label} className="border border-border p-3">
                        <p className="text-[10px] uppercase tracking-widest text-primary mb-2 font-bold">{label}</p>
                        {notes.map((n) => <p key={n} className="text-xs text-muted-foreground">{n}</p>)}
                      </div>
                    ))}
                  </div>
                  <div className="mt-auto">
                    <p className="font-serif text-2xl font-bold text-foreground mb-4">Ksh {selectedProduct.price}</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-none uppercase tracking-widest text-xs py-6 flex items-center justify-center gap-2"
                        onClick={() => window.open(`${WHATSAPP_LINK}?text=Hi, I would like to order ${selectedProduct.name} (Ksh ${selectedProduct.price})`, "_blank")}>
                        <FaWhatsapp className="text-lg" /> Order on WhatsApp
                      </Button>
                      <Button variant="outline" className="flex-1 border-primary text-primary hover:bg-primary/10 rounded-none uppercase tracking-widest text-xs py-6 flex items-center justify-center gap-2"
                        onClick={() => window.open(`${WHATSAPP_LINK}?text=Hi, I have a question about ${selectedProduct.name}`, "_blank")}>
                        <FaWhatsapp className="text-lg" /> Enquire
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
