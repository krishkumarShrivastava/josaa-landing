import { useMemo } from "react";
import { getAllIITs, getIITById, IITData } from "@/utils/iitData";

export function useIITs() {
  const iits = useMemo(() => getAllIITs(), []);
  return iits;
}

export function useIIT(id: string) {
  const iit = useMemo(() => getIITById(id), [id]);
  return iit;
}