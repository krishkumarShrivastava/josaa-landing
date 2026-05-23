import IITDashboard from "./IITDashboard";
import { getAllIITs } from "@/utils/iitData";

export default function IITPortalPage() {
  const iits = getAllIITs();
  return (
    <div className="bg-[#050B14] min-h-screen text-white font-sans antialiased">
      <IITDashboard initialData={iits} />
    </div>
  );
}