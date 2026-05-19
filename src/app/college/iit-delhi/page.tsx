"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import iitDelhiData from "../../../data/iit-delhi.json";

gsap.registerPlugin(ScrollTrigger);

const TABS = ["Overview", "Placements", "Rankings", "Admission", "Fees", "Seat Matrix"] as const;

// Seat Matrix Mock for Delhi to preserve consistent layout
const SEAT_MATRIX_DATA: Record<string, Record<string, { name: string; seats: number; courseType: string }[]>> = {
  "General": {
    "Gender-Neutral": [
      { name: "Computer Science and Engineering", seats: 45, courseType: "4-Year B.Tech. Course" },
      { name: "Mathematics and Computing", seats: 30, courseType: "4-Year B.Tech. Course" },
      { name: "Electrical Engineering", seats: 40, courseType: "4-Year B.Tech. Course" },
      { name: "Mechanical Engineering", seats: 35, courseType: "4-Year B.Tech. Course" },
      { name: "Chemical Engineering", seats: 30, courseType: "4-Year B.Tech. Course" },
      { name: "Civil Engineering", seats: 32, courseType: "4-Year B.Tech. Course" }
    ],
    "Female-Only": [
      { name: "Computer Science and Engineering", seats: 10, courseType: "4-Year B.Tech. Course" },
      { name: "Mathematics and Computing", seats: 8, courseType: "4-Year B.Tech. Course" },
      { name: "Electrical Engineering", seats: 12, courseType: "4-Year B.Tech. Course" },
      { name: "Mechanical Engineering", seats: 10, courseType: "4-Year B.Tech. Course" },
      { name: "Chemical Engineering", seats: 8, courseType: "4-Year B.Tech. Course" },
      { name: "Civil Engineering", seats: 8, courseType: "4-Year B.Tech. Course" }
    ]
  },
  "OBC-NCL": {
    "Gender-Neutral": [
      { name: "Computer Science and Engineering", seats: 28, courseType: "4-Year B.Tech. Course" },
      { name: "Mathematics and Computing", seats: 20, courseType: "4-Year B.Tech. Course" }
    ],
    "Female-Only": [
      { name: "Computer Science and Engineering", seats: 7, courseType: "4-Year B.Tech. Course" }
    ]
  }
};

const CATEGORIES = ["All", "General", "OBC-NCL"];
const POOLS = ["All", "Gender Neutral", "Female Only"];

// Helper function to extract year from ranking rank string (e.g. "389 (2026)" -> 2026)
function getYearFromRank(rankStr?: string): number {
  if (!rankStr) return 2025;
  const match = rankStr.match(/\((\d{4})\)/);
  return match ? parseInt(match[1], 10) : 2025;
}

export default function IITDelhiDetailPage() {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>("Overview");
  const [logoError, setLogoError] = useState(false);
  const [buildingError, setBuildingError] = useState(false);
  const [placementType, setPlacementType] = useState<"btech" | "dualDegree">("btech");

  // Seat Matrix States
  const [seatCategory, setSeatCategory] = useState("All");
  const [seatPool, setSeatPool] = useState("All");

  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const buildingRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (buildingRef.current) {
        gsap.fromTo(buildingRef.current,
          { scale: 1 },
          {
            scale: 1.15,
            transformOrigin: "bottom center",
            ease: "power2.out",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            }
          }
        );
      }
      if (headlineRef.current) {
        gsap.to(headlineRef.current, {
          yPercent: -100,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          }
        });
      }
    }, heroRef);
    return () => ctx.revert();
  }, []);

  // Combine rankings into unified list sorted by year
  const unifiedRankings = [
    ...(iitDelhiData?.rankings?.international || []).map(r => ({ ...r, scope: "International" })),
    ...(iitDelhiData?.rankings?.national || []).map(r => ({ ...r, scope: "National" }))
  ].sort((a, b) => getYearFromRank(b.rank) - getYearFromRank(a.rank));

  return (
    <main className="min-h-screen bg-[#000000] text-[#FFFFFF] font-sans selection:bg-[#3B82F6] selection:text-[#000000] overflow-hidden flex flex-col relative">
      
      {/* Background Deep Luminous wash */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{
        background: 'radial-gradient(circle at 50% 0%, #001432 0%, #000000 80%)'
      }} />

      <div className="relative z-10 w-full flex flex-col flex-1">
        
        {/* Cinematic Brutalist Hero */}
        <section ref={heroRef} className="relative w-full h-[100vh] flex flex-col justify-end overflow-hidden pt-12 px-6 pb-0 border-b-[1px] border-[#1E293B]">
          
          <div className="absolute top-12 left-6 z-20 w-16 h-16 md:w-24 md:h-24">
            {!logoError ? (
              <img 
                src="/iitd-logo.png" 
                alt="IIT Delhi Logo" 
                className="w-full h-full object-contain grayscale"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="w-full h-full bg-[#111111] flex items-center justify-center text-[10px] text-white break-words text-center border-[1px] border-[#1E293B]">
                {iitDelhiData?.basicInfo?.alsoKnownAs || "IITD"}
              </div>
            )}
          </div>

          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none mix-blend-difference text-white">
            <h1 ref={headlineRef} className="text-[14vw] leading-[0.75] font-black tracking-tighter uppercase whitespace-normal text-center break-words max-w-[90vw]">
              {iitDelhiData?.basicInfo?.name}
            </h1>
          </div>

          <div className="relative w-full h-[70vh] flex justify-center items-end z-0 pointer-events-none">
            {!buildingError ? (
              <img 
                ref={buildingRef}
                src="/iit-delhi-building.png"
                alt="IIT Delhi Campus Building"
                className="w-full max-w-screen-2xl h-full object-cover object-bottom"
                onError={() => setBuildingError(true)}
              />
            ) : (
              <div ref={buildingRef} className="w-full h-full bg-[#0A0A0A] flex items-center justify-center text-2xl uppercase tracking-widest text-white border-[1px] border-[#1E293B]">
                IIT Delhi Campus
              </div>
            )}
          </div>
        </section>

        {/* Sticky Sub-Nav */}
        <div className="sticky top-0 z-50 bg-[#000000]/90 backdrop-blur-md border-b-[1px] border-[#1E293B]">
          <nav className="max-w-screen-2xl mx-auto px-6 flex overflow-x-auto no-scrollbar gap-8 md:gap-16 pt-6">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xl md:text-3xl font-bold uppercase tracking-tighter transition-none whitespace-nowrap pb-4 border-b-[4px] px-4 ${
                  activeTab === tab 
                  ? "border-[#3B82F6] text-[#3B82F6]" 
                  : "border-transparent text-neutral-500 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Page Content */}
        <div className="flex-1 w-full max-w-screen-2xl mx-auto px-6 py-20 min-w-0 flex flex-col">
          {activeTab === "Overview" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-w-0 animate-in fade-in duration-500 overflow-hidden break-words">
              
              <div className="border-[1px] border-[#1E293B] p-8 md:p-12 col-span-1 md:col-span-2 min-w-0 overflow-hidden break-words flex flex-col justify-between hover:bg-[#1E293B] hover:text-[#FFFFFF] transition-none cursor-default bg-[#0A0A0A]">
                <span className="text-sm font-mono uppercase tracking-widest mb-8 opacity-60">Full Name</span>
                <p className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] break-words">{iitDelhiData?.basicInfo?.name}</p>
              </div>

              <div className="border-[1px] border-[#1E293B] p-8 md:p-12 min-w-0 overflow-hidden break-words flex flex-col justify-between hover:bg-[#1E293B] hover:text-[#FFFFFF] transition-none cursor-default bg-[#0A0A0A]">
                <span className="text-sm font-mono uppercase tracking-widest mb-8 opacity-60">Type / Est.</span>
                <p className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-[0.9] break-words">{iitDelhiData?.basicInfo?.type}</p>
                <p className="text-6xl font-black tracking-tighter text-[#3B82F6] mt-4">{iitDelhiData?.basicInfo?.established}</p>
              </div>

              <div className="border-[1px] border-[#1E293B] p-8 md:p-12 col-span-1 md:col-span-2 min-w-0 overflow-hidden break-words flex flex-col gap-4 hover:bg-[#1E293B] hover:text-[#FFFFFF] transition-none cursor-default bg-[#0A0A0A]">
                <span className="text-sm font-mono uppercase tracking-widest opacity-60">Location</span>
                <p className="text-3xl md:text-4xl font-black tracking-tighter uppercase break-words">{iitDelhiData?.basicInfo?.location}</p>
              </div>

              <div className="border-[1px] border-[#1E293B] p-8 md:p-12 min-w-0 overflow-hidden break-words flex flex-col gap-4 bg-[#0A0A0A]">
                <span className="text-sm font-mono uppercase tracking-widest opacity-60">Campus Facilities</span>
                <div className="flex flex-wrap gap-3 mt-2">
                  {(iitDelhiData?.basicInfo?.campusFacilities || []).map((f) => (
                    <span key={f} className="border-[1px] border-[#1E293B] px-4 py-2 text-sm font-bold uppercase tracking-widest hover:bg-[#3B82F6] hover:text-black transition-none cursor-default bg-black">{f}</span>
                  ))}
                </div>
              </div>

              <div className="border-[1px] border-[#1E293B] p-8 md:p-12 col-span-1 md:col-span-3 min-w-0 overflow-hidden break-words flex flex-col gap-6 bg-[#0A0A0A]">
                <span className="text-sm font-mono uppercase tracking-widest opacity-60">Connectivity</span>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4 items-start hover:bg-[#1E293B] p-4 -mx-4 transition-none cursor-default group">
                    <div className="w-[4px] h-[36px] bg-[#3B82F6] shrink-0 mt-1"></div>
                    <div>
                      <p className="text-xs font-mono uppercase tracking-widest opacity-50 mb-1">Airport</p>
                      <p className="text-xl md:text-2xl font-bold tracking-tighter break-words">{iitDelhiData?.basicInfo?.connectivity?.airport}</p>
                    </div>
                  </div>
                  {(iitDelhiData?.basicInfo?.connectivity?.railway || []).map((r, i) => (
                    <div key={i} className="flex gap-4 items-start hover:bg-[#1E293B] p-4 -mx-4 transition-none cursor-default group">
                      <div className="w-[4px] h-[36px] bg-[#1E293B] group-hover:bg-[#3B82F6] shrink-0 mt-1"></div>
                      <div>
                        <p className="text-xs font-mono uppercase tracking-widest opacity-50 mb-1">Railway Station {i + 1}</p>
                        <p className="text-xl md:text-2xl font-bold tracking-tighter break-words">{r}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : activeTab === "Placements" ? (
            <div className="flex flex-col gap-8 min-w-0 animate-in fade-in duration-500 overflow-hidden break-words">
              
              {/* Highlight Metric Card */}
              <div className="border-[1px] border-[#1E293B] bg-[#0A0A0A] p-12 flex flex-col md:flex-row justify-between items-start md:items-center min-w-0 overflow-hidden break-words hover:bg-[#1E293B] transition-none group cursor-default">
                <div>
                  <span className="text-sm font-mono uppercase tracking-widest opacity-60 block mb-2">2024 Placement Highlight</span>
                  <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Median Package</h3>
                </div>
                <div className="text-5xl md:text-7xl font-black tracking-tighter text-[#3B82F6] group-hover:text-white mt-4 md:mt-0 break-words">
                  {iitDelhiData?.placements?.["2024"]?.medianPackage}
                </div>
              </div>

              {/* Placement Branch wise Percentages */}
              <div className="border-[1px] border-[#1E293B] bg-[#0A0A0A] flex flex-col min-w-0 overflow-hidden break-words">
                
                <div className="p-8 md:p-12 border-b-[1px] border-[#1E293B] bg-[#111111] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter">Branch Wise Placement Percentages</h2>
                    <p className="font-mono text-xs uppercase tracking-widest opacity-50 mt-2">Highly accurate official 2024 metrics</p>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setPlacementType("btech")} 
                      className={`px-4 py-2 font-mono text-sm uppercase tracking-widest border-[1px] transition-none ${placementType === "btech" ? "bg-[#3B82F6] text-black border-[#3B82F6]" : "border-[#1E293B] text-neutral-500 hover:text-white"}`}
                    >
                      B.Tech
                    </button>
                    <button 
                      onClick={() => setPlacementType("dualDegree")} 
                      className={`px-4 py-2 font-mono text-sm uppercase tracking-widest border-[1px] transition-none ${placementType === "dualDegree" ? "bg-[#3B82F6] text-black border-[#3B82F6]" : "border-[#1E293B] text-neutral-500 hover:text-white"}`}
                    >
                      Dual Degree
                    </button>
                  </div>
                </div>

                {/* High Contrast Row Array */}
                <div className="flex flex-col">
                  {Object.entries(iitDelhiData?.placements?.["2024"]?.branchWisePlacementPercentage?.[placementType] || {}).map(([branch, pct], idx) => (
                    <div key={idx} className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-b-[1px] border-[#1E293B] last:border-b-0 hover:bg-[#3B82F6] hover:text-black transition-none cursor-default bg-black">
                      <span className="font-bold text-lg md:text-xl uppercase tracking-tighter mb-2 md:mb-0 break-words">{branch}</span>
                      <span className="font-black text-2xl md:text-3xl tracking-tighter whitespace-nowrap">{pct}</span>
                    </div>
                  ))}
                </div>

              </div>

              {/* Top Recruiters */}
              <div className="border-[1px] border-[#1E293B] bg-[#0A0A0A] p-8 md:p-12 min-w-0 overflow-hidden break-words">
                <span className="text-sm font-mono uppercase tracking-widest opacity-60 block mb-6">Top Corporate Partners / Recruiters</span>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {(iitDelhiData?.placements?.["2024"]?.topRecruiters || []).map((recruiter, idx) => (
                    <div key={idx} className="border-[1px] border-[#1E293B] p-4 text-center font-bold uppercase tracking-tight hover:bg-[#3B82F6] hover:text-black transition-none cursor-default bg-black break-words min-w-0 flex items-center justify-center min-h-[80px]">
                      {recruiter}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : activeTab === "Rankings" ? (
            <div className="border-[1px] border-[#1E293B] flex flex-col bg-[#0A0A0A] min-w-0 overflow-hidden break-words animate-in fade-in duration-500">
              
              <div className="p-8 md:p-12 border-b-[1px] border-[#1E293B] bg-[#111111] flex justify-between items-center">
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Unified Rankings Matrix</h2>
                <span className="text-[#3B82F6] font-mono text-sm uppercase tracking-widest">Sorted Chronologically</span>
              </div>

              <div className="w-full overflow-x-auto no-scrollbar min-w-0">
                <table className="w-full text-left border-collapse min-w-[700px] table-fixed">
                  <thead>
                    <tr className="bg-[#1E293B] text-white">
                      <th className="p-6 text-sm font-mono uppercase tracking-widest border-r-[1px] border-[#0A0A0A] w-1/3">Ranking Body</th>
                      <th className="p-6 text-sm font-mono uppercase tracking-widest border-r-[1px] border-[#0A0A0A] w-1/4">Scope</th>
                      <th className="p-6 text-sm font-mono uppercase tracking-widest border-r-[1px] border-[#0A0A0A] w-1/5">Current Rank</th>
                      <th className="p-6 text-sm font-mono uppercase tracking-widest w-1/5 opacity-50">Previous Rank</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unifiedRankings.map((r, i) => (
                      <tr key={i} className="border-b-[1px] border-[#1E293B] hover:bg-[#3B82F6] hover:text-black transition-none cursor-default bg-[#0A0A0A]">
                        <td className="p-6 text-xl md:text-2xl font-bold tracking-tighter border-r-[1px] border-[#1E293B] break-words whitespace-normal leading-tight">{r.body}</td>
                        <td className="p-6 text-lg font-mono border-r-[1px] border-[#1E293B]">{r.scope}</td>
                        <td className="p-6 text-2xl md:text-3xl font-black tracking-tighter border-r-[1px] border-[#1E293B] text-[#3B82F6]">{r.rank}</td>
                        <td className="p-6 text-xl font-bold tracking-tighter opacity-40">{r.previous}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          ) : activeTab === "Admission" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-w-0 animate-in fade-in duration-500 items-start overflow-hidden break-words">
              
              {/* Admissions Protocol */}
              <div className="border-[1px] border-[#1E293B] flex flex-col bg-[#0A0A0A] min-w-0 overflow-hidden break-words">
                <div className="p-8 md:p-12 border-b-[1px] border-[#1E293B] bg-[#111111]">
                  <h2 className="font-mono text-sm uppercase tracking-widest text-[#3B82F6]">Admission Protocol</h2>
                </div>
                <div className="flex flex-col p-8 md:p-12 gap-8">
                  {(iitDelhiData?.admissionProcess || []).map((step, i) => (
                    <div key={i} className="flex gap-6 items-start hover:bg-[#1E293B] p-4 -mx-4 transition-none cursor-default group">
                      <span className="text-5xl font-black tracking-tighter text-[#3B82F6] opacity-30 group-hover:opacity-100 shrink-0 w-12">0{i+1}</span>
                      <p className="text-xl md:text-2xl font-bold tracking-tighter leading-snug break-words whitespace-normal">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course paths layout cards */}
              <div className="flex flex-col gap-6 min-w-0 overflow-hidden break-words">
                
                <div className="border-[1px] border-[#1E293B] flex flex-col bg-[#0A0A0A] min-w-0 overflow-hidden break-words">
                  <div className="p-6 border-b-[1px] border-[#1E293B] bg-[#111111]">
                    <h3 className="font-mono text-sm uppercase tracking-widest text-[#3B82F6]">B.Tech (4-Years Course Path)</h3>
                  </div>
                  <div className="flex flex-col">
                    {(iitDelhiData?.coursesOffered?.btech_4_years || []).map((c, i) => (
                      <div key={i} className="px-8 py-5 border-b-[1px] border-[#1E293B] last:border-b-0 text-lg md:text-xl font-bold uppercase tracking-tighter hover:bg-[#3B82F6] hover:text-black transition-none cursor-default break-words whitespace-normal leading-tight">{c}</div>
                    ))}
                  </div>
                </div>

                <div className="border-[1px] border-[#1E293B] flex flex-col bg-[#0A0A0A] min-w-0 overflow-hidden break-words">
                  <div className="p-6 border-b-[1px] border-[#1E293B] bg-[#111111]">
                    <h3 className="font-mono text-sm uppercase tracking-widest text-[#3B82F6]">Dual Degree (5-Years Course Path)</h3>
                  </div>
                  <div className="flex flex-col">
                    {(iitDelhiData?.coursesOffered?.dual_degree_5_years || []).map((c, i) => (
                      <div key={i} className="px-8 py-5 border-b-[1px] border-[#1E293B] last:border-b-0 text-lg md:text-xl font-bold uppercase tracking-tighter hover:bg-[#3B82F6] hover:text-black transition-none cursor-default break-words whitespace-normal leading-tight">{c}</div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          ) : activeTab === "Fees" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0 animate-in fade-in duration-500 items-start overflow-hidden break-words">
              
              {/* Institute fees */}
              <div className="border-[1px] border-[#1E293B] flex flex-col min-w-0 overflow-hidden break-words bg-[#0A0A0A]">
                <div className="p-8 md:p-12 border-b-[1px] border-[#1E293B]">
                  <h2 className="font-mono text-sm uppercase tracking-widest opacity-60 mb-0">01 / Institute Fee</h2>
                </div>
                <div className="flex flex-col flex-1">
                  {Object.entries(iitDelhiData?.fees?.instituteFee || {}).filter(([k]) => k !== 'totalInstitute').map(([key, value]) => (
                    <div key={key} className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 border-b-[1px] border-[#1E293B] hover:bg-[#3B82F6] hover:text-[#000000] transition-none group cursor-default">
                      <span className="font-bold text-xl md:text-2xl tracking-tighter uppercase mr-4 mb-2 md:mb-0 whitespace-normal break-words">{key.replace(/_/g, ' - ').replace(/([a-z])([A-Z])/g, '$1 $2')}</span>
                      <span className="font-black text-2xl md:text-3xl tracking-tighter whitespace-nowrap">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="p-8 md:p-12 group hover:bg-[#3B82F6] hover:text-[#000000] transition-none cursor-default bg-[#111111]">
                  <span className="font-mono text-xs uppercase tracking-widest opacity-60 mb-4 block">Total Semester Fee</span>
                  <p className="text-6xl md:text-[5vw] font-black tracking-tighter leading-none whitespace-normal break-words">{iitDelhiData?.fees?.instituteFee?.totalInstitute}</p>
                </div>
              </div>

              {/* Hostel fees */}
              <div className="border-[1px] border-[#1E293B] flex flex-col min-w-0 overflow-hidden break-words bg-[#0A0A0A]">
                <div className="p-8 md:p-12 border-b-[1px] border-[#1E293B]">
                  <h2 className="font-mono text-sm uppercase tracking-widest opacity-60 mb-0">02 / Hostel Fee</h2>
                </div>
                <div className="flex flex-col flex-1">
                  {Object.entries(iitDelhiData?.fees?.hostelFee || {}).filter(([k]) => k !== 'totalHostel').map(([key, value]) => (
                    <div key={key} className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 border-b-[1px] border-[#1E293B] hover:bg-[#3B82F6] hover:text-[#000000] transition-none group cursor-default">
                      <span className="font-bold text-xl md:text-2xl tracking-tighter uppercase mr-4 mb-2 md:mb-0 whitespace-normal break-words">{key.replace(/_/g, ' - ').replace(/([a-z])([A-Z])/g, '$1 $2')}</span>
                      <span className="font-black text-2xl md:text-3xl tracking-tighter whitespace-nowrap">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="p-8 md:p-12 group hover:bg-[#3B82F6] hover:text-[#000000] transition-none cursor-default bg-[#111111]">
                  <span className="font-mono text-xs uppercase tracking-widest opacity-60 mb-4 block">Total Hostel Fee</span>
                  <p className="text-6xl md:text-[5vw] font-black tracking-tighter leading-none whitespace-normal break-words">{iitDelhiData?.fees?.hostelFee?.totalHostel}</p>
                </div>
              </div>

              {/* Waivers */}
              <div className="border-[1px] border-[#1E293B] bg-[#1E293B] text-[#FFFFFF] flex flex-col min-w-0 overflow-hidden break-words">
                <div className="p-8 md:p-12 border-b-[1px] border-black">
                  <h2 className="font-mono text-sm uppercase tracking-widest text-[#3B82F6] mb-0">03 / Eligibility & Waivers</h2>
                </div>
                <div className="flex flex-col p-8 md:p-12 gap-8 flex-1">
                  {(iitDelhiData?.fees?.feeWaivers || []).map((waiver, idx) => (
                    <div key={idx} className="flex gap-6 group hover:text-[#3B82F6] transition-none cursor-default items-start">
                      <div className="w-[4px] h-[40px] bg-[#3B82F6] shrink-0 mt-2"></div>
                      <p className="text-2xl md:text-4xl font-bold tracking-tighter leading-[1.1] whitespace-normal break-words">
                        {waiver}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="flex flex-col gap-12 min-w-0 animate-in fade-in duration-500 overflow-hidden break-words">
              
              {/* Filter Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-4">
                  <label className="text-sm font-mono uppercase tracking-widest text-neutral-400">01 / Category Filter</label>
                  <select 
                    value={seatCategory}
                    onChange={(e) => setSeatCategory(e.target.value)}
                    className="bg-black text-[#3B82F6] border-[1px] border-[#1E293B] p-6 text-2xl font-bold uppercase tracking-widest outline-none focus:border-[#3B82F6] cursor-pointer appearance-none transition-colors duration-0"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                
                <div className="flex flex-col gap-4">
                  <label className="text-sm font-mono uppercase tracking-widest text-neutral-400">02 / Seat Pool</label>
                  <select 
                    value={seatPool}
                    onChange={(e) => setSeatPool(e.target.value)}
                    className="bg-black text-[#3B82F6] border-[1px] border-[#1E293B] p-6 text-2xl font-bold uppercase tracking-widest outline-none focus:border-[#3B82F6] cursor-pointer appearance-none transition-colors duration-0"
                  >
                    {POOLS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              {/* Data Matrix */}
              <div className="border-[1px] border-[#1E293B] flex flex-col min-w-0 bg-[#0A0A0A] overflow-hidden break-words">
                {(() => {
                  if (seatCategory === "All" && seatPool === "All") {
                    return (
                      <>
                        <div className="p-12 border-b-[1px] border-[#1E293B] flex flex-wrap justify-between items-center gap-6 bg-[#111111]">
                          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Aggregate Matrix</h2>
                          <p className="text-6xl md:text-[5vw] font-black tracking-tighter text-[#3B82F6] leading-none">1200</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-b-[1px] border-[#1E293B]">
                          {CATEGORIES.filter(c => c !== "All").map((cat) => {
                            const gnTotal = SEAT_MATRIX_DATA[cat]?.[ "Gender-Neutral" ]?.reduce((s, r) => s + r.seats, 0) ?? 0;
                            const foTotal = SEAT_MATRIX_DATA[cat]?.[ "Female-Only" ]?.reduce((s, r) => s + r.seats, 0) ?? 0;
                            const total = gnTotal + foTotal;
                            return (
                              <div key={cat} onClick={() => setSeatCategory(cat)} className="p-6 border-r-[1px] border-b-[1px] border-[#1E293B] hover:bg-[#3B82F6] hover:text-black transition-none cursor-pointer group bg-black">
                                <p className="font-mono text-xs uppercase tracking-widest opacity-60 mb-3 group-hover:opacity-100">{cat}</p>
                                <p className="text-4xl font-black tracking-tighter">{total}</p>
                                <div className="flex gap-3 mt-2 text-sm font-bold opacity-70">
                                  <span>GN: {gnTotal}</span>
                                  <span>FO: {foTotal}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="w-full overflow-x-auto no-scrollbar min-w-0">
                          <table className="w-full text-left border-collapse min-w-[700px] table-fixed">
                            <thead>
                              <tr className="bg-[#1E293B] text-white">
                                <th className="p-6 text-sm font-mono uppercase tracking-widest border-r-[1px] border-[#0A0A0A] w-1/2">Branch Name</th>
                                <th className="p-6 text-sm font-mono uppercase tracking-widest border-r-[1px] border-[#0A0A0A]">Gender Neutral</th>
                                <th className="p-6 text-sm font-mono uppercase tracking-widest">Female Only</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(iitDelhiData?.coursesOffered?.btech_4_years || []).map((b, idx) => (
                                <tr key={idx} className="border-b-[1px] border-[#1E293B] hover:bg-[#3B82F6] hover:text-black transition-none duration-0 cursor-default bg-[#0A0A0A]">
                                  <td className="p-8 text-xl md:text-2xl font-bold uppercase tracking-tighter border-r-[1px] border-[#1E293B] whitespace-normal break-words min-w-0 leading-tight">{b}</td>
                                  <td className="p-8 text-3xl font-black tracking-tighter border-r-[1px] border-[#1E293B]">50</td>
                                  <td className="p-8 text-3xl font-black tracking-tighter">15</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    );
                  }

                  const catData = seatCategory !== "All" ? SEAT_MATRIX_DATA[seatCategory] : null;
                  
                  let gnRows: { name: string; seats: number; courseType: string }[] = [];
                  let foRows: { name: string; seats: number; courseType: string }[] = [];
                  
                  if (catData) {
                    gnRows = catData["Gender-Neutral"] ?? [];
                    foRows = catData["Female-Only"] ?? [];
                  } else {
                    const branchMap: Record<string, { gn: number; fo: number; courseType: string }> = {};
                    for (const cat of Object.keys(SEAT_MATRIX_DATA)) {
                      for (const row of (SEAT_MATRIX_DATA[cat]["Gender-Neutral"] ?? [])) {
                        if (!branchMap[row.name]) branchMap[row.name] = { gn: 0, fo: 0, courseType: row.courseType };
                        branchMap[row.name].gn += row.seats;
                      }
                      for (const row of (SEAT_MATRIX_DATA[cat]["Female-Only"] ?? [])) {
                        if (!branchMap[row.name]) branchMap[row.name] = { gn: 0, fo: 0, courseType: row.courseType };
                        branchMap[row.name].fo += row.seats;
                      }
                    }
                    gnRows = Object.entries(branchMap).map(([name, v]) => ({ name, seats: v.gn, courseType: v.courseType }));
                    foRows = Object.entries(branchMap).map(([name, v]) => ({ name, seats: v.fo, courseType: v.courseType }));
                  }

                  const showGN = seatPool === "All" || seatPool === "Gender Neutral";
                  const showFO = seatPool === "All" || seatPool === "Female Only";
                  
                  const gnTotal = gnRows.reduce((s, r) => s + r.seats, 0);
                  const foTotal = foRows.reduce((s, r) => s + r.seats, 0);
                  const displayTotal = (showGN ? gnTotal : 0) + (showFO ? foTotal : 0);

                  const allBranches = Array.from(new Set([...gnRows.map(r => r.name), ...foRows.map(r => r.name)]));
                  const gnMap = Object.fromEntries(gnRows.map(r => [r.name, r.seats]));
                  const foMap = Object.fromEntries(foRows.map(r => [r.name, r.seats]));

                  return (
                    <>
                      <div className="p-12 border-b-[1px] border-[#1E293B] flex flex-wrap justify-between items-center gap-6 bg-[#111111]">
                        <div>
                          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
                            {seatCategory === "All" ? "All Categories" : seatCategory}
                            {seatPool !== "All" && <span className="text-[#3B82F6]"> / {seatPool}</span>}
                          </h2>
                          <p className="font-mono text-sm uppercase tracking-widest opacity-50 mt-2">JoSAA Seat Allocation</p>
                        </div>
                        <p className="text-6xl md:text-[5vw] font-black tracking-tighter text-[#3B82F6] leading-none">{displayTotal}</p>
                      </div>

                      <div className="w-full overflow-x-auto no-scrollbar min-w-0">
                        <table className="w-full text-left border-collapse min-w-[600px] table-fixed">
                          <thead>
                            <tr className="bg-[#111111] text-white">
                              <th className="p-5 text-sm font-mono uppercase tracking-widest border-r-[1px] border-[#1E293B] w-1/2 opacity-50">Branch</th>
                              {showGN && <th className="p-5 text-sm font-mono uppercase tracking-widest border-r-[1px] border-[#1E293B] opacity-50">Gender Neutral</th>}
                              {showFO && <th className="p-5 text-sm font-mono uppercase tracking-widest opacity-50">Female Only</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {allBranches.map((b, idx) => (
                              <tr key={idx} className="border-b-[1px] border-[#1E293B] hover:bg-[#3B82F6] hover:text-black transition-none duration-0 cursor-default bg-[#0A0A0A]">
                                <td className="p-6 text-lg md:text-xl font-bold uppercase tracking-tighter border-r-[1px] border-[#1E293B] whitespace-normal break-words leading-tight">{b}</td>
                                {showGN && <td className="p-6 text-2xl md:text-3xl font-black tracking-tighter border-r-[1px] border-[#1E293B]">{gnMap[b] ?? 0}</td>}
                                {showFO && <td className="p-6 text-2xl md:text-3xl font-black tracking-tighter">{foMap[b] ?? 0}</td>}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  );
                })()}
              </div>

            </div>
          )}
        </div>
      </div>
    </main>
  );
}
