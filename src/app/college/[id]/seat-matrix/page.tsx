"use client";
import { collegesData } from "@/data/colleges";
import { use } from "react";
import React from "react";

export default function SeatMatrixPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const college = collegesData[resolvedParams.id as keyof typeof collegesData];

  if (!college) {
    return <div className="p-8 text-[var(--foreground)]">College not found</div>;
  }

  const seatMatrix = (college as any).seatMatrix || [];

  return (
    <div className="flex-1 w-full bg-[var(--background)] min-h-screen border-t-[6px] border-[var(--foreground)] border-l-[6px] p-8 md:p-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-[var(--foreground)] mb-12">Seat Matrix</h2>
        
        {seatMatrix.length > 0 ? (
          <div className="w-full overflow-x-auto border-[4px] border-[var(--foreground)] bg-[var(--foreground)] p-[4px]">
            <table className="w-full text-left border-collapse bg-[var(--background)] text-[var(--foreground)]">
              <thead>
                <tr className="border-b-[4px] border-[var(--foreground)] uppercase font-black text-xl md:text-2xl tracking-tighter">
                  <th className="p-4 border-r-[4px] border-[var(--foreground)]">Course Type</th>
                  <th className="p-4 border-r-[4px] border-[var(--foreground)]">Branch</th>
                  <th className="p-4 border-r-[4px] border-[var(--foreground)]">Category</th>
                  <th className="p-4 border-r-[4px] border-[var(--foreground)]">Gender</th>
                  <th className="p-4">Seats</th>
                </tr>
              </thead>
              <tbody className="font-bold text-lg md:text-xl">
                {seatMatrix.map((row: any, i: number) => (
                  <tr key={i} className="border-b-[4px] border-[var(--foreground)] last:border-b-0 hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors">
                    <td className="p-4 border-r-[4px] border-[var(--foreground)]">{row.courseType}</td>
                    <td className="p-4 border-r-[4px] border-[var(--foreground)]">{row.branch}</td>
                    <td className="p-4 border-r-[4px] border-[var(--foreground)]">{row.category}</td>
                    <td className="p-4 border-r-[4px] border-[var(--foreground)]">{row.gender}</td>
                    <td className="p-4">{row.seats}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-2xl font-bold uppercase tracking-tight text-[var(--foreground)]">Seat Matrix data not available.</p>
        )}
      </div>
    </div>
  );
}
