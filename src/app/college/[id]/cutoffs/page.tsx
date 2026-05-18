"use client";

import { use, useState } from "react";
import { collegesData } from "@/data/colleges";

export default function CutoffsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const college = (collegesData as any)[id];
  const allCutoffs = college.cutoffs;

  const [categoryFilter, setCategoryFilter] = useState("All");
  const [branchFilter, setBranchFilter] = useState("All");

  const categories = ["All", ...Array.from(new Set(allCutoffs.map((c: any) => c.category)))];
  const branches = ["All", ...Array.from(new Set(allCutoffs.map((c: any) => c.branch)))];

  const filtered = allCutoffs.filter((c: any) => {
    return (categoryFilter === "All" || c.category === categoryFilter) &&
           (branchFilter === "All" || c.branch === branchFilter);
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row gap-8 mb-16 border-[6px] border-[var(--foreground)] p-8">
        <div className="flex-1 flex flex-col gap-4">
          <label className="text-2xl font-black tracking-widest uppercase">Category</label>
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full text-2xl md:text-4xl font-bold uppercase border-b-[4px] border-[var(--foreground)] bg-[var(--background)] text-[var(--foreground)] outline-none pb-2 cursor-pointer appearance-none rounded-none"
          >
            {categories.map((cat: any) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <label className="text-2xl font-black tracking-widest uppercase">Branch</label>
          <select 
            value={branchFilter} 
            onChange={(e) => setBranchFilter(e.target.value)}
            className="w-full text-2xl md:text-4xl font-bold uppercase border-b-[4px] border-[var(--foreground)] bg-[var(--background)] text-[var(--foreground)] outline-none pb-2 cursor-pointer appearance-none rounded-none"
          >
            {branches.map((br: any) => <option key={br} value={br}>{br}</option>)}
          </select>
        </div>
      </div>

      <div className="w-full overflow-x-auto border-[6px] border-[var(--foreground)]">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[var(--foreground)] text-[var(--background)]">
              <th className="p-6 text-2xl font-black tracking-widest uppercase border-r-[4px] border-[var(--background)]">Branch</th>
              <th className="p-6 text-2xl font-black tracking-widest uppercase border-r-[4px] border-[var(--background)]">Quota</th>
              <th className="p-6 text-2xl font-black tracking-widest uppercase border-r-[4px] border-[var(--background)]">Category</th>
              <th className="p-6 text-2xl font-black tracking-widest uppercase border-r-[4px] border-[var(--background)]">Gender</th>
              <th className="p-6 text-2xl font-black tracking-widest uppercase text-right">R6 Closing</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c: any, idx: number) => (
              <tr key={idx} className="border-t-[4px] border-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors duration-0 cursor-default">
                <td className="p-6 text-xl md:text-2xl font-bold uppercase tracking-tight border-r-[4px] border-[var(--foreground)]">{c.branch}</td>
                <td className="p-6 text-xl md:text-2xl font-bold uppercase tracking-tight border-r-[4px] border-[var(--foreground)]">{c.quota}</td>
                <td className="p-6 text-xl md:text-2xl font-bold uppercase tracking-tight border-r-[4px] border-[var(--foreground)]">{c.category}</td>
                <td className="p-6 text-xl md:text-2xl font-bold uppercase tracking-tight border-r-[4px] border-[var(--foreground)]">{c.gender}</td>
                <td className="p-6 text-3xl font-black uppercase tracking-tighter text-right">{c.round6Closing}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-4xl font-black uppercase tracking-tighter">No Cutoffs Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
