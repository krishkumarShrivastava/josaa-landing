import { collegesData } from "@/data/colleges";

export default async function PlacementsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const college = (collegesData as any)[id];
  const plac = college.placements;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-16">
      <div className="grid grid-cols-1 md:grid-cols-2 border-[6px] border-[var(--foreground)]">
        <div className="p-12 border-b-[6px] md:border-b-0 md:border-r-[6px] border-[var(--foreground)] flex flex-col justify-center">
          <h2 className="text-2xl font-black tracking-widest uppercase opacity-60 mb-4">Average Package</h2>
          <p className="text-6xl md:text-[8vw] leading-none font-black tracking-tighter uppercase">{plac.averagePackage}</p>
        </div>
        <div className="p-12 flex flex-col justify-center bg-[var(--foreground)] text-[var(--background)]">
          <h2 className="text-2xl font-black tracking-widest uppercase opacity-60 mb-4 text-[var(--background)]">Highest Package</h2>
          <p className="text-6xl md:text-[6vw] leading-none font-black tracking-tighter uppercase">{plac.highestPackage}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b-[6px] border-[var(--foreground)] pb-8">
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">Overall Rate</h2>
        <p className="text-6xl md:text-8xl font-black tracking-tighter uppercase">{plac.overallPlacementRate}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-12 border-b-[6px] border-[var(--foreground)] pb-4 inline-block">Top Sectors</h2>
          <div className="flex flex-wrap gap-4">
            {plac.topSectors.map((sector: string) => (
              <span key={sector} className="text-2xl md:text-4xl font-bold uppercase tracking-widest border-[4px] border-[var(--foreground)] px-6 py-3">
                {sector}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-12 border-b-[6px] border-[var(--foreground)] pb-4 inline-block">Top Recruiters</h2>
          <div className="flex flex-wrap gap-4">
            {plac.topRecruiters.map((recruiter: string) => (
              <span key={recruiter} className="text-2xl md:text-4xl font-black uppercase tracking-tighter bg-[var(--foreground)] text-[var(--background)] px-6 py-3">
                {recruiter}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
