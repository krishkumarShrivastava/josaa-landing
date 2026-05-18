
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Search, ArrowRight, ChevronRight, BookOpen, Layers, CheckCircle } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const colleges = [
  { id: "iit-bombay", name: "IIT Bombay", type: "IITs" },
  { id: "IITD", name: "IIT Delhi", type: "IITs" },
  { id: "IITM", name: "IIT Madras", type: "IITs" },
  { id: "IITK", name: "IIT Kanpur", type: "IITs" },
  { id: "IITKGP", name: "IIT Kharagpur", type: "IITs" },
  { id: "NITT", name: "NIT Trichy", type: "NITs" },
  { id: "NITW", name: "NIT Warangal", type: "NITs" },
  { id: "NITK", name: "NIT Surathkal", type: "NITs" },
  { id: "IIITH", name: "IIIT Hyderabad", type: "IIITs" },
  { id: "IIITA", name: "IIIT Allahabad", type: "IIITs" },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bgImageRef = useRef<HTMLImageElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [activeFilter, setActiveFilter] = useState("All");

  // 3D Tilt for Search Pill
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 30, stiffness: 400, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [0, 1], [15, -15]);
  const rotateY = useTransform(smoothX, [0, 1], [-15, 15]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(headlineRef.current, {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(searchContainerRef.current, {
        yPercent: -40,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(bgImageRef.current, {
        scale: 1.25,
        ease: "power3.out",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const filteredColleges =
    activeFilter === "All"
      ? colleges
      : colleges.filter((c) => c.type === activeFilter);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--foreground)] selection:text-[var(--background)] overflow-hidden">
      {/* HEADER */}
      <header className="absolute top-0 left-0 w-full z-50 p-6 mix-blend-difference text-white pointer-events-none">
        <nav className="flex justify-between items-center max-w-screen-2xl mx-auto pointer-events-auto">
          <div className="text-xl font-bold tracking-tighter uppercase">JoSAA '26</div>
          <div className="text-sm font-semibold tracking-widest uppercase hover-underline cursor-pointer">Menu</div>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section ref={heroRef} className="relative h-[120vh] w-full flex flex-col items-center justify-center bg-black">
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-70 pointer-events-none">
          <Image
            ref={bgImageRef}
            src="/assets/iit d.jpg"
            alt="IIT Delhi"
            width={1600}
            height={1000}
            className="object-cover w-full h-full transform origin-center"
            priority
          />
        </div>

        <div className="relative z-10 w-full max-w-screen-xl px-6 flex flex-col items-center text-center mt-20">
          <h1
            ref={headlineRef}
            className="text-[12vw] leading-[0.85] font-black tracking-tighter uppercase mb-16 text-white mix-blend-exclusion pointer-events-none"
          >
            Find your <br /> best college <br /> here.
          </h1>

          <div ref={searchContainerRef} className="w-full max-w-3xl perspective-[2000px] z-20">
            <motion.div
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full rounded-[40px] bg-white/95 backdrop-blur-md p-3 flex items-center shadow-[0_40px_80px_rgba(0,0,0,0.6),_inset_0_2px_4px_rgba(255,255,255,0.8)] border-t-[1px] border-white/80 ring-1 ring-black/5"
            >
              <div className="pl-6 text-gray-500" style={{ transform: "translateZ(30px)" }}>
                <Search size={32} />
              </div>
              <input
                type="text"
                placeholder="Search by rank, name, or city..."
                className="w-full bg-transparent text-black text-2xl md:text-3xl font-bold tracking-tight px-6 py-4 md:py-6 outline-none placeholder:text-gray-400"
                style={{ transform: "translateZ(40px)" }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-black text-white px-8 md:px-12 py-4 md:py-6 rounded-[32px] text-lg md:text-xl font-bold tracking-tight uppercase flex items-center gap-2 hover:bg-neutral-800 transition-colors shadow-[0_10px_20px_rgba(0,0,0,0.2)]"
                style={{ transform: "translateZ(60px)" }}
              >
                Search <ArrowRight size={24} />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS TICKER */}
      <section className="relative z-20 bg-[var(--background)] border-b-[6px] border-[var(--foreground)]">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y-6 md:divide-y-0 md:divide-x-[6px] divide-[var(--foreground)]">
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors duration-0 cursor-default">
            <h2 className="text-7xl md:text-[8vw] leading-none font-black tracking-tighter uppercase">119</h2>
            <p className="text-xl md:text-2xl font-bold uppercase tracking-widest mt-4">Institutes</p>
          </div>
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors duration-0 cursor-default">
            <h2 className="text-7xl md:text-[8vw] leading-none font-black tracking-tighter uppercase">55K+</h2>
            <p className="text-xl md:text-2xl font-bold uppercase tracking-widest mt-4">Total Seats</p>
          </div>
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors duration-0 cursor-default">
            <h2 className="text-7xl md:text-[8vw] leading-none font-black tracking-tighter uppercase">6</h2>
            <p className="text-xl md:text-2xl font-bold uppercase tracking-widest mt-4">Rounds</p>
          </div>
        </div>
      </section>

      {/* COUNSELING TIMELINE */}
      <section className="relative z-20 bg-[var(--background)] py-32 px-6">
        <div className="max-w-screen-2xl mx-auto">
          <h3 className="text-6xl md:text-9xl font-black tracking-tighter uppercase mb-20 border-b-[6px] border-[var(--foreground)] pb-8">
            The Process
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Registration", icon: BookOpen, desc: "Create your profile and enter JEE details." },
              { title: "Choice Filling", icon: Layers, desc: "Select and arrange your preferred courses." },
              { title: "Mock Seat", icon: CheckCircle, desc: "Preview your likely allocation based on rank." },
              { title: "Verification", icon: ChevronRight, desc: "Upload documents and finalize your seat." }
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col border-[4px] border-[var(--foreground)] p-8 hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors duration-0 group cursor-pointer relative overflow-hidden">
                <div className="mb-12">
                  <step.icon size={64} className="group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="text-2xl font-black tracking-widest uppercase mb-4 opacity-50">Step 0{idx + 1}</div>
                <h4 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-6 leading-tight">
                  {step.title}
                </h4>
                <p className="text-lg md:text-xl font-semibold opacity-80 max-w-xs">
                  {step.desc}
                </p>
                {/* 3D button exception inside flat card */}
                <div className="mt-12 perspective-[1000px]">
                  <motion.button 
                    whileHover={{ scale: 1.05, y: -5, rotateX: 10 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[var(--foreground)] text-[var(--background)] group-hover:bg-[var(--background)] group-hover:text-[var(--foreground)] px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm shadow-[0_10px_20px_rgba(0,0,0,0.2)] border border-transparent group-hover:border-[var(--background)] transform-style-3d group-hover:shadow-[0_20px_40px_rgba(255,255,255,0.2)]"
                  >
                    View Details
                  </motion.button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COLLEGE INDEX */}
      <section className="relative z-20 bg-[var(--background)] pb-32 px-6">
        <div className="max-w-screen-2xl mx-auto">
          <div className="sticky top-0 pt-6 pb-4 z-30 mb-12 bg-[var(--background)] border-b-[6px] border-[var(--foreground)] flex gap-6 overflow-x-auto no-scrollbar">
            {["All", "IITs", "NITs", "IIITs", "GFTIs"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`filter-btn px-6 py-2 text-2xl md:text-4xl ${activeFilter === filter ? "bg-[var(--foreground)] text-[var(--background)]" : ""}`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="flex flex-col border-b-[6px] border-[var(--foreground)]">
            {filteredColleges.map((college) => (
              <Link
                key={college.id}
                href={`/college/${college.id.toLowerCase()}`}
                className="group flex flex-col md:flex-row justify-between items-start md:items-center py-10 md:py-16 border-t-[6px] border-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors duration-0 cursor-pointer px-6"
              >
                <div className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none mb-4 md:mb-0">
                  {college.name}
                </div>
                <div className="text-2xl md:text-4xl font-bold tracking-widest uppercase md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-0 flex items-center gap-4">
                  {college.id.toUpperCase()} <ArrowRight size={40} />
                </div>
              </Link>
            ))}
            {filteredColleges.length === 0 && (
              <div className="py-12 text-4xl font-bold tracking-tighter uppercase text-center border-t-[6px] border-[var(--foreground)]">
                No colleges found in this category.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
