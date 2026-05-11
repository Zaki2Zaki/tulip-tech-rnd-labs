import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ClipboardCheck, ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import CalendlyBookingButton from "./CalendlyBookingButton";

const rotatingTexts = ["0→1", "N→1"];

const pipelineSteps = [
  "Discover",
  "Prototype",
  "Adopt",
  "Integrate",
  "Scale",
];

const HeroSection = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative flex items-center overflow-hidden" style={{ minHeight: "95vh" }}>
      {/* Background Video + Overlays */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Tulip Technology hero"
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ${videoLoaded ? "opacity-0" : "opacity-100"}`}
          loading="eager"
        />
        <video
          ref={videoRef}
          autoPlay muted loop playsInline
          onCanPlay={() => setVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${videoLoaded ? "opacity-100" : "opacity-0"}`}
          style={{ filter: "blur(2px)" }}
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        {/* Left-heavy gradient overlay for readability */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.78), rgba(0,0,0,0.35))" }} />
        {/* Bottom fade to background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      {/* Grid Container */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 md:px-10 lg:px-12 py-24 md:pt-36 md:pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
          {/* Left: Content Block */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col gap-6 lg:col-span-2 pl-72"
          >
            {/* Title */}
            <h1 className="font-display font-bold leading-tight tracking-[-0.03em] text-6xl md:text-7xl">
              <span className="text-gradient-chrome-animated">Tulip Technology R&D™</span>
            </h1>

            {/* Tagline + body copy */}
            <div className="space-y-4 mt-2">
              <p className="text-3xl md:text-4xl font-display font-semibold text-white leading-tight">
                AI Labs That Ship{" "}
                <span
                  className="inline-block overflow-hidden align-bottom relative"
                  style={{ height: "1.15em", width: "2.6em" }}
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={textIndex}
                      initial={{ y: "-100%", opacity: 0 }}
                      animate={{ y: "0%", opacity: 1 }}
                      exit={{ y: "100%", opacity: 0 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                      className="absolute inset-0 flex items-center"
                    >
                      {rotatingTexts[textIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>{" "}
                Systems
              </p>

              <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-3xl">
                3D Workflow &amp; Tools Experiments → GenAI Production Systems
              </p>

              <p className="text-base md:text-lg text-gray-300 leading-relaxed max-w-3xl">
                Test &amp; Validate your DCC ideas into game engines, 3D animation pipelines and workflows
              </p>

              <p className="text-base md:text-lg text-gray-300 leading-relaxed max-w-3xl">
                We{" "}
                <span className="text-gradient-tulip-ombre font-bold">love</span>{" "}
                discovering solutions to the integration challenges that slow down creatives and technical leaders.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-2 mt-2">
              {/* Row 1 — Book a Call + Get Estimate */}
              <div className="flex gap-2">
                <CalendlyBookingButton
                  label="Book a Call"
                  className="hero-btn-explore hero-btn-bloom px-6 py-2.5 rounded-full font-display font-semibold text-sm transition-all min-h-[40px] flex items-center justify-center gap-1.5"
                />

                <a
                  href="#estimator"
                  className="hero-btn-quote hero-btn-bloom px-6 py-2.5 rounded-full font-display font-semibold text-sm transition-all min-h-[40px] flex items-center justify-center"
                >
                  Get Estimate
                </a>
              </div>

              {/* Row 2 — 2-min Assessment left-aligned */}
              <div className="flex">
                <a
                  href="#interactive-demo"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("interactive-demo")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-6 py-2.5 rounded-full border-0 transition-opacity hover:opacity-90 min-h-[40px] flex items-center justify-center"
                  style={{ background: "linear-gradient(to right, #E5B4E2, #D4A5D4, #C8B5E8)" }}
                >
                  <span className="text-[#4A1942] font-semibold flex items-center gap-2 text-sm font-display">
                    📋 Workflow & Cost Analyzer
                  </span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right: reserved for future visual */}
          <div className="hidden lg:block" />
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-5 h-8 border border-foreground/20 rounded-full flex justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 bg-primary/60 rounded-full" />
        </motion.div>
      </motion.div>

    </section>
  );
};

export default HeroSection;
