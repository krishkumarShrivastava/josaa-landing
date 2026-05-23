import iitsData from "@/data/all_iits_combined.json";

export interface IITData {
  collegeId: string;
  basicInfo: {
    name: string;
    alsoKnownAs: string;
    type: string;
    established: string;
    location: string;
    connectivity?: {
      airport: string;
      railway: string[];
    };
    campusFacilities: string[];
  };
  admissionProcess: string[];
  rankings: {
    international: any[];
    national: { body: string; rank: string; previous: string }[];
  };
  fees: {
    instituteFee: Record<string, string>;
    hostelFee: Record<string, string>;
    totalFirstSemester: string;
    feeWaivers: string[];
  };
  placements: {
    [year: string]: {
      statistics: {
        overallPlacementPercentage?: string;
        placementPercentage?: string;
        branchWisePlacementPercentage?: any;
      };
      packages?: {
        overall?: {
          median?: string;
          highest?: string;
          average?: string;
        };
        highest?: string;
        average?: string;
        median?: string;
        branchWise?: any;
      };
      topRecruiters?: {
        techAndSoftware?: string[];
        financeAndQuant?: string[];
        coreAndConsulting?: string[];
        [key: string]: string[] | undefined;
      };
    };
  };
}

export function getAllIITs(): IITData[] {
  return iitsData as unknown as IITData[];
}

export function getIITById(id: string): IITData | undefined {
  return getAllIITs().find(
    (c) => c.collegeId.toLowerCase() === id.toLowerCase()
  );
}