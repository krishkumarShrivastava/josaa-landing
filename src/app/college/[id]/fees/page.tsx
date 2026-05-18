import { collegesData } from "@/data/colleges";

export default async function FeesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const college = (collegesData as any)[id];
  const fees = college.fees;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="border-[6px] border-[var(--foreground)] p-8 flex flex-col justify-between">
          <h3 className="text-2xl font-black tracking-widest uppercase opacity-60 mb-8">One Time</h3>
          <p className="text-4xl md:text-6xl font-black tracking-tighter uppercase">{fees.oneTime}</p>
        </div>
        
        <div className="border-[6px] border-[var(--foreground)] p-8 flex flex-col justify-between">
          <h3 className="text-2xl font-black tracking-widest uppercase opacity-60 mb-8">Caution Money</h3>
          <p className="text-4xl md:text-6xl font-black tracking-tighter uppercase">{fees.cautionMoney}</p>
        </div>

        <div className="border-[6px] border-[var(--foreground)] p-8 flex flex-col justify-between bg-[var(--foreground)] text-[var(--background)]">
          <h3 className="text-2xl font-black tracking-widest uppercase opacity-60 mb-8">Tuition / Sem</h3>
          <p className="text-5xl md:text-7xl font-black tracking-tighter uppercase">{fees.tuitionPerSemester}</p>
        </div>

        <div className="border-[6px] border-[var(--foreground)] p-8 flex flex-col justify-between">
          <h3 className="text-2xl font-black tracking-widest uppercase opacity-60 mb-8">Other / Sem</h3>
          <p className="text-4xl md:text-5xl font-black tracking-tighter uppercase">{fees.otherFeesPerSemester}</p>
        </div>

        <div className="border-[6px] border-[var(--foreground)] p-8 flex flex-col justify-between">
          <h3 className="text-2xl font-black tracking-widest uppercase opacity-60 mb-8">Hostel & Mess / Sem</h3>
          <p className="text-4xl md:text-6xl font-black tracking-tighter uppercase">{fees.hostelAndMessPerSemester}</p>
        </div>
        
        <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-[var(--foreground)] text-[var(--background)] p-12 md:p-16 mt-8">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-8 border-b-[6px] border-[var(--background)] pb-4 inline-block">
            Fee Waivers
          </h2>
          <p className="text-3xl md:text-5xl font-bold tracking-tight leading-snug uppercase">
            {fees.feeWaivers}
          </p>
        </div>
      </div>
    </div>
  );
}
