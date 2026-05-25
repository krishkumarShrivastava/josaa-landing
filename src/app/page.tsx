"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Search, ArrowRight, ChevronRight, BookOpen, Layers, CheckCircle } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

import { masterColleges, collegeShortNames } from "@/data/compiledColleges";
const colleges = masterColleges;

// Helper to map raw JSON institute names to standard college IDs
const matchInstitute = (rawName: string) => {
  if (!rawName) return null;
  const n = rawName.toLowerCase();
  let typePrefix = "";
  if (n.includes("indian institute  of technology") || n.includes("indian institute of technology")) typePrefix = "iit-";
  else if (n.includes("national institute of technology")) typePrefix = "nit-";
  else if (n.includes("indian institute of information technology")) typePrefix = "iiit-";
  
  if (typePrefix) {
    for (const c of masterColleges) {
       if (c.id.startsWith(typePrefix)) {
          const locationPart = c.id.replace(typePrefix, "").replace(/-/g, " ");
          if (n.includes(locationPart)) return c.id;
       }
    }
  }
  for (const c of masterColleges) {
     const aliases = collegeShortNames[c.id] || [];
     for (const a of aliases) {
         if (a.length > 4 && n.includes(a)) return c.id;
     }
  }
  return null;
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bgImageRef = useRef<HTMLImageElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Rank Predictor State
  const [selectedRound, setSelectedRound] = useState(5);
  const [instituteTypeToggle, setInstituteTypeToggle] = useState("Both");
  const [cutoffData, setCutoffData] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

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

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const element = document.getElementById("college-index");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isRankMode = /^\d+$/.test(searchQuery.trim());
  const userRank = isRankMode ? parseInt(searchQuery.trim(), 10) : 0;

  useEffect(() => {
    if (!isRankMode) return;

    let isMounted = true;
    const fetchCutoffData = async () => {
      setIsLoadingData(true);
      try {
        let dataModule;
        switch (selectedRound) {
          case 1: dataModule = await import("@/data/round1_cutoffs.json"); break;
          case 2: dataModule = await import("@/data/round2_cutoffs.json"); break;
          case 3: dataModule = await import("@/data/round3_cutoffs.json"); break;
          case 4: dataModule = await import("@/data/round4_cutoffs.json"); break;
          case 5: dataModule = await import("@/data/round5_cutoffs.json"); break;
          case 6: dataModule = await import("@/data/round6_cutoffs.json"); break;
          default: dataModule = await import("@/data/round5_cutoffs.json"); break;
        }
        if (isMounted) {
          setCutoffData(dataModule.default);
        }
      } catch (err) {
        console.error("Error loading cutoff data:", err);
      } finally {
        if (isMounted) {
          setIsLoadingData(false);
        }
      }
    };
    fetchCutoffData();

    return () => { isMounted = false; };
  }, [selectedRound, isRankMode]);

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

  // Compute safe matches
  const safeMatchesByCollege = new Map<string, any[]>();
  
  if (isRankMode && cutoffData.length > 0) {
    cutoffData.forEach(entry => {
      // "Seat Type": "OPEN", "Gender": "Gender-Neutral"
      if (entry["Seat Type"] === "OPEN" && entry["Gender"] === "Gender-Neutral") {
        const closingRank = parseInt(entry["Closing Rank"], 10);
        if (closingRank >= userRank) {
          const matchedId = matchInstitute(entry["Institute"]);
          if (matchedId) {
             const existing = safeMatchesByCollege.get(matchedId) || [];
             existing.push(entry);
             safeMatchesByCollege.set(matchedId, existing);
          }
        }
      }
    });
  }

  const filteredColleges = colleges.filter((c) => {
    // 0. Institute Type Toggle
    if (instituteTypeToggle === "IIT" && c.type !== "IITs") return false;
    if (instituteTypeToggle === "Non-IIT" && c.type === "IITs") return false;

    // 1. Category Filter
    if (activeFilter !== "All" && c.type !== activeFilter) {
      return false;
    }
    
    // 2. Search Query Filter
    if (searchQuery.trim() !== "") {
      if (isRankMode) {
        return safeMatchesByCollege.has(c.id);
      } else {
        const query = searchQuery.toLowerCase().trim();
        
        // Match name
        const matchesName = c.name.toLowerCase().includes(query);
        
        // Match ID directly
        const matchesId = c.id.toLowerCase().replace(/-/g, "").includes(query.replace(/-/g, ""));
        
        // Match Abbreviation & Location aliases from our custom dictionary
        const aliases = collegeShortNames[c.id] || collegeShortNames[c.id.toLowerCase()] || [];
        const matchesAlias = aliases.some(alias => alias.toLowerCase().includes(query));
        
        return matchesName || matchesId || matchesAlias;
      }
    }
    
    return true;
  });

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchSubmit();
                  }
                }}
                className="w-full bg-transparent text-black text-2xl md:text-3xl font-bold tracking-tight px-6 py-4 md:py-6 outline-none placeholder:text-gray-400"
                style={{ transform: "translateZ(40px)" }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSearchSubmit()}
                className="bg-black text-white px-8 md:px-12 py-4 md:py-6 rounded-[32px] text-lg md:text-xl font-bold tracking-tight uppercase flex items-center gap-2 hover:bg-neutral-800 transition-colors shadow-[0_10px_20px_rgba(0,0,0,0.2)]"
                style={{ transform: "translateZ(60px)" }}
              >
                {isLoadingData ? "Loading Data..." : "Search"} <ArrowRight size={24} className={isLoadingData ? "animate-pulse" : ""} />
              </motion.button>
            </motion.div>
            
            <div className="flex flex-col md:flex-row gap-4 mt-8 items-center justify-center pointer-events-auto" style={{ transform: "translateZ(40px)" }}>
               <div className="flex bg-white/10 p-1 rounded-full backdrop-blur-md shadow-[0_10px_20px_rgba(0,0,0,0.4)] border border-white/20">
                 {["Both", "IIT", "Non-IIT"].map((type) => (
                   <button
                     key={type}
                     onClick={() => setInstituteTypeToggle(type)}
                     className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-colors ${
                       instituteTypeToggle === type 
                         ? "bg-white text-black shadow-sm" 
                         : "text-white hover:text-white hover:bg-white/20"
                     }`}
                   >
                     {type}
                   </button>
                 ))}
               </div>
               
               <div className="relative group shadow-[0_10px_20px_rgba(0,0,0,0.4)] rounded-full">
                 <select
                   value={selectedRound}
                   onChange={(e) => setSelectedRound(Number(e.target.value))}
                   className="appearance-none bg-white/10 text-white border border-white/20 px-6 py-2 pr-10 rounded-full text-sm font-bold uppercase tracking-wider backdrop-blur-md outline-none cursor-pointer hover:bg-white/20 transition-colors"
                 >
                   {[1, 2, 3, 4, 5, 6].map((round) => (
                     <option key={round} value={round} className="bg-neutral-900 text-white">
                       Round {round}
                     </option>
                   ))}
                 </select>
                 <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white">
                   <ChevronRight size={16} className="rotate-90" />
                 </div>
               </div>
            </div>
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
      <section id="college-index" className="relative z-20 bg-[var(--background)] pb-32 px-6">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 min-w-0 overflow-hidden">
            {filteredColleges.map((college) => {
              // 1. Accents styling conditional coloring
              // GFTI: Neon Green palette (border-green-500, text-green-400)
              // IIIT: Neon Orange palette (border-orange-500, text-orange-400)
              // IIT / NIT: Luminous Blue palette (border-blue-500, text-blue-400)
              let borderClass = "border-[#3B82F6]/40 hover:border-[#3B82F6] hover:shadow-[0_0_20px_rgba(59,130,246,0.25)]";
              let textAccentClass = "text-[#60A5FA]";
              let bgAccentClass = "bg-[#3B82F6]/10";
              let hoverBtnClass = "group-hover:bg-[#3B82F6] group-hover:text-black";
              let typeLabel = "IIT";
              
              if (college.type === "GFTIs") {
                borderClass = "border-green-500/40 hover:border-green-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.25)]";
                textAccentClass = "text-green-400";
                bgAccentClass = "bg-green-500/10";
                hoverBtnClass = "group-hover:bg-green-500 group-hover:text-black";
                typeLabel = "GFTI";
              } else if (college.type === "IIITs") {
                borderClass = "border-orange-500/40 hover:border-orange-400 hover:shadow-[0_0_20px_rgba(249,115,22,0.25)]";
                textAccentClass = "text-orange-400";
                bgAccentClass = "bg-orange-500/10";
                hoverBtnClass = "group-hover:bg-orange-500 group-hover:text-black";
                typeLabel = "IIIT";
              } else if (college.type === "NITs") {
                typeLabel = "NIT";
              }

              return (
                <Link
                  key={college.id}
                  href={`/college/${college.id.toLowerCase()}`}
                  className={`group relative flex flex-col justify-between bg-black border-[4px] p-6 md:p-8 transition-all duration-300 ease-out cursor-pointer min-w-0 break-words ${borderClass}`}
                >
                  {/* Top row with micro-badge */}
                  <div className="flex justify-between items-center mb-6">
                    <span className={`px-3 py-1 text-xs font-mono font-bold tracking-widest uppercase border border-current ${textAccentClass} ${bgAccentClass}`}>
                      {typeLabel}
                    </span>
                    <span className="text-xs font-mono text-gray-500 tracking-wider">
                      {college.id.toUpperCase().substring(0, 15)}
                    </span>
                  </div>

                  {/* Body with giant brutalist college name */}
                  <div className="flex-grow flex flex-col justify-end mb-8 min-w-0">
                    <h4 className="text-2xl md:text-3xl font-black tracking-tighter uppercase leading-none text-white break-words w-full">
                      {college.name}
                    </h4>
                    {isRankMode && safeMatchesByCollege.has(college.id) && (
                      <div className="mt-4 flex flex-wrap gap-2">
                         {safeMatchesByCollege.get(college.id)?.slice(0, 3).map((match, idx) => (
                            <span key={idx} className="bg-[#3B82F6]/20 text-[#60A5FA] border border-[#3B82F6]/50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider break-words max-w-full truncate" title={match["Academic Program Name"]}>
                               {match["Academic Program Name"].replace(" (4 Years, Bachelor of Technology)", "").replace(" (5 Years, Bachelor and Master of Technology (Dual Degree))", "")} - Rank: {match["Closing Rank"]}
                            </span>
                         ))}
                         {(safeMatchesByCollege.get(college.id)?.length || 0) > 3 && (
                            <span className="bg-[#3B82F6]/20 text-[#60A5FA] border border-[#3B82F6]/50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider">
                               +{(safeMatchesByCollege.get(college.id)?.length || 0) - 3} More Matches
                            </span>
                         )}
                      </div>
                    )}
                  </div>

                  {/* Bottom interactive action bar */}
                  <div className="flex justify-between items-center border-t border-gray-800 pt-4 mt-auto">
                    <span className="text-xs font-mono font-bold tracking-widest text-gray-400 group-hover:text-white transition-colors uppercase">
                      Explore Portal
                    </span>
                    <div className={`p-2 border border-current rounded-full transition-all duration-300 ${textAccentClass} ${hoverBtnClass}`}>
                      <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
            {filteredColleges.length === 0 && (
              <div className="col-span-full py-20 px-8 border-[4px] border-dashed border-gray-800 bg-black text-white text-center font-bold flex flex-col items-center justify-center w-full min-w-0">
                <span className="text-sm font-mono uppercase tracking-widest text-[#3B82F6] mb-4">Search System v1.0</span>
                <p className="text-3xl md:text-5xl font-black uppercase tracking-tighter max-w-2xl leading-none">
                  No institutes match your search. Try adjusting your keywords.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
