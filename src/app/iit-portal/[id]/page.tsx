"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, GraduationCap, DollarSign, Award, MapPin, Plane, Train, Sparkles } from "lucide-react";
import { getIITById } from "@/utils/iitData";

export default function IITDetailsPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id.toLowerCase() : "";
  const [activeTab, setActiveTab] = useState("placements");

  const college = useMemo(() => {
    return getIITById(id);
  }, [id]);

  if (!college) {
    return (
      <div className="bg-[#050B14] min-h-screen text-white font-mono flex flex-col items-center justify-center p-12 text-center">
        <h1 className="text-4xl font-black text-red-500 uppercase tracking-tighter mb-4">PROFILE NOT FOUND</h1>
        <p className="text-neutral-500 max-w-sm mb-8 leading-relaxed uppercase text-xs">
          The requested IIT Profile ID "\${id}" is not available in our verified JoSAA '26 database.
        </p>
        <Link href="/iit-portal" className="px-6 py-3 border-2 border-blue-600 text-blue-400 font-bold hover:bg-blue-600 hover:text-white uppercase transition-none shadow-[4px_4px_0px_0px_#2563eb]">
          ← RETURN TO COMPARISON PORTAL
        </Link>
      </div>
    );
  }

  const getNirfRank = () => {
    if (!college.rankings?.national) return "N/A";
    const eng = college.rankings.national.find((r: any) => r.body?.includes("Engineering"));
    if (eng) return eng.rank;
    const overall = college.rankings.national.find((r: any) => r.body?.includes("Overall"));
    if (overall) return overall.rank;
    if (college.rankings.national.length > 0) return college.rankings.national[0].rank;
    return "N/A";
  };

  const getPlacementPercentage = () => {
    const stats = college.placements?.["2024"]?.statistics || college.placements?.["2023"]?.statistics;
    if (!stats) return "N/A";
    return stats.overallPlacementPercentage || stats.placementPercentage || "N/A";
  };

  const branchPlacementTable = useMemo(() => {
    const stats = college.placements?.["2024"]?.statistics || college.placements?.["2023"]?.statistics;
    if (!stats || !stats.branchWisePlacementPercentage) return [];
    
    const raw = stats.branchWisePlacementPercentage;
    const list: { name: string; pct: string; value: number }[] = [];

    const extract = (obj: any) => {
      if (!obj || typeof obj !== "object") return;
      Object.entries(obj).forEach(([key, val]) => {
        if (typeof val === "string") {
          list.push({
            name: key,
            pct: val,
            value: parseFloat(val.replace(/[^\d.]/g, "")) || 0
          });
        } else if (typeof val === "number") {
          list.push({
            name: key,
            pct: `${val}%`,
            value: val
          });
        } else if (typeof val === "object" && val !== null) {
          extract(val);
        }
      });
    };

    extract(raw);
    return list.sort((a, b) => b.value - a.value);
  }, [college]);

  const placementPackages = useMemo(() => {
    const yearData = college.placements?.["2024"] || college.placements?.["2023"] || Object.values(college.placements || {})[0];
    if (!yearData) return null;
    return yearData.packages || null;
  }, [college]);

  const recruitersList = useMemo(() => {
    const yearData = college.placements?.["2024"] || college.placements?.["2023"];
    if (!yearData) return null;
    return yearData.topRecruiters || null;
  }, [college]);

  return (
    <div className="bg-[#050B14] min-h-screen text-white font-sans antialiased max-w-7xl mx-auto px-4 py-12 md:py-16">
      
      {/* Back Button */}
      <Link 
        href="/iit-portal" 
        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-blue-400 hover:text-white border-2 border-blue-900 bg-[#071120] px-4 py-3 mb-10 transition-colors duration-0 shadow-[2px_2px_0px_0px_rgba(29,78,216,0.3)] hover:shadow-[3px_3px_0px_0px_#2563eb]"
      >
        <ArrowLeft size={14} /> ← BACK TO HUB
      </Link>

      {/* College Profile Banner Card */}
      <div className="border-4 border-blue-600 bg-blue-950/40 p-8 md:p-12 mb-12 shadow-[8px_8px_0px_0px_rgba(37,99,235,1)] relative select-none">
        
        {/* Established & Code Tag */}
        <div className="flex flex-wrap gap-3 mb-6">
          <span className="font-mono text-xs uppercase font-extrabold bg-blue-600 text-white px-3 py-1 shadow-[2px_2px_0px_0px_#000]">
            IIT SYSTEM CODE: {college.basicInfo?.alsoKnownAs}
          </span>
          <span className="font-mono text-xs uppercase font-bold border-2 border-blue-800 bg-[#071120] text-blue-300 px-3 py-1">
            ESTABLISHED {college.basicInfo?.established}
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-tight text-white mb-6">
          {college.basicInfo?.name}
        </h1>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t-2 border-blue-900/60 pt-8 mt-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-950 border-2 border-blue-800 flex items-center justify-center shrink-0">
              <Award className="text-blue-400" size={24} />
            </div>
            <div>
              <span className="block text-[10px] font-mono uppercase text-neutral-400">NIRF National Rank</span>
              <span className="text-2xl font-black font-mono text-white">#{getNirfRank()}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-950 border-2 border-blue-800 flex items-center justify-center shrink-0">
              <GraduationCap className="text-blue-400" size={24} />
            </div>
            <div>
              <span className="block text-[10px] font-mono uppercase text-neutral-400">Overall Placement</span>
              <span className="text-2xl font-black font-mono text-blue-400">{getPlacementPercentage()}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-950 border-2 border-blue-800 flex items-center justify-center shrink-0">
              <DollarSign className="text-blue-400" size={24} />
            </div>
            <div>
              <span className="block text-[10px] font-mono uppercase text-neutral-400">Total First Sem Fee</span>
              <span className="text-2xl font-black font-mono text-white">{college.fees?.totalFirstSemester || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Location & Connectivity detail block */}
        <div className="border-2 border-blue-900 bg-[#071120]/60 p-5 mt-8 flex flex-col gap-4 font-mono text-xs text-neutral-400">
          <div className="flex items-start gap-2">
            <MapPin className="text-blue-500 shrink-0 mt-0.5" size={14} />
            <span><strong className="text-blue-300">CAMPUS LOCATION:</strong> {college.basicInfo?.location}</span>
          </div>
          {college.basicInfo?.connectivity && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-blue-950/60 pt-4">
              <div className="flex items-start gap-2">
                <Plane className="text-blue-500 shrink-0 mt-0.5" size={14} />
                <span><strong className="text-blue-300">NEAREST AIRPORT:</strong> {college.basicInfo.connectivity.airport}</span>
              </div>
              <div className="flex items-start gap-2">
                <Train className="text-blue-500 shrink-0 mt-0.5" size={14} />
                <span><strong className="text-blue-300">RAIL CONNECTIONS:</strong> {college.basicInfo.connectivity.railway?.join(" | ")}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile Dynamic Navigation Tabs - Brutalist Stark fill */}
      <div className="flex gap-4 mb-8">
        {[
          { id: "placements", label: "Placements & Metrics", icon: GraduationCap },
          { id: "fees", label: "Fees & Breakdown", icon: DollarSign }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-2 font-mono text-sm uppercase tracking-wider font-extrabold py-4 px-6 border-3 cursor-pointer transition-none ${
                activeTab === tab.id
                  ? "bg-blue-600 border-blue-500 text-white shadow-[4px_4px_0px_0px_#000]"
                  : "border-blue-900 bg-[#071120] text-neutral-400 hover:text-white hover:border-blue-600"
              }`}
            >
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === "placements" ? (
        <div className="flex flex-col gap-8">
          
          {/* Packages Summary Metrics */}
          {placementPackages && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border-2 border-blue-800 bg-[#071120] p-6 shadow-[3px_3px_0px_0px_rgba(29,78,216,0.3)]">
                <span className="font-mono text-xs uppercase text-neutral-400 block mb-2">Highest package offered</span>
                <p className="text-2xl font-black tracking-tight text-blue-400 font-mono">
                  {placementPackages.overall?.highest || placementPackages.highest || "N/A"}
                </p>
              </div>
              <div className="border-2 border-blue-800 bg-[#071120] p-6 shadow-[3px_3px_0px_0px_rgba(29,78,216,0.3)]">
                <span className="font-mono text-xs uppercase text-neutral-400 block mb-2">Average package</span>
                <p className="text-2xl font-black tracking-tight text-white font-mono">
                  {placementPackages.overall?.average || placementPackages.average || "N/A"}
                </p>
              </div>
              <div className="border-2 border-blue-800 bg-[#071120] p-6 shadow-[3px_3px_0px_0px_rgba(29,78,216,0.3)]">
                <span className="font-mono text-xs uppercase text-neutral-400 block mb-2">Median package</span>
                <p className="text-2xl font-black tracking-tight text-white font-mono">
                  {placementPackages.overall?.median || placementPackages.median || "N/A"}
                </p>
              </div>
            </div>
          )}

          {/* Branch-Wise Placement table card */}
          <div className="border-3 border-blue-900 bg-[#071120] shadow-[6px_6px_0px_0px_rgba(29,78,216,0.4)]">
            <div className="p-6 border-b-2 border-blue-950/60 bg-blue-950/20">
              <h2 className="font-mono text-sm uppercase tracking-widest text-blue-400 font-bold">BRANCH-WISE PLACEMENT COMPARISON TABLE</h2>
            </div>
            
            {branchPlacementTable.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-blue-950 border-b border-blue-900/60">
                      <th className="p-4 font-mono text-xs uppercase tracking-widest text-neutral-400 border-r border-blue-900/40">Academic Program / Branch</th>
                      <th className="p-4 font-mono text-xs uppercase tracking-widest text-neutral-400 text-center w-1/3 border-r border-blue-900/40">Visual Statistics</th>
                      <th className="p-4 font-mono text-xs uppercase tracking-widest text-neutral-400 text-right w-1/6">Placement Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branchPlacementTable.map((row, idx) => (
                      <tr 
                        key={idx} 
                        className={`border-b border-blue-950/40 hover:bg-blue-900/20 transition-none ${idx % 2 === 0 ? "bg-[#091526]/30" : "bg-transparent"}`}
                      >
                        <td className="p-4 font-bold uppercase text-sm border-r border-blue-900/40 leading-relaxed break-words">{row.name}</td>
                        {/* Progress Bar Column */}
                        <td className="p-4 border-r border-blue-900/40">
                          <div className="w-full bg-blue-950 h-3 border border-blue-800">
                            <div 
                              className="bg-blue-650 h-full transition-all duration-300"
                              style={{ width: `${row.value}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="p-4 text-right font-mono font-bold text-blue-400 text-base">{row.pct}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-neutral-500 font-mono text-xs uppercase tracking-widest">
                No branch-wise breakdown available. Overall placement is listed above.
              </div>
            )}
          </div>

          {/* Recruiters Card */}
          {recruitersList && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { key: "techAndSoftware", label: "Tech & Software Solutions" },
                { key: "financeAndQuant", label: "Quant & Financial Services" },
                { key: "coreAndConsulting", label: "Core Industries & Consulting" }
              ].map(cat => {
                const recruiters = recruitersList[cat.key] || [];
                return (
                  <div key={cat.key} className="border-2 border-blue-850 bg-[#071120] p-6 shadow-[3px_3px_0px_0px_rgba(29,78,216,0.3)]">
                    <h3 className="font-mono text-xs uppercase text-blue-300 font-bold tracking-wider mb-4 border-b border-blue-950/80 pb-2">
                      {cat.label}
                    </h3>
                    {recruiters.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {recruiters.map((rec: string, i: number) => (
                          <span 
                            key={i} 
                            className="bg-[#050B14] border border-blue-900/60 font-mono text-[9px] uppercase text-neutral-300 px-2.5 py-1"
                          >
                            {rec}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="font-mono text-xs text-neutral-600 uppercase block italic">No recruiters listed.</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>
      ) : (
        <div className="flex flex-col gap-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* Institute Fee Breakdown Card */}
            <div className="border-3 border-blue-900 bg-[#071120] shadow-[6px_6px_0px_0px_rgba(29,78,216,0.4)]">
              <div className="p-6 border-b-2 border-blue-950/60 bg-blue-950/20">
                <h2 className="font-mono text-sm uppercase tracking-widest text-blue-400 font-bold">01 / SEMESTER INSTITUTE FEE BREAKDOWN</h2>
              </div>
              
              {college.fees?.instituteFee ? (
                <div className="flex flex-col">
                  {Object.entries(college.fees.instituteFee).map(([key, val]) => (
                    <div 
                      key={key} 
                      className="flex justify-between items-center p-5 border-b border-blue-950/40 hover:bg-blue-900/10 transition-none"
                    >
                      <span className="font-mono text-xs text-neutral-400 uppercase">
                        {key.replace(/_/g, " ").replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <span className="font-bold font-mono text-white">{val as string}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-neutral-500 font-mono text-xs uppercase tracking-widest">
                  Detailed semester fee breakdown not found.
                </div>
              )}
            </div>

            {/* Hostel Fee Breakdown Card */}
            <div className="border-3 border-blue-900 bg-[#071120] shadow-[6px_6px_0px_0px_rgba(29,78,216,0.4)]">
              <div className="p-6 border-b-2 border-blue-950/60 bg-blue-950/20">
                <h2 className="font-mono text-sm uppercase tracking-widest text-blue-400 font-bold">02 / HOSTEL & CHARGES BREAKDOWN</h2>
              </div>
              
              {college.fees?.hostelFee ? (
                <div className="flex flex-col">
                  {Object.entries(college.fees.hostelFee).map(([key, val]) => (
                    <div 
                      key={key} 
                      className="flex justify-between items-center p-5 border-b border-blue-950/40 hover:bg-blue-900/10 transition-none"
                    >
                      <span className="font-mono text-xs text-neutral-400 uppercase">
                        {key.replace(/_/g, " ").replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <span className="font-bold font-mono text-white">{val as string}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-neutral-500 font-mono text-xs uppercase tracking-widest">
                  Hostel fee breakdown not found.
                </div>
              )}
            </div>

          </div>

          {/* Fee Waivers Card */}
          {college.fees?.feeWaivers && college.fees.feeWaivers.length > 0 && (
            <div className="border-3 border-blue-900 bg-[#071120] p-8 shadow-[6px_6px_0px_0px_rgba(29,78,216,0.4)]">
              <h2 className="font-mono text-sm uppercase tracking-widest text-blue-300 font-bold mb-6 border-b border-blue-950/80 pb-3 flex items-center gap-2">
                <Sparkles size={16} className="text-blue-500" /> ELIGIBILITY & TUITION FEE WAIVERS
              </h2>
              <div className="flex flex-col gap-4">
                {college.fees.feeWaivers.map((waiver, idx) => (
                  <div key={idx} className="flex gap-4 items-start p-4 bg-[#050B14] border border-blue-900/60">
                    <div className="w-1.5 h-6 bg-blue-500 shrink-0 mt-0.5"></div>
                    <p className="font-mono text-xs text-neutral-300 leading-relaxed uppercase">{waiver}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}