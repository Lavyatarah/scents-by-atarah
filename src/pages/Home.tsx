import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import heroBattleImg from "../assets/hero-bottle.png";
import heroBottleImg from "../assets/hero-bottle.webp";
import mayarCherryImg from "../assets/mayar-cherry.png";
import badeeAlOudImg from "../assets/badee-al-oud.png";
import gardenReverieImg from "../assets/garden-reverie.png";
import velvetDuskImg from "../assets/velvet-dusk.png";
import anghamImg from "../assets/angham-second-song.png";
import mensDuoImg from "../assets/mens-duo.webp";

const WHATSAPP_LINK = "https://wa.me/254768702377";

type Product = {
  name: string;
  price: string;
  desc: string;
  img: string;
  size: string;
  longevity: string;
  top: string[];
  heart: string[];
  base: string[];
  isBestSeller?: boolean;
  isNew?: boolean;
};

const products: Product[] = [
  {
    name: "Badee Al Oud",
    price: "2800",
    desc: "Rich, smoky Oud with rose and sandalwood base.",
    img: badeeAlOudImg,
    size: "100ml",
    longevity: "8–12 hours",
    top: ["Bergamot", "Saffron", "Pink Pepper"],
    heart: ["Rose", "Oud Wood", "Incense"],
    base: ["Amber", "Sandalwood", "White Musk"],
    isBestSeller: true,
  },
  {
    name: "Al Qiam Silver",
    price: "2500",
    desc: "A refined silver oud with spicy leather, amber, and a smooth floral heart.",
    img: heroBottleImg,
    size: "100ml",
    longevity: "10–14 hours",
    top: ["Cardamom", "Bergamot", "Nutmeg"],
    heart: ["Leather", "Oud Wood", "Incense"],
    base: ["Amber", "Musk", "Vanilla"],
    isBestSeller: true,
  },
  {
    name: "Affection Love",
    price: "3000",
    desc: "Romantic floral amber with jasmine, rose, and tender musk in a luxurious bottle.",
    img: gardenReverieImg,
    size: "100ml",
    longevity: "8–12 hours",
    top: ["Rose", "Green Leaves", "Bergamot"],
    heart: ["Jasmine", "Iris", "Violet"],
    base: ["Amber", "Vanilla", "Musk"],
    isBestSeller: true,
  },
  {
    name: "Asad Bourbon Duo",
    price: "2800",
    desc: "A warm duo with rich bourbon oud, spices, and resinous amber.",
    img: mensDuoImg,
    size: "100ml",
    longevity: "10–14 hours",
    top: ["Black Pepper", "Cinnamon", "Nutmeg"],
    heart: ["Oud Wood", "Leather", "Bourbon"],
    base: ["Amber", "Vanilla", "Musk"],
    isNew: true,
  },
  {
    name: "Angham Second Song",
    price: "3000",
    desc: "Dark berry, oud wood and a warm musky drydown.",
    img: anghamImg,
    size: "100ml",
    longevity: "10–14 hours",
    top: ["Bergamot", "Raspberry", "Pink Pepper"],
    heart: ["Rose", "Jasmine", "Iris", "Cherry"],
    base: ["Sandalwood", "Amber", "Musk", "Vanilla"],
    isNew: true,
  },
];

type CollectionFilter = "all" | "best-sellers" | "new-arrivals";

export default function Home() {
  const [, navigate] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [collectionFilter, setCollectionFilter] = useState<CollectionFilter>("all");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const filteredProducts = products.filter((p) => {
    if (collectionFilter === "best-sellers") return p.isBestSeller;
    if (collectionFilter === "new-arrivals") return p.isNew;
    return true;
  });

  return (
    <div className="min-h-[100dvh] bg-background text-foreground font-sans overflow-x-hidden">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: 200%;
          animation: marquee 20s linear infinite;
        }
        .hero-clip {
          clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
        }
        @media (min-width: 768px) {
          .hero-clip {
            clip-path: polygon(0 0, 100% 0, 85% 100%, 0 100%);
          }
        }
      `}</style>

      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-foreground/95 backdrop-blur-md py-3 shadow-md" : "bg-foreground py-5"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex flex-col cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <span className="font-serif text-2xl font-bold text-primary-foreground tracking-wide">
              Scent by Atarah
            </span>
            <span className="font-serif text-sm italic text-primary mt-0.5">
              Artisan Perfumery
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest text-primary-foreground">
            <button onClick={() => scrollTo("collections")} className="hover:text-primary transition-colors">Collections</button>
            <button onClick={() => scrollTo("story")} className="hover:text-primary transition-colors">Our Story</button>
            <button onClick={() => scrollTo("notes")} className="hover:text-primary transition-colors">Notes</button>
            <button onClick={() => scrollTo("testimonials")} className="hover:text-primary transition-colors">Testimonials</button>
            <button onClick={() => navigate("/shop")} className="hover:text-primary transition-colors text-primary font-semibold">Shop</button>
          </div>

          <Button
            className="hidden md:flex bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-none px-6"
            onClick={() => navigate("/shop")}
          >
            Shop Now
          </Button>

          <button
            className="md:hidden flex flex-col justify-center items-center gap-1.5 w-10 h-10 z-50 relative"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span className={`block h-0.5 bg-primary-foreground transition-all duration-300 origin-center ${menuOpen ? "w-6 rotate-45 translate-y-2" : "w-6"}`} />
            <span className={`block h-0.5 bg-primary-foreground transition-all duration-300 ${menuOpen ? "w-0 opacity-0" : "w-5"}`} />
            <span className={`block h-0.5 bg-primary-foreground transition-all duration-300 origin-center ${menuOpen ? "w-6 -rotate-45 -translate-y-2" : "w-6"}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-40 bg-foreground flex flex-col justify-center items-center gap-10 md:hidden"
          >
            {[
              { label: "Collections", action: () => { scrollTo("collections"); setMenuOpen(false); } },
              { label: "Our Story", action: () => { scrollTo("story"); setMenuOpen(false); } },
              { label: "Notes", action: () => { scrollTo("notes"); setMenuOpen(false); } },
              { label: "Testimonials", action: () => { scrollTo("testimonials"); setMenuOpen(false); } },
              { label: "Shop ✦", action: () => { navigate("/shop"); setMenuOpen(false); } },
            ].map((item, idx) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                onClick={item.action}
                className={`font-serif text-3xl hover:text-primary transition-colors tracking-widest ${item.label.includes("Shop") ? "text-primary" : "text-primary-foreground"}`}
              >
                {item.label}
              </motion.button>
            ))}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="flex flex-col gap-3 items-center">
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-none px-10 py-6 text-base flex items-center gap-2"
                onClick={() => { window.open(WHATSAPP_LINK, "_blank"); setMenuOpen(false); }}
              >
                <FaWhatsapp className="text-xl" /> WhatsApp Us
              </Button>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10 rounded-none px-10 py-6 text-sm flex items-center gap-2"
                onClick={() => { window.open(`${WHATSAPP_LINK}?text=Hi, I need help tracking my order`, "_blank"); setMenuOpen(false); }}
              >
                📦 Track My Package
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section className="relative min-h-[90vh] pt-32 flex flex-col md:flex-row bg-background">
        <div className="w-full md:w-3/5 bg-foreground hero-clip flex items-center justify-center p-8 md:p-20 z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="max-w-xl text-left"
          >
            <span className="inline-block border border-primary text-primary px-4 py-1 text-xs uppercase tracking-widest mb-6">
              New Arrival
            </span>
            <h1 className="font-serif text-5xl md:text-7xl text-primary-foreground leading-tight mb-6">
              Discover the <br/><span className="text-primary italic">Soul</span> of the Orient
            </h1>
            <p className="text-muted text-lg font-light leading-relaxed mb-10 max-w-md">
              A journey through heritage. Aged Oud, rare musk, and artisan blends crafted for those who wear their stories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => scrollTo("collections")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-none px-8 py-6 text-base tracking-wider uppercase"
              >
                Explore Collection
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open(WHATSAPP_LINK, "_blank")}
                className="border-primary text-primary hover:bg-primary/10 rounded-none px-8 py-6 text-base tracking-wider uppercase flex items-center gap-2"
              >
                <FaWhatsapp className="text-xl" /> WhatsApp Us
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="w-full md:w-2/5 md:-ml-20 flex items-center justify-center p-8 md:p-12 bg-background">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 1, delay: 0.2 } }}
            className="w-full max-w-xs relative"
          >
            <img
              src={heroBattleImg}
              alt="Lattafa Badee Al Oud"
              className="w-full h-auto object-contain drop-shadow-2xl"
            />
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
              <span className="text-xs uppercase tracking-widest text-primary font-serif italic">Badee Al Oud · Lattafa</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Marquee */}
      <section className="bg-primary text-primary-foreground py-4 overflow-hidden flex border-y border-primary/20">
        <div className="animate-marquee whitespace-nowrap">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center text-sm md:text-base font-serif tracking-widest uppercase">
              <span className="mx-6">Pure Oud</span><span className="text-xs opacity-50">◆</span>
              <span className="mx-6">Arabic Heritage</span><span className="text-xs opacity-50">◆</span>
              <span className="mx-6">Handcrafted Blends</span><span className="text-xs opacity-50">◆</span>
              <span className="mx-6">Luxury Fragrance</span><span className="text-xs opacity-50">◆</span>
              <span className="mx-6">Artisan Perfumery</span><span className="text-xs opacity-50">◆</span>
              <span className="mx-6">2026</span><span className="text-xs opacity-50">◆</span>
              <span className="mx-6">Kenya's Finest</span><span className="text-xs opacity-50">◆</span>
            </div>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section id="story" className="py-24 bg-card">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
              className="flex flex-col items-center text-center"
            >
              <div className="relative mb-10">
                <img
                  src={mayarCherryImg}
                  alt="Lattafa Mayar Cherry"
                  className="w-56 h-auto object-contain drop-shadow-2xl mx-auto"
                />
                <span className="block mt-3 text-xs uppercase tracking-widest text-primary font-serif italic text-center">
                  Mayar Cherry · Lattafa
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 w-full">
                <div>
                  <h4 className="font-serif text-2xl text-primary mb-1">500+</h4>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Clients</p>
                </div>
                <div className="border-x border-border">
                  <h4 className="font-serif text-2xl text-primary mb-1">20+</h4>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Blends</p>
                </div>
                <div>
                  <h4 className="font-serif text-2xl text-primary mb-1">100%</h4>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Authentic</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            >
              <h2 className="font-serif text-4xl mb-6 text-foreground">The Artisan's Journey</h2>
              <h3 className="font-serif text-xl text-primary italic mb-6">Rooted in Middle Eastern heritage.</h3>
              <p className="text-muted-foreground font-light leading-relaxed mb-6">
                Scent by Atarah was born from a deep reverence for the ancient art of perfumery. We believe that true luxury lies not in mass production, but in the meticulous selection of rare ingredients.
              </p>
              <p className="text-muted-foreground font-light leading-relaxed">
                Sourcing authentic Oud, Taif roses, and aged amber directly from the souks of the Middle East, our master blenders craft intimate narratives in every bottle. Each drop is an invitation to experience the rich, smoky, and floral tapestry of Arabic fragrance culture right here in Nairobi, Kenya.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section id="collections" className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-10"
          >
            <h2 className="font-serif text-4xl text-foreground mb-4">Signature Collection</h2>
            <div className="w-16 h-1 bg-primary mx-auto mb-8"></div>

            {/* Filter Tabs */}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {([
                { key: "all", label: "All Fragrances" },
                { key: "best-sellers", label: "⭐ Best Sellers" },
                { key: "new-arrivals", label: "✦ New Arrivals" },
              ] as { key: CollectionFilter; label: string }[]).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setCollectionFilter(tab.key)}
                  className={`px-6 py-2.5 text-xs uppercase tracking-widest border transition-all duration-200 ${
                    collectionFilter === tab.key
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={collectionFilter}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8"
            >
              {filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-16 text-muted-foreground">
                  <p className="font-serif text-xl mb-2">Nothing here yet</p>
                  <button onClick={() => setCollectionFilter("all")} className="text-primary text-sm underline">View all fragrances</button>
                </div>
              ) : filteredProducts.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="group relative bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col h-full overflow-hidden cursor-pointer"
                  onClick={() => setSelectedProduct(item)}
                >
                  {/* Badges */}
                  <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                    {item.isBestSeller && (
                      <span className="bg-foreground text-primary text-[10px] uppercase px-2 py-0.5 tracking-widest">⭐ Best Seller</span>
                    )}
                    {item.isNew && (
                      <span className="bg-primary text-primary-foreground text-[10px] uppercase px-2 py-0.5 tracking-widest">New</span>
                    )}
                  </div>

                  <div className="w-full h-56 overflow-hidden relative">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-all duration-300 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-primary-foreground text-xs uppercase tracking-widest border border-primary-foreground/50 px-4 py-2 bg-foreground/60 backdrop-blur-sm">
                        View Details
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="text-center flex-grow">
                      <h3 className="font-serif text-xl text-foreground mb-1 group-hover:text-primary transition-colors">{item.name}</h3>
                      <p className="text-sm text-muted-foreground font-light mb-4">{item.desc}</p>
                      <p className="font-serif text-lg font-bold text-foreground mb-4">Ksh {item.price}</p>
                    </div>
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-none uppercase tracking-widest text-xs py-5 mt-auto"
                      onClick={(e) => { e.stopPropagation(); setSelectedProduct(item); }}
                    >
                      View Details
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button
              variant="outline"
              onClick={() => navigate("/shop")}
              className="border-primary text-primary hover:bg-primary/10 rounded-none px-10 py-6 uppercase tracking-widest text-sm"
            >
              Browse Full Shop →
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Delivery Section — revamped, no prices */}
      <section className="py-20 bg-foreground border-y border-primary/20 relative overflow-hidden">
        {/* Subtle background motif */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="del-motif" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke="#C9962A" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#del-motif)" />
          </svg>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <span className="inline-block border border-primary/50 text-primary px-4 py-1 text-xs uppercase tracking-widest mb-5">We Deliver</span>
            <h2 className="font-serif text-4xl text-primary-foreground mb-3">Luxury at Your Door</h2>
            <p className="text-primary-foreground/50 font-light max-w-md mx-auto">Fast, discreet delivery across Kenya. Your fragrance arrives beautifully packaged.</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-3xl mx-auto">
            {[
              { icon: "🏙️", zone: "Nairobi CBD", time: "Same day" },
              { icon: "🌆", zone: "Nairobi Suburbs", time: "1 business day" },
              { icon: "🚚", zone: "Outside Nairobi", time: "1–2 business days" },
              { icon: "📦", zone: "Countrywide", time: "2–3 business days" },
            ].map((d, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="border border-primary/20 p-5 text-center hover:border-primary/60 transition-colors group"
              >
                <span className="text-3xl mb-3 block">{d.icon}</span>
                <h4 className="font-serif text-primary-foreground text-sm font-semibold mb-2 group-hover:text-primary transition-colors">{d.zone}</h4>
                <p className="text-xs text-primary uppercase tracking-wider font-light">{d.time}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-none px-8 py-6 uppercase tracking-widest text-sm flex items-center gap-2"
              onClick={() => window.open(`${WHATSAPP_LINK}?text=Hi, I need help tracking my order`, "_blank")}
            >
              📦 Track My Package
            </Button>
            <Button
              variant="outline"
              className="border-primary/50 text-primary hover:bg-primary/10 rounded-none px-8 py-6 uppercase tracking-widest text-sm flex items-center gap-2"
              onClick={() => window.open(`${WHATSAPP_LINK}?text=Hi, I have a delivery enquiry`, "_blank")}
            >
              <FaWhatsapp /> Delivery Enquiry
            </Button>
          </div>
        </div>
      </section>

      {/* Fragrance Pyramid */}
      <section id="notes" className="py-24 bg-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="motif" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M20 0 L40 20 L20 40 L0 20 Z" fill="none" stroke="#C9962A" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#motif)" />
          </svg>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-4"
          >
            <h2 className="font-serif text-4xl text-primary-foreground mb-3">The Architecture of Scent</h2>
            <p className="text-primary italic font-serif text-lg mb-2">Angham Second Song · Lattafa</p>
            <p className="text-primary-foreground/50 text-sm max-w-md mx-auto">A journey that opens bright, blooms rich, and settles into unforgettable warmth</p>
          </motion.div>

          <div className="max-w-4xl mx-auto mt-14 grid lg:grid-cols-3 gap-0 relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-primary/20 -translate-y-1/2 z-0" />

            {[
              {
                layer: "Top Notes",
                subtitle: "First Impression · 0–30 min",
                icon: "✦",
                notes: ["Bergamot", "Raspberry", "Pink Pepper"],
                desc: "A sparkling, citrus-fruity opening that grabs attention the moment it hits the skin.",
                delay: 0.1,
                accent: "border-primary/60 bg-primary/20"
              },
              {
                layer: "Heart Notes",
                subtitle: "The Soul · 30 min–4 hrs",
                icon: "❀",
                notes: ["Rose", "Jasmine", "Iris", "Cherry"],
                desc: "A lush floral heart — velvety rose entwined with jasmine and a whisper of sweet cherry.",
                delay: 0.3,
                accent: "border-primary/80 bg-primary/30 scale-105 shadow-2xl shadow-primary/20"
              },
              {
                layer: "Base Notes",
                subtitle: "The Memory · 4+ hrs",
                icon: "◈",
                notes: ["Sandalwood", "Amber", "Musk", "Vanilla"],
                desc: "A deep, creamy drydown of warm sandalwood and amber that clings to skin for hours.",
                delay: 0.5,
                accent: "border-primary/40 bg-primary/10"
              }
            ].map((tier, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: tier.delay }}
                className={`relative z-10 border ${tier.accent} p-8 flex flex-col items-center text-center mx-2 lg:mx-0`}
              >
                <span className="text-primary text-2xl mb-4">{tier.icon}</span>
                <h4 className="font-serif text-primary text-lg font-bold mb-1 tracking-wide">{tier.layer}</h4>
                <p className="text-primary/60 text-xs uppercase tracking-widest mb-5">{tier.subtitle}</p>
                <div className="flex flex-wrap justify-center gap-2 mb-5">
                  {tier.notes.map((note, j) => (
                    <span key={j} className="border border-primary/40 text-primary-foreground/80 text-xs px-3 py-1 tracking-wider">
                      {note}
                    </span>
                  ))}
                </div>
                <p className="text-primary-foreground/60 text-xs font-light leading-relaxed">{tier.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.7 }}
            className="text-center text-primary-foreground/50 font-light max-w-lg mx-auto mt-12 text-sm italic"
          >
            "Every bottle is a living composition — volatile top notes invite you in, the heart reveals itself over time, and the base becomes your second skin."
          </motion.p>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-card">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl text-foreground mb-4">Words of Affection</h2>
            <div className="w-16 h-1 bg-primary mx-auto"></div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Salma R.", initial: "S", quote: "This is the most authentic Oud I've smelled outside of Dubai. Absolutely mesmerising." },
              { name: "Tariq M.", initial: "T", quote: "Scent by Atarah captured exactly what I was looking for — a piece of home in a bottle." },
              { name: "Fatima J.", initial: "F", quote: "The Badee Al Oud is divine. I've already ordered three times!" }
            ].map((test, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-background p-8 border border-border shadow-sm flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-serif text-2xl mb-6 shadow-md">
                  {test.initial}
                </div>
                <div className="flex gap-1 text-primary mb-6">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <polygon points="10,1 12.5,7 19,7 14,11.5 16,18 10,14 4,18 6,11.5 1,7 7.5,7" />
                    </svg>
                  ))}
                </div>
                <p className="font-serif italic text-muted-foreground mb-6 flex-grow leading-relaxed">
                  "{test.quote}"
                </p>
                <h5 className="uppercase tracking-widest text-xs font-bold text-foreground">{test.name}</h5>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-foreground py-20">
        <div className="container mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-serif text-4xl md:text-5xl text-primary-foreground mb-8">Ready to Experience the Orient?</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Button
                onClick={() => navigate("/shop")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-none px-10 py-7 text-lg tracking-widest uppercase"
              >
                Shop Collection
              </Button>
              <Button
                onClick={() => window.open(WHATSAPP_LINK, "_blank")}
                className="bg-transparent border border-primary text-primary hover:bg-primary/10 rounded-none px-10 py-7 text-lg tracking-widest uppercase flex items-center gap-3"
              >
                <FaWhatsapp className="text-2xl" /> +254 768 702 377
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0D2E24] pt-20 pb-10 border-t border-primary/20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <h2 className="font-serif text-3xl text-primary-foreground mb-2">Scent by Atarah</h2>
              <p className="font-serif text-primary italic mb-6">Artisan Perfumery</p>
              <p className="text-primary-foreground/60 font-light max-w-sm leading-relaxed">
                Curating the finest Middle Eastern fragrances. Handcrafted blends that evoke memories, traditions, and timeless elegance.
              </p>
            </div>

            <div>
              <h4 className="text-primary-foreground uppercase tracking-widest text-sm font-bold mb-6">Quick Links</h4>
              <ul className="flex flex-col gap-4 text-primary-foreground/60 font-light">
                <li><button onClick={() => scrollTo("collections")} className="hover:text-primary transition-colors">Shop</button></li>
                <li><button onClick={() => scrollTo("story")} className="hover:text-primary transition-colors">Our Story</button></li>
                <li><button onClick={() => scrollTo("notes")} className="hover:text-primary transition-colors">Fragrance Notes</button></li>
                <li><button onClick={() => scrollTo("testimonials")} className="hover:text-primary transition-colors">Testimonials</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-primary-foreground uppercase tracking-widest text-sm font-bold mb-6">Contact</h4>
              <ul className="flex flex-col gap-4 text-primary-foreground/60 font-light">
                <li>
                  <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                    <FaWhatsapp className="text-primary" /> +254 768 702 377
                  </a>
                </li>
                <li>
                  <a href="mailto:scentbyatarah@gmail.com" className="hover:text-primary transition-colors">scentbyatarah@gmail.com</a>
                </li>
                <li className="mt-4">
                  <p className="text-xs uppercase tracking-widest text-primary">Nairobi, Kenya</p>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-primary/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-primary-foreground/40 text-xs font-light tracking-wide">
            <p>© 2026 Scent by Atarah. All rights reserved.</p>
            <p>Designed for Luxury</p>
          </div>
        </div>
      </footer>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              onClick={() => setSelectedProduct(null)}
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-card max-h-[90vh] overflow-y-auto md:top-1/2 md:bottom-auto md:left-1/2 md:right-auto md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[85vh] md:rounded-none"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-10 text-muted-foreground hover:text-foreground text-2xl w-9 h-9 flex items-center justify-center border border-border hover:border-primary transition-colors"
              >
                ✕
              </button>

              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-2/5 bg-background flex items-center justify-center p-8 min-h-[260px]">
                  <img
                    src={selectedProduct.img}
                    alt={selectedProduct.name}
                    className="max-h-64 object-contain drop-shadow-2xl"
                  />
                </div>

                <div className="flex-1 p-8 flex flex-col">
                  <p className="text-xs uppercase tracking-widest text-primary mb-1">Lattafa · {selectedProduct.size}</p>
                  <h2 className="font-serif text-3xl text-foreground mb-2">{selectedProduct.name}</h2>
                  <p className="text-muted-foreground font-light mb-1">{selectedProduct.desc}</p>
                  <p className="text-xs text-muted-foreground mb-5">Longevity: <span className="text-primary">{selectedProduct.longevity}</span></p>

                  <div className="grid grid-cols-3 gap-3 mb-7">
                    {[
                      { label: "Top", notes: selectedProduct.top },
                      { label: "Heart", notes: selectedProduct.heart },
                      { label: "Base", notes: selectedProduct.base },
                    ].map(({ label, notes }) => (
                      <div key={label} className="border border-border p-3">
                        <p className="text-xs uppercase tracking-widest text-primary mb-2 font-bold">{label}</p>
                        {notes.map((n) => (
                          <p key={n} className="text-xs text-muted-foreground">{n}</p>
                        ))}
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto">
                    <p className="font-serif text-2xl font-bold text-foreground mb-4">Ksh {selectedProduct.price}</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-none uppercase tracking-widest text-xs py-6 flex items-center justify-center gap-2"
                        onClick={() => window.open(`${WHATSAPP_LINK}?text=Hi, I would like to order ${selectedProduct.name} (Ksh ${selectedProduct.price})`, "_blank")}
                      >
                        <FaWhatsapp className="text-lg" /> Order on WhatsApp
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-primary text-primary hover:bg-primary/10 rounded-none uppercase tracking-widest text-xs py-6 flex items-center justify-center gap-2"
                        onClick={() => window.open(`${WHATSAPP_LINK}?text=Hi, I have a question about ${selectedProduct.name}`, "_blank")}
                      >
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
