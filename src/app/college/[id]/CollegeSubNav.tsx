"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function CollegeSubNav({ id }: { id: string }) {
  const pathname = usePathname();
  
  const links = [
    { name: "Overview", path: `/college/${id}` },
    { name: "Connectivity", path: `/college/${id}/connectivity` },
    { name: "Fees", path: `/college/${id}/fees` },
    { name: "Placements", path: `/college/${id}/placements` },
    { name: "Cutoffs", path: `/college/${id}/cutoffs` },
    { name: "Seat Matrix", path: `/college/${id}/seat-matrix` }
  ];

  return (
    <nav className="sticky top-0 z-40 bg-[var(--background)] border-y-[6px] border-[var(--foreground)] w-full overflow-x-auto no-scrollbar flex text-xl md:text-3xl font-black tracking-tighter uppercase uppercase">
      {links.map((link) => {
        const isActive = pathname === link.path;
        return (
          <Link 
            key={link.name} 
            href={link.path}
            className={`px-8 py-4 whitespace-nowrap transition-colors ${isActive ? 'bg-[var(--foreground)] text-[var(--background)]' : 'hover:bg-[var(--foreground)] hover:text-[var(--background)] text-[var(--foreground)]'}`}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}
