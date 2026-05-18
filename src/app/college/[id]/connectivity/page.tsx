import { collegesData } from "@/data/colleges";
import { Plane, Train } from "lucide-react";

export default async function ConnectivityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const college = (collegesData as any)[id];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-12 border-t-[6px] border-[var(--foreground)] pt-12">
      <div className="flex flex-col md:flex-row gap-8 items-start border-[4px] border-[var(--foreground)] p-8">
        <div className="bg-[var(--foreground)] text-[var(--background)] p-6">
          <Plane size={80} strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <h2 className="text-4xl font-black uppercase tracking-widest mb-4">Airport Connectivity</h2>
          <p className="text-2xl md:text-4xl font-mono uppercase font-bold max-w-4xl">
            {college.overview.connectivity.airport}
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start border-[4px] border-[var(--foreground)] p-8">
        <div className="bg-[var(--foreground)] text-[var(--background)] p-6">
          <Train size={80} strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <h2 className="text-4xl font-black uppercase tracking-widest mb-4">Railway Connectivity</h2>
          <p className="text-2xl md:text-4xl font-mono uppercase font-bold max-w-4xl">
            {college.overview.connectivity.railway}
          </p>
        </div>
      </div>
    </div>
  );
}
