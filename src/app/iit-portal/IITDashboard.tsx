"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, BookOpen, GraduationCap, DollarSign, Award, ArrowUpDown } from "lucide-react";
import { IITData } from "@/utils/iitData";

export default function IITDashboard({ initialData }: { initialData: IITData[] }) {
  const [search, setSearch] = useState("");
  const [selectedFacility, setSelectedFacility] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [minPlacement, setMinPlacement] = useState(0);
  const [maxFee, setMaxFee] = useState(300000);
  const [sortBy, setSortBy] = useState("nirf");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const getNirfRank = (item: IITData): number => {
    if (!item.rankings?.national) return 999;
    const eng = item.rankings.national.find(r => r.body?.includes("Engineering"));
    if (eng) return parseInt(eng.rank) || 999;
    const overall = item.rankings.national.find(r => r.body?.includes("Overall"));
    if (overall) return parseInt(overall.rank) || 999;
    if (item.rankings.national.length > 0) return parseInt(item.rankings.national[0].rank) || 999;
    return 999;
  };

  const getPlacementPercentage = (item: IITData): number => {
    const stats = item.placements?.["2024"]?.statistics || item.placements?.["2023"]?.statistics;
    if (!stats) return 0;
    const pctStr = stats.overallPlacementPercentage || stats.placementPercentage || "0";
    return parseFloat(pctStr) || 0;
  };

  const parseFee = (item: IITData): number => {
    const feeStr = item.fees?.totalFirstSemester || "0";
    const num = parseInt(feeStr.replace(/[^\d]/g, "")) || 0;
    return num;
  };

  const allFacilities = useMemo(() => {
    const set = new Set<string>();
    initialData.forEach(item => {
      item.basicInfo?.campusFacilities?.forEach(f => set.add(f));
    });
    return ["All", ...Array.from(set)].sort();
  }, [initialData]);

  const filteredData = useMemo(() => {
    return initialData
      .filter(item => {
        const nameMatch = item.basicInfo?.name?.toLowerCase().includes(search.toLowerCase()) ||
                          item.basicInfo?.alsoKnownAs?.toLowerCase().includes(search.toLowerCase());
        const facilityMatch = selectedFacility === "All" || item.basicInfo?.campusFacilities?.includes(selectedFacility);
        const typeMatch = selectedType === "All" || (item.basicInfo?.type || "IIT").includes(selectedType);
        const placementVal = getPlacementPercentage(item);
        const placementMatch = minPlacement === 0 || placementVal >= minPlacement;
        const feeVal = parseFee(item);
        const feeMatch = feeVal === 0 || feeVal <= maxFee;

        return nameMatch && facilityMatch && typeMatch && placementMatch && feeMatch;
      })
      .sort((a, b) => {
        let valA = 0;
        let valB = 0;
        
        if (sortBy === "nirf") {
          valA = getNirfRank(a);
          valB = getNirfRank(b);
        } else if (sortBy === "placement") {
          valA = getPlacementPercentage(a);
          valB = getPlacementPercentage(b);
        } else if (sortBy === "fee") {
          valA = parseFee(a);
          valB = parseFee(b);
        } else if (sortBy === "estd") {
          valA = parseInt(a.basicInfo?.established) || 0;
          valB = parseInt(b.basicInfo?.established) || 0;
        }

        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [initialData, search, selectedFacility, minPlacement, maxFee, sortBy, sortOrder]);

  const summaryMetrics = useMemo(() => {
    let totalPlacements = 0;
    let validPlacementCount = 0;
    let totalFees = 0;
    let validFeeCount = 0;

    filteredData.forEach(item => {
      const p = getPlacementPercentage(item);
      if (p > 0) {
        totalPlacements += p;
        validPlacementCount++;
      }
      const f = parseFee(item);
      if (f > 0) {
        totalFees += f;
        validFeeCount++;
      }
    });

    return {
      count: filteredData.length,
      avgPlacement: validPlacementCount > 0 ? (totalPlacements / validPlacementCount).toFixed(2) : "N/A",
      avgFee: validFeeCount > 0 ? Math.round(totalFees / validFeeCount).toLocaleString("en-IN") : "N/A"
    };
  }, [filteredData]);

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(o => o === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      if (field === "nirf") setSortOrder("asc");
      if (field === "placement") setSortOrder("desc");
      if (field === "fee") setSortOrder("asc");
      if (field === "estd") setSortOrder("asc");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
      
      {/* Header Banner - Brutalist Stark Blue */}
      <div className="border-4 border-blue-600 bg-blue-950/60 p-8 md:p-12 mb-12 shadow-[8px_8px_0px_0px_rgba(37,99,235,1)] relative overflow-hidden select-none">
        <div className="absolute right-0 top-0 w-64 h-64 bg-blue-900 rounded-full blur-3xl opacity-30 -mr-20 -mt-20 pointer-events-none"></div>
        <span className="font-mono text-sm tracking-[0.3em] text-blue-400 uppercase font-bold block mb-3">OFFICIAL JOOSAA '26 DATABASE</span>
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tighter uppercase leading-none">
          JoSAA ADMISSION <br />
          <span className="text-blue-400">PORTAL</span>
        </h1>
        <p className="text-lg md:text-xl font-mono text-neutral-400 mt-6 max-w-xl leading-relaxed">
          High-contrast analytics console comparing top Indian Engineering Institutes (IITs, NITs, IIITs, GFTIs) based on cutoffs, placements, fee structures, and rankings.
        </p>
      </div>

      {/* Summary Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="border-2 border-blue-800 bg-[#071120] p-6 shadow-[4px_4px_0px_0px_rgba(29,78,216,0.5)] flex flex-col justify-between">
          <span className="text-xs font-mono uppercase text-blue-400 tracking-widest flex items-center gap-2">
            <BookOpen size={14} /> Total Institutes
          </span>
          <p className="text-5xl font-black mt-4 font-mono text-white">{summaryMetrics.count}</p>
        </div>
        <div className="border-2 border-blue-800 bg-[#071120] p-6 shadow-[4px_4px_0px_0px_rgba(29,78,216,0.5)] flex flex-col justify-between">
          <span className="text-xs font-mono uppercase text-blue-400 tracking-widest flex items-center gap-2">
            <GraduationCap size={14} /> Avg Placement Rate
          </span>
          <p className="text-5xl font-black mt-4 font-mono text-blue-400">
            {summaryMetrics.avgPlacement !== "N/A" ? `${summaryMetrics.avgPlacement}%` : "N/A"}
          </p>
        </div>
        <div className="border-2 border-blue-800 bg-[#071120] p-6 shadow-[4px_4px_0px_0px_rgba(29,78,216,0.5)] flex flex-col justify-between">
          <span className="text-xs font-mono uppercase text-blue-400 tracking-widest flex items-center gap-2">
            <DollarSign size={14} /> Avg First Sem Fee
          </span>
          <p className="text-5xl font-black mt-4 font-mono text-white">
            {summaryMetrics.avgFee !== "N/A" ? `₹${summaryMetrics.avgFee}` : "N/A"}
          </p>
        </div>
      </div>

      {/* Filter and Control Panel - Brutalist Design */}
      <div className="border-3 border-blue-800 bg-[#071120] p-6 md:p-8 mb-12 shadow-[6px_6px_0px_0px_rgba(29,78,216,0.4)]">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-blue-900/60">
          <SlidersHorizontal className="text-blue-400" size={20} />
          <h2 className="font-mono text-lg uppercase tracking-wider font-extrabold text-blue-300">ANALYTICAL FILTER CONSOLE</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-end">
          
          {/* Search Box */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono uppercase tracking-wider text-blue-400">Search Institute</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Type 'Delhi', 'NIT'..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-[#050B14] border-2 border-blue-900/60 text-white font-mono text-sm p-4 pl-12 focus:border-blue-500 hover:border-blue-700 outline-none rounded-none transition-colors duration-0"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono uppercase tracking-wider text-blue-400">Institute Type</label>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="w-full bg-[#050B14] border-2 border-blue-900/60 text-blue-300 font-mono text-sm p-4 focus:border-blue-500 outline-none rounded-none cursor-pointer appearance-none"
            >
              {["All", "IIT", "NIT", "IIIT", "GFTI"].map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {/* Facilities Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono uppercase tracking-wider text-blue-400">Filter By Facility</label>
            <select
              value={selectedFacility}
              onChange={e => setSelectedFacility(e.target.value)}
              className="w-full bg-[#050B14] border-2 border-blue-900/60 text-blue-300 font-mono text-sm p-4 focus:border-blue-500 outline-none rounded-none cursor-pointer appearance-none"
            >
              {allFacilities.map(f => (
                <option key={f} value={f}>{f.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* Min Placement Rate */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-mono uppercase tracking-wider text-blue-400">
              <span>Min Placement Rate</span>
              <span className="text-white font-bold">{minPlacement}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={minPlacement}
              onChange={e => setMinPlacement(parseInt(e.target.value))}
              className="w-full h-2 bg-[#050B14] accent-blue-500 cursor-pointer appearance-none border border-blue-950"
            />
          </div>

          {/* Max Fees */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-mono uppercase tracking-wider text-blue-400">
              <span>Max 1st Sem Fee</span>
              <span className="text-white font-bold">₹{maxFee.toLocaleString("en-IN")}</span>
            </div>
            <input
              type="range"
              min="80000"
              max="250000"
              step="5000"
              value={maxFee}
              onChange={e => setMaxFee(parseInt(e.target.value))}
              className="w-full h-2 bg-[#050B14] accent-blue-500 cursor-pointer appearance-none border border-blue-950"
            />
          </div>

        </div>

        {/* Sort Controls */}
        <div className="flex flex-wrap items-center gap-4 mt-8 pt-6 border-t border-blue-900/40">
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1">
            <ArrowUpDown size={12} /> Sort By:
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "nirf", label: "NIRF Rank" },
              { id: "placement", label: "Placement Rate" },
              { id: "fee", label: "Semester Fee" },
              { id: "estd", label: "Estd Year" }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => toggleSort(item.id)}
                className={`font-mono text-xs uppercase px-4 py-2 border transition-none cursor-pointer ${
                  sortBy === item.id 
                    ? "bg-blue-600 border-blue-500 text-white font-extrabold shadow-[2px_2px_0px_0px_#000]" 
                    : "border-blue-900/60 text-neutral-400 hover:text-white hover:border-blue-600"
                }`}
              >
                {item.label} {sortBy === item.id && (sortOrder === "asc" ? "▲" : "▼")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      {filteredData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredData.map(item => {
            const placementVal = getPlacementPercentage(item);
            const nirfRank = getNirfRank(item);
            
            return (
              <div 
                key={item.collegeId}
                className="border-3 border-blue-900 bg-[#071120] flex flex-col justify-between shadow-[4px_4px_0px_0px_#1d4ed8] hover:shadow-[6px_6px_0px_0px_#2563eb] hover:border-blue-600 transition-all duration-150 group"
              >
                {/* Card Header */}
                <div className="p-6 border-b-2 border-blue-950/60 flex justify-between items-start gap-4">
                  <div>
                    <span className="font-mono text-[10px] text-blue-400 font-bold uppercase tracking-wider block mb-1">
                      ESTD {item.basicInfo?.established} · {item.basicInfo?.alsoKnownAs}
                    </span>
                    <h3 className="text-xl font-black tracking-tight leading-tight group-hover:text-blue-400 transition-colors uppercase" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {item.basicInfo?.name?.replace("Indian Institute of Technology, ", "IIT ").replace("Indian Institute of Technology (Banaras Hindu University), ", "IIT (BHU) ")}
                    </h3>
                  </div>
                  {/* NIRF Rank Badge */}
                  <div className="border-2 border-blue-500/40 bg-blue-950/60 px-3 py-1 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[9px] font-mono text-blue-400 uppercase font-black leading-none">NIRF</span>
                    <span className="text-xl font-black tracking-tighter leading-none mt-1 font-mono text-white">
                      {nirfRank === 999 ? "N/A" : `#${nirfRank}`}
                    </span>
                  </div>
                </div>

                {/* Card Body Metrics */}
                <div className="p-6 flex flex-col gap-4 bg-[#091526]/40 flex-1">
                  
                  {/* Fee Bar */}
                  <div className="flex justify-between items-center py-2 border-b border-blue-950/40">
                    <span className="text-xs font-mono uppercase text-neutral-400 flex items-center gap-1.5">
                      <DollarSign size={14} className="text-blue-500" /> First Sem Fee
                    </span>
                    <span className="text-base font-bold font-mono text-white">
                      {item.fees?.totalFirstSemester || "N/A"}
                    </span>
                  </div>

                  {/* Placement Rate */}
                  <div className="flex justify-between items-center py-2 border-b border-blue-950/40">
                    <span className="text-xs font-mono uppercase text-neutral-400 flex items-center gap-1.5">
                      <GraduationCap size={14} className="text-blue-500" /> Placement Rate
                    </span>
                    <span className="text-base font-bold font-mono text-blue-400">
                      {placementVal > 0 ? `${placementVal.toFixed(2)}%` : "N/A"}
                    </span>
                  </div>

                  {/* Location Info */}
                  <div className="mt-2 text-xs font-mono text-neutral-500 leading-relaxed max-w-full truncate">
                    📍 {item.basicInfo?.location}
                  </div>
                </div>

                {/* Card Footer Button */}
                <Link 
                  href={`/iit-portal/${item.collegeId}`}
                  className="block w-full py-4 text-center font-mono font-bold text-sm uppercase bg-blue-950/80 hover:bg-blue-600 text-blue-400 hover:text-white border-t-2 border-blue-900 group-hover:border-blue-600 transition-colors duration-0"
                >
                  VIEW PROFILE →
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="border-3 border-blue-900 border-dashed p-16 text-center bg-[#071120] text-neutral-500 font-mono text-sm uppercase tracking-widest">
          No institutes match the active filter criteria. Clear search or sliders.
        </div>
      )}

    </div>
  );
}