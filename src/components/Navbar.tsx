import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, LogIn, LogOut, RotateCcw } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCases } from "@/data/useCases";
import { supabase } from "@/integrations/supabase/client";

const SCALE_KEY = "tulip-text-scale";
const SCALE_MIN = 1;
const SCALE_MAX = 2;
const SCALE_DEFAULT = 1;

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileUseCasesOpen, setMobileUseCasesOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // ── Text scale ─────────────────────────────────────────────
  const [textScale, setTextScale] = useState<number>(SCALE_DEFAULT);
  const [scaleOpen, setScaleOpen] = useState(false);
  const scaleRef = useRef<HTMLDivElement>(null);

  const navRef = useRef<HTMLElement>(null);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  // Load persisted scale on mount
  useEffect(() => {
    const saved = parseFloat(localStorage.getItem(SCALE_KEY) ?? "");
    if (!isNaN(saved) && saved >= SCALE_MIN && saved <= SCALE_MAX) {
      setTextScale(saved);
    }
  }, []);

  // Apply scale globally via root font-size
  useEffect(() => {
    document.documentElement.style.fontSize = `${textScale * 100}%`;
    return () => { document.documentElement.style.fontSize = ""; };
  }, [textScale]);

  const updateScale = useCallback((val: number) => {
    const clamped = Math.min(SCALE_MAX, Math.max(SCALE_MIN, val));
    setTextScale(clamped);
    localStorage.setItem(SCALE_KEY, String(clamped));
  }, []);

  // Close popover on outside click
  useEffect(() => {
    if (!scaleOpen) return;
    const handler = (e: MouseEvent) => {
      if (scaleRef.current && !scaleRef.current.contains(e.target as Node)) {
        setScaleOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [scaleOpen]);

  // Auth
  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (!isHome && href.startsWith("#")) {
      window.location.href = "/" + href;
    }
  };

  const openDropdown = (id: string) => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setActiveDropdown(id);
  };

  const closeDropdown = () => {
    closeTimeout.current = setTimeout(() => setActiveDropdown(null), 200);
  };

  // Slider fill % (0–100)
  const fillPct = ((textScale - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100;

  return (
    <>
      {/* Top promo bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-card/80 backdrop-blur-xl border-b border-border/30">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 px-4 py-1.5 text-center">
          <span className="text-[11px] font-body text-white">📄</span>
          <a
            href="https://substack.com/@tuliptechrnd"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[22px] font-body font-medium text-gradient-chrome-animated hover:opacity-80 transition-opacity"
          >
            2026 Guide to GenAI for Game Content Developers, 3D Artists & Creative Techs
          </a>
          <span className="text-[22px] font-body text-white hidden sm:inline">→</span>
        </div>
      </div>

      <motion.nav
        ref={navRef}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-[32px] left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-glass" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-10 h-16">
          {/* Logo + text-scale button */}
          <div className="flex items-center gap-3">
            <Link to="/" className="font-display text-2xl font-bold tracking-tight text-foreground shrink-0">
              TULIP<span className="text-gradient-gold"> TECH R&D</span>
            </Link>

            {/* ── Text Scale Button ─────────────────────────── */}
            <div ref={scaleRef} className="relative order-last">
              <button
                onClick={() => setScaleOpen((o) => !o)}
                aria-label="Adjust text size"
                title="Adjust text size"
                className={`flex items-end gap-[2px] px-2.5 py-1.5 rounded-lg border transition-all select-none ${
                  scaleOpen
                    ? "border-white bg-white/10 text-white"
                    : "border-white/50 bg-transparent hover:bg-white/10 hover:border-white text-white/70 hover:text-white"
                }`}
              >
                <span style={{ fontSize: 9, lineHeight: 1, fontWeight: 600 }}>a</span>
                <span style={{ fontSize: 12, lineHeight: 1, fontWeight: 600 }}>A</span>
                <span style={{ fontSize: 16, lineHeight: 1, fontWeight: 700 }}>A</span>
              </button>

              {/* Popover */}
              <AnimatePresence>
                {scaleOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute left-0 top-full mt-2.5 w-64 bg-card/95 backdrop-blur-2xl border border-border/50 rounded-2xl shadow-2xl p-5 z-[70]"
                  >
                    {/* Header row */}
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-body font-semibold text-foreground/60 tracking-[0.12em] uppercase">
                        Text Size
                      </span>
                      <span className="text-base font-display font-bold text-primary tabular-nums">
                        {textScale.toFixed(2)}×
                      </span>
                    </div>

                    {/* aAA preview label */}
                    <div className="flex items-end gap-1 mb-4 text-foreground/40">
                      <span style={{ fontSize: `${9 * textScale}px`, lineHeight: 1, fontWeight: 600, transition: "font-size 0.1s" }}>a</span>
                      <span style={{ fontSize: `${12 * textScale}px`, lineHeight: 1, fontWeight: 600, transition: "font-size 0.1s" }}>A</span>
                      <span style={{ fontSize: `${16 * textScale}px`, lineHeight: 1, fontWeight: 700, transition: "font-size 0.1s" }}>A</span>
                    </div>

                    {/* Range slider */}
                    <input
                      type="range"
                      min={SCALE_MIN}
                      max={SCALE_MAX}
                      step={0.05}
                      value={textScale}
                      onChange={(e) => updateScale(Number(e.target.value))}
                      className="text-scale-slider mb-2"
                      style={{
                        background: `linear-gradient(to right, hsl(var(--primary)) ${fillPct}%, rgba(255,255,255,0.1) ${fillPct}%)`,
                      }}
                    />

                    {/* Track labels */}
                    <div className="flex justify-between mb-4">
                      {["1×", "1.5×", "2×"].map((l) => (
                        <span key={l} className="text-[9px] font-body text-white/60">{l}</span>
                      ))}
                    </div>

                    {/* Description */}
                    <p className="text-[10px] font-body text-white leading-relaxed mb-3">
                      Scales all text on the page. Your preference is saved automatically.
                    </p>

                    {/* Reset */}
                    <button
                      onClick={() => updateScale(SCALE_DEFAULT)}
                      disabled={textScale === SCALE_DEFAULT}
                      className="flex items-center justify-center gap-1.5 w-full text-[11px] font-body font-medium text-white hover:text-foreground transition-colors py-1.5 rounded-lg hover:bg-secondary/40 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset to default
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <div
              onMouseEnter={() => openDropdown("usecases")}
              onMouseLeave={closeDropdown}
              className="relative"
            >
              <Link
                to="/case-studies"
                className="flex items-center gap-1 text-[15px] font-body font-medium text-white/80 hover:text-white transition-colors whitespace-nowrap"
              >
                Case Studies
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === "usecases" ? "rotate-180" : ""}`} />
              </Link>
            </div>

            <Link
              to="/library"
              className="text-[15px] font-body font-medium text-white/80 hover:text-white transition-colors whitespace-nowrap"
            >
              R&D Library
            </Link>

            {navLinks.map((link) =>
              isHome ? (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[15px] font-body font-medium text-white/80 hover:text-white transition-colors whitespace-nowrap"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  to={`/${link.href}`}
                  className="text-[15px] font-body font-medium text-white/80 hover:text-white transition-colors whitespace-nowrap"
                >
                  {link.label}
                </Link>
              )
            )}

            <a
              href="#interactive-demo"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById("interactive-demo");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="nav-rainbow-btn text-[14px] font-body font-semibold text-white px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity min-h-[40px] flex items-center"
            >
              Build AI Pipeline Demo
            </a>

            <a
              href={isHome ? "#estimator" : "/#estimator"}
              className="text-[14px] font-body font-semibold bg-primary text-primary-foreground px-5 py-2.5 rounded-full hover:opacity-90 transition-all min-h-[40px] flex items-center whitespace-nowrap"
            >
              Get a Quote
            </a>

            {/* Auth */}
            {user ? (
              <button
                onClick={async () => { await supabase.auth.signOut(); navigate("/"); }}
                className="flex items-center gap-1.5 text-[14px] font-body text-white hover:text-foreground transition-colors min-h-[44px] min-w-[44px] justify-center"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-1.5 text-[14px] font-body text-white hover:text-foreground transition-colors min-h-[44px] min-w-[44px] justify-center"
              >
                <LogIn className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-foreground min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Case Studies dropdown */}
        <AnimatePresence>
          {activeDropdown === "usecases" && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onMouseEnter={() => openDropdown("usecases")}
              onMouseLeave={closeDropdown}
              className="absolute left-0 right-0 top-full bg-[#111]/98 backdrop-blur-2xl border-b border-border/30 shadow-2xl"
            >
              <div className="max-w-6xl mx-auto py-9 px-6 lg:px-10">

                {/* Tagline */}
                <p className="text-lg font-display font-semibold text-white mb-8 max-w-2xl leading-snug" style={{ letterSpacing: "-0.01em" }}>
                  Teamed by researchers and developers from the gaming industry who are unafraid to challenge the status quo.
                </p>

                {/* Case Studies */}
                <p className="text-[10px] tracking-[0.18em] uppercase text-white/30 font-body font-medium mb-4">Case Studies</p>
                <div className="grid grid-cols-4 mb-8" style={{ gap: "1px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  {[
                    {
                      label: "Concept & Development",
                      to: "/case-studies/pre-production",
                      desc: "AI-powered ideation — rapid character concepts, world building, and visual style exploration from prompt to prototype.",
                      img: "/concept-development.jpg",
                      imgAlt: "Concept & Development — Idea and Story",
                      paper: { href: "#", label: "White Paper" },
                      repo:  { href: "#", label: "GitHub" },
                    },
                    {
                      label: "Pre-Production",
                      to: "/case-studies/pre-production",
                      desc: "AI storyboard automation & previz — from script to animatic in minutes.",
                      img: "/pre-production.jpg",
                      imgAlt: "Pre-Production storyboard",
                      paper: { href: "https://www.jetir.org/papers/JETIR2507537.pdf", label: "White Paper" },
                      repo:  { href: "https://github.com/wonderunit/storyboarder", label: "GitHub" },
                    },
                    {
                      label: "Production Pipeline",
                      to: "/case-studies/production",
                      desc: "Unity tools for zero-G visuals — AI-augmented physics and motion synthesis.",
                      img: "/production-pipeline.jpg",
                      imgAlt: "Production pipeline",
                      paper: { href: "https://dev.epicgames.com/documentation/en-us/unreal-engine/virtual-production-field-guide", label: "White Paper" },
                      repo:  { href: "https://github.com/EpicGames/UnrealEngine", label: "GitHub" },
                    },
                    {
                      label: "Post-Production",
                      to: "/case-studies/post-production",
                      desc: "AI render polish & compositing — perceptual quality enhancement without full re-renders.",
                      img: "/post-production.jpg",
                      imgAlt: "Post-production",
                      paper: { href: "https://www.obukhov.ai/repainting_3d_assets", label: "White Paper" },
                      repo:  { href: "https://github.com/toshas/torch-fidelity", label: "GitHub" },
                    },
                  ].map((item) => (
                    <div key={item.to} className="group flex flex-col bg-[#111] hover:bg-[#1a1a1a] transition-colors">
                      {/* Image */}
                      <Link
                        to={item.to}
                        onClick={() => setActiveDropdown(null)}
                        className="block overflow-hidden transition-all duration-300 group/img"
                        style={{ aspectRatio: "16/9" }}
                      >
                        <div
                          className="w-full h-full transition-all duration-300"
                          style={{
                            backgroundImage: `url(${item.img})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center center",
                            backgroundRepeat: "no-repeat",
                            filter: "brightness(0.75) saturate(0.8)",
                          }}
                        />
                      </Link>
                      {/* Body */}
                      <Link to={item.to} onClick={() => setActiveDropdown(null)} className="flex-1 px-4 pt-3.5 pb-2.5 block">
                        <p className="text-[11px] font-display font-semibold uppercase tracking-wide text-foreground mb-1.5 leading-snug">{item.label}</p>
                        <p className="text-[11px] font-body text-white/50 leading-relaxed">{item.desc}</p>
                      </Link>
                      {/* Footer links */}
                      <div className="px-4 pb-3.5 pt-2.5 flex gap-3 border-t border-white/[0.06]">
                        <a
                          href={item.paper.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[11px] font-body text-white/40 hover:text-white transition-colors"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                          {item.paper.label}
                        </a>
                        <a
                          href={item.repo.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[11px] font-body text-white/40 hover:text-white transition-colors"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.66-.22.66-.48v-1.7C6.73 19.91 6.14 18 6.14 18c-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0112 6.8c.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.16.58.67.48A10.01 10.01 0 0022 12c0-5.52-4.48-10-10-10z"/></svg>
                          {item.repo.label}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Use Cases */}
                <p className="text-[10px] tracking-[0.18em] uppercase text-white/30 font-body font-medium mb-4">Use Cases</p>
                <div className="grid grid-cols-4 gap-0 border-t border-white/[0.07] pt-6">
                  {useCases.map((uc) => {
                    const Icon = uc.icon;
                    return (
                      <Link
                        key={uc.slug}
                        to={`/use-cases/${uc.slug}`}
                        onClick={() => setActiveDropdown(null)}
                        className="group flex items-start gap-3 py-2.5 pr-5 hover:opacity-75 transition-opacity"
                      >
                        <div className="w-[34px] h-[34px] rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(255,255,255,0.07)" }}>
                          <Icon className="w-4 h-4 text-white/60" />
                        </div>
                        <div>
                          <p className="text-[13px] font-body font-medium text-foreground mb-0.5">{uc.shortTitle}</p>
                          <p className="text-[11.5px] font-body text-white/40 leading-snug">{uc.tagline}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden bg-glass overflow-hidden"
            >
              <div className="flex flex-col gap-1 px-6 py-6">
                <button
                  onClick={() => setMobileUseCasesOpen(!mobileUseCasesOpen)}
                  className="flex items-center justify-between text-foreground font-body text-base py-3 min-h-[44px]"
                >
                  Case Studies
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileUseCasesOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {mobileUseCasesOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-0.5 pl-4 pb-2">
                        <Link to="/case-studies" onClick={() => setMobileOpen(false)} className="text-white font-body text-sm py-3 hover:text-primary transition-colors font-semibold min-h-[44px] flex items-center">All Case Studies</Link>
                        {[
                          { label: "Pre-Production", to: "/case-studies/pre-production" },
                          { label: "Production", to: "/case-studies/production" },
                          { label: "Post-Production", to: "/case-studies/post-production" },
                          { label: "Steam Game Delays", to: "/case-studies/steam-delays" },
                        ].map((item) => (
                          <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className="text-white font-body text-sm py-3 hover:text-primary transition-colors min-h-[44px] flex items-center">{item.label}</Link>
                        ))}
                        <p className="text-[10px] tracking-[0.15em] uppercase text-white/60 font-body mt-2 mb-1">Use Cases</p>
                        {useCases.map((uc) => (
                          <Link key={uc.slug} to={`/use-cases/${uc.slug}`} onClick={() => setMobileOpen(false)} className="text-white font-body text-sm py-3 hover:text-primary transition-colors min-h-[44px] flex items-center">{uc.shortTitle}</Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Link to="/library" onClick={() => setMobileOpen(false)} className="text-foreground font-body text-base py-3 min-h-[44px] flex items-center">R&D Library</Link>

                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={isHome ? link.href : `/${link.href}`}
                    onClick={() => handleNavClick(link.href)}
                    className="text-foreground font-body text-base py-3 min-h-[44px] flex items-center"
                  >
                    {link.label}
                  </a>
                ))}

                <a
                  href={isHome ? "#estimator" : "/#estimator"}
                  onClick={() => setMobileOpen(false)}
                  className="bg-primary text-primary-foreground px-5 py-3 rounded-full text-center font-semibold mt-3 text-sm min-h-[44px] flex items-center justify-center"
                >
                  Get a Quote
                </a>

                {/* Mobile text scale */}
                <div className="mt-4 pt-4 border-t border-border/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-end gap-[2px] text-foreground/60">
                      <span style={{ fontSize: 9, lineHeight: 1, fontWeight: 600 }}>a</span>
                      <span style={{ fontSize: 12, lineHeight: 1, fontWeight: 600 }}>A</span>
                      <span style={{ fontSize: 16, lineHeight: 1, fontWeight: 700 }}>A</span>
                      <span className="text-[11px] font-body text-white ml-2">Text Size</span>
                    </div>
                    <span className="text-sm font-display font-bold text-primary">{textScale.toFixed(2)}×</span>
                  </div>
                  <input
                    type="range"
                    min={SCALE_MIN}
                    max={SCALE_MAX}
                    step={0.05}
                    value={textScale}
                    onChange={(e) => updateScale(Number(e.target.value))}
                    className="text-scale-slider"
                    style={{
                      background: `linear-gradient(to right, hsl(var(--primary)) ${fillPct}%, rgba(255,255,255,0.1) ${fillPct}%)`,
                    }}
                  />
                  <div className="flex justify-between mt-1.5">
                    {["1×", "1.5×", "2×"].map((l) => (
                      <span key={l} className="text-[9px] font-body text-white/60">{l}</span>
                    ))}
                  </div>
                </div>

                {user ? (
                  <button
                    onClick={async () => { await supabase.auth.signOut(); setMobileOpen(false); navigate("/"); }}
                    className="flex items-center justify-center gap-2 text-white font-body text-sm py-3 hover:text-primary transition-colors min-h-[44px]"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 text-white font-body text-sm py-3 hover:text-primary transition-colors min-h-[44px]"
                  >
                    <LogIn className="w-4 h-4" /> Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Backdrop */}
      <AnimatePresence>
        {activeDropdown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40"
            onClick={() => setActiveDropdown(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
