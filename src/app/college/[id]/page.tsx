"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useParams } from "next/navigation";
import iitOpenRanks from "../../../data/iitOpenRanks.json";
import iitDelhiData from "../../../data/iit-delhi.json";
import { masterColleges, collegeShortNames } from "@/data/compiledColleges";
import { collegesData } from "@/data/colleges";
import allIitsData from "@/data/all_iits_combined.json";

// JoSAA round cutoff data (2025: rounds 1-6, 2024: rounds 1-5)
import r1_2025 from "@/data/round1_cutoffs.json";
import r2_2025 from "@/data/round2_cutoffs.json";
import r3_2025 from "@/data/round3_cutoffs.json";
import r4_2025 from "@/data/round4_cutoffs.json";
import r5_2025 from "@/data/round5_cutoffs.json";
import r6_2025 from "@/data/round6_cutoffs.json";
import r1_2024 from "@/data/round1_cutoffs_2024.json";
import r2_2024 from "@/data/round2_cutoffs_2024.json";
import r3_2024 from "@/data/round3_cutoffs_2024.json";
import r4_2024 from "@/data/round4_cutoffs_2024.json";
import r5_2024 from "@/data/round5_cutoffs_2024.json";

type RawCutoffRow = {
  Institute: string;
  "Academic Program Name": string;
  Quota: string;
  "Seat Type": string;
  Gender: string;
  "Opening Rank": string;
  "Closing Rank": string;
};

const JOSAA_ROUND_DATA: Record<string, Record<number, RawCutoffRow[]>> = {
  "2025": {
    1: r1_2025 as unknown as RawCutoffRow[],
    2: r2_2025 as unknown as RawCutoffRow[],
    3: r3_2025 as unknown as RawCutoffRow[],
    4: r4_2025 as unknown as RawCutoffRow[],
    5: r5_2025 as unknown as RawCutoffRow[],
    6: r6_2025 as unknown as RawCutoffRow[],
  },
  "2024": {
    1: r1_2024 as unknown as RawCutoffRow[],
    2: r2_2024 as unknown as RawCutoffRow[],
    3: r3_2024 as unknown as RawCutoffRow[],
    4: r4_2024 as unknown as RawCutoffRow[],
    5: r5_2024 as unknown as RawCutoffRow[],
  },
};

const COLLEGE_ID_TO_JOSAA: Record<string, string[]> = {
  "iit-bombay":      ["Indian Institute  of Technology Bombay"],
  "iit-delhi":       ["Indian Institute  of Technology Delhi"],
  "iit-madras":      ["Indian Institute  of Technology Madras"],
  "iit-kanpur":      ["Indian Institute  of Technology Kanpur"],
  "iit-kharagpur":   ["Indian Institute  of Technology Kharagpur"],
  "iit-roorkee":     ["Indian Institute  of Technology Roorkee"],
  "iit-guwahati":    ["Indian Institute  of Technology Guwahati"],
  "iit-hyderabad":   ["Indian Institute  of Technology Hyderabad"],
  "iit-bhu":         ["Indian Institute  of Technology (BHU) Varanasi"],
  "iit-indore":      ["Indian Institute  of Technology Indore"],
  "iit-gandhinagar": ["Indian Institute  of Technology Gandhinagar"],
  "iit-ropar":       ["Indian Institute  of Technology Ropar"],
  "iit-jodhpur":     ["Indian Institute  of Technology Jodhpur"],
  "iit-mandi":       ["Indian Institute  of Technology Mandi"],
  "iit-patna":       ["Indian Institute  of Technology Patna"],
  "iit-bhubaneswar": ["Indian Institute  of Technology Bhubaneswar"],
  "iit-ism":         ["Indian Institute  of Technology (ISM) Dhanbad"],
  "iit-tirupati":    ["Indian Institute of Technology Tirupati"],
  "iit-goa":         ["Indian Institute of Technology Goa"],
  "iit-palakkad":    ["Indian Institute  of Technology Palakkad"],
  "iit-jammu":       ["Indian Institute of Technology Jammu"],
  "iit-dharwad":     ["Indian Institute of Technology Dharwad"],
  "iit-bhilai":      ["Indian Institute of Technology Bhilai"],
};

function getJoSAACutoffsFromCsab(collegeId: string, exactName: string, csabData: any[]) {
  const norm = (s: string) => s.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  const names = (COLLEGE_ID_TO_JOSAA[collegeId] ?? []).map(norm);
  return csabData
    .filter(r => names.length > 0
      ? names.some(n => norm(r.Institute) === n)
      : norm(r.Institute) === norm(exactName) || norm(r.Institute).includes(collegeId.replace(/-/g, " "))
    )
    .map(r => ({
      branch: r["Academic Program Name"],
      quota: r.Quota,
      category: r["Seat Type"],
      gender: r.Gender === "Female-only (including Supernumerary)" ? "Female Only" : r.Gender,
      openingRank: parseInt(r["Opening Rank"]) || 0,
      closingRank: parseInt(r["Closing Rank"]) || 0,
    }));
}

function getJoSAACutoffs(collegeId: string, exactName: string, year: string, roundNum: number) {
  const data = JOSAA_ROUND_DATA[year]?.[roundNum];
  if (!data) return [];
  const norm = (s: string) => s.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  const names = (COLLEGE_ID_TO_JOSAA[collegeId] ?? []).map(norm);
  return data
    .filter(r => names.length > 0
      ? names.some(n => norm(r.Institute) === n)
      : norm(r.Institute) === norm(exactName) || norm(r.Institute).includes(collegeId.replace(/-/g, " "))
    )
    .map(r => ({
      branch: r["Academic Program Name"],
      quota: r.Quota,
      category: r["Seat Type"],
      gender: r.Gender === "Female-only (including Supernumerary)" ? "Female Only" : r.Gender,
      openingRank: parseInt(r["Opening Rank"]) || 0,
      closingRank: parseInt(r["Closing Rank"]) || 0,
    }));
}
import nitOpenRanks from "../../../data/nitOpenRanks.json";

gsap.registerPlugin(ScrollTrigger);

const DATA = {
  name: "IIT Bombay",
  fullName: "Indian Institute of Technology, Bombay",
  established: 1958,
  location: "Powai, Mumbai",
  type: "Government",
  stats: {
    placementRate: "83.39%",
    avgPackage: "₹23.50 LPA",
    nirfRank: "3"
  },
  fees: {
    instituteFee: {
      cautionMoney_Refundable: "₹6,000",
      oneTimeFees: "₹10,000",
      tuitionFee_PerSemester: "₹1,00,000",
      otherFees_PerSemester: "₹7,350",
      total: "₹1,23,350"
    },
    hostelFee: {
      messCautionMoney_Refundable: "₹3,000",
      hostelSeatRent_PerSemester: "₹2,500",
      electricityWater_PerSemester: "₹4,000",
      otherFees_PerSemester: "₹7,400",
      messAdvance_PerSemester: "₹22,500",
      total: "₹39,400"
    },
    feeWaivers: [
      "100% Tuition Fee waiver for SC/ST/PwD students.",
      "100% Tuition Fee remission for Most Economically Backward students with family income less than ₹1 lakh per annum.",
      "2/3rd Tuition Fee remission for Other Economically Backward students with family income between ₹1 lakh to ₹5 lakh per annum."
    ]
  },
  seats: {
    totalSeatSummary: {
      overallTotal: 1360,
      branches: [
        { name: "Aerospace Engineering", genderNeutral: 59, femaleOnly: 13 },
        { name: "Chemical Engineering", genderNeutral: 102, femaleOnly: 22 },
        { name: "Civil Engineering", genderNeutral: 120, femaleOnly: 26 },
        { name: "Computer Science and Engineering", genderNeutral: 159, femaleOnly: 39 },
        { name: "Electrical Engineering", genderNeutral: 89, femaleOnly: 23 },
        { name: "Energy Engineering", genderNeutral: 37, femaleOnly: 10 },
        { name: "Engineering Physics", genderNeutral: 46, femaleOnly: 12 },
        { name: "Environmental Science and Engineering", genderNeutral: 37, femaleOnly: 9 },
        { name: "Industrial Engineering and Operations Research", genderNeutral: 32, femaleOnly: 8 },
        { name: "Mechanical Engineering", genderNeutral: 163, femaleOnly: 39 },
        { name: "Metallurgical Engineering and Materials Science", genderNeutral: 83, femaleOnly: 22 },
        { name: "Chemistry (4-Year B.S.)", genderNeutral: 28, femaleOnly: 7 },
        { name: "Economics (4-Year B.S.)", genderNeutral: 32, femaleOnly: 8 },
        { name: "Mathematics (4-Year B.S.)", genderNeutral: 14, femaleOnly: 4 },
        { name: "Electrical Engineering (5-Year B.Tech + M.Tech Dual)", genderNeutral: 73, femaleOnly: 16 },
        { name: "Applied Geophysics (4-Year B.S.)", genderNeutral: 22, femaleOnly: 6 }
      ]
    },
    categoryWiseData: {
      EWS: {
        "Gender-Neutral": [
          { name: "Aerospace Engineering", seats: 5 },
          { name: "Chemical Engineering", seats: 9 },
          { name: "Civil Engineering", seats: 11 },
          { name: "Computer Science and Engineering", seats: 15 },
          { name: "Electrical Engineering", seats: 8 },
          { name: "Energy Engineering", seats: 3 },
          { name: "Engineering Physics", seats: 5 },
          { name: "Environmental Science and Engineering", seats: 4 },
          { name: "Industrial Engineering and Operations Research", seats: 3 },
          { name: "Mechanical Engineering", seats: 15 },
          { name: "Metallurgical Engineering and Materials Science", seats: 8 },
          { name: "Chemistry (4-Year B.S.)", seats: 2 },
          { name: "Economics (4-Year B.S.)", seats: 2 },
          { name: "Mathematics (4-Year B.S.)", seats: 1 },
          { name: "Electrical Engineering (5-Year Dual)", seats: 7 },
          { name: "Applied Geophysics (4-Year B.S.)", seats: 2 }
        ],
        total: 100
      }
    }
  }
};


const SEAT_MATRIX_DATA: Record<string, Record<string, { name: string; seats: number; courseType: string }[]>> = {
  "General": {
    "Gender-Neutral": [
      { name: "Aerospace Engineering", seats: 24, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Chemical Engineering", seats: 40, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Civil Engineering", seats: 47, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Computer Science and Engineering", seats: 61, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Electrical Engineering", seats: 35, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Energy Engineering", seats: 15, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Engineering Physics", seats: 18, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Environmental Science and Engineering", seats: 14, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Industrial Engineering and Operations Research", seats: 12, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Mechanical Engineering", seats: 64, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Metallurgical Engineering and Materials Science", seats: 34, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Chemistry", seats: 12, courseType: "4-Year B.S. Course" },
      { name: "Economics", seats: 13, courseType: "4-Year B.S. Course" },
      { name: "Mathematics", seats: 6, courseType: "4-Year B.S. Course" },
      { name: "Electrical Engineering", seats: 29, courseType: "5-Year B.Tech + M.Tech. (Dual Degree) Course" },
      { name: "Applied Geophysics", seats: 8, courseType: "4-Year B.S. Course" },
    ],
    "Female-Only": [
      { name: "Aerospace Engineering", seats: 5, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Chemical Engineering", seats: 8, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Civil Engineering", seats: 10, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Computer Science and Engineering", seats: 15, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Electrical Engineering", seats: 8, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Energy Engineering", seats: 4, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Engineering Physics", seats: 5, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Environmental Science and Engineering", seats: 4, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Industrial Engineering and Operations Research", seats: 3, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Mechanical Engineering", seats: 16, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Metallurgical Engineering and Materials Science", seats: 7, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Chemistry", seats: 2, courseType: "4-Year B.S. Course" },
      { name: "Economics", seats: 3, courseType: "4-Year B.S. Course" },
      { name: "Mathematics", seats: 1, courseType: "4-Year B.S. Course" },
      { name: "Electrical Engineering", seats: 6, courseType: "5-Year B.Tech + M.Tech. (Dual Degree) Course" },
      { name: "Applied Geophysics", seats: 2, courseType: "4-Year B.S. Course" },
    ],
  },
  "EWS": {
    "Gender-Neutral": [
      { name: "Aerospace Engineering", seats: 5, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Chemical Engineering", seats: 9, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Civil Engineering", seats: 11, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Computer Science and Engineering", seats: 15, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Electrical Engineering", seats: 8, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Energy Engineering", seats: 3, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Engineering Physics", seats: 5, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Environmental Science and Engineering", seats: 4, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Industrial Engineering and Operations Research", seats: 3, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Mechanical Engineering", seats: 15, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Metallurgical Engineering and Materials Science", seats: 8, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Chemistry", seats: 2, courseType: "4-Year B.S. Course" },
      { name: "Economics", seats: 2, courseType: "4-Year B.S. Course" },
      { name: "Mathematics", seats: 1, courseType: "4-Year B.S. Course" },
      { name: "Electrical Engineering", seats: 7, courseType: "5-Year B.Tech + M.Tech. (Dual Degree) Course" },
      { name: "Applied Geophysics", seats: 2, courseType: "4-Year B.S. Course" },
    ],
    "Female-Only": [
      { name: "Aerospace Engineering", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Chemical Engineering", seats: 2, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Civil Engineering", seats: 3, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Computer Science and Engineering", seats: 4, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Electrical Engineering", seats: 3, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Energy Engineering", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Engineering Physics", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Environmental Science and Engineering", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Industrial Engineering and Operations Research", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Mechanical Engineering", seats: 4, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Metallurgical Engineering and Materials Science", seats: 2, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Chemistry", seats: 1, courseType: "4-Year B.S. Course" },
      { name: "Economics", seats: 1, courseType: "4-Year B.S. Course" },
      { name: "Mathematics", seats: 1, courseType: "4-Year B.S. Course" },
      { name: "Electrical Engineering", seats: 2, courseType: "5-Year B.Tech + M.Tech. (Dual Degree) Course" },
      { name: "Applied Geophysics", seats: 1, courseType: "4-Year B.S. Course" },
    ],
  },
  "OBC-NCL": {
    "Gender-Neutral": [
      { name: "Aerospace Engineering", seats: 16, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Chemical Engineering", seats: 27, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Civil Engineering", seats: 30, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Computer Science and Engineering", seats: 41, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Electrical Engineering", seats: 23, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Energy Engineering", seats: 9, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Engineering Physics", seats: 11, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Environmental Science and Engineering", seats: 9, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Industrial Engineering and Operations Research", seats: 8, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Mechanical Engineering", seats: 42, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Metallurgical Engineering and Materials Science", seats: 21, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Chemistry", seats: 7, courseType: "4-Year B.S. Course" },
      { name: "Economics", seats: 9, courseType: "4-Year B.S. Course" },
      { name: "Mathematics", seats: 3, courseType: "4-Year B.S. Course" },
      { name: "Electrical Engineering", seats: 18, courseType: "5-Year B.Tech + M.Tech. (Dual Degree) Course" },
      { name: "Applied Geophysics", seats: 6, courseType: "4-Year B.S. Course" },
    ],
    "Female-Only": [
      { name: "Aerospace Engineering", seats: 3, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Chemical Engineering", seats: 6, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Civil Engineering", seats: 7, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Computer Science and Engineering", seats: 10, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Electrical Engineering", seats: 6, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Energy Engineering", seats: 3, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Engineering Physics", seats: 3, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Environmental Science and Engineering", seats: 2, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Industrial Engineering and Operations Research", seats: 2, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Mechanical Engineering", seats: 10, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Metallurgical Engineering and Materials Science", seats: 5, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Chemistry", seats: 2, courseType: "4-Year B.S. Course" },
      { name: "Economics", seats: 2, courseType: "4-Year B.S. Course" },
      { name: "Mathematics", seats: 1, courseType: "4-Year B.S. Course" },
      { name: "Electrical Engineering", seats: 4, courseType: "5-Year B.Tech + M.Tech. (Dual Degree) Course" },
      { name: "Applied Geophysics", seats: 1, courseType: "4-Year B.S. Course" },
    ],
  },
  "SC": {
    "Gender-Neutral": [
      { name: "Aerospace Engineering", seats: 9, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Chemical Engineering", seats: 14, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Civil Engineering", seats: 17, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Computer Science and Engineering", seats: 23, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Electrical Engineering", seats: 12, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Energy Engineering", seats: 6, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Engineering Physics", seats: 6, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Environmental Science and Engineering", seats: 5, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Industrial Engineering and Operations Research", seats: 5, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Mechanical Engineering", seats: 24, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Metallurgical Engineering and Materials Science", seats: 12, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Chemistry", seats: 3, courseType: "4-Year B.S. Course" },
      { name: "Economics", seats: 4, courseType: "4-Year B.S. Course" },
      { name: "Mathematics", seats: 2, courseType: "4-Year B.S. Course" },
      { name: "Electrical Engineering", seats: 10, courseType: "5-Year B.Tech + M.Tech. (Dual Degree) Course" },
      { name: "Applied Geophysics", seats: 3, courseType: "4-Year B.S. Course" },
    ],
    "Female-Only": [
      { name: "Aerospace Engineering", seats: 2, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Chemical Engineering", seats: 3, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Civil Engineering", seats: 4, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Computer Science and Engineering", seats: 6, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Electrical Engineering", seats: 3, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Energy Engineering", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Engineering Physics", seats: 2, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Environmental Science and Engineering", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Industrial Engineering and Operations Research", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Mechanical Engineering", seats: 6, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Metallurgical Engineering and Materials Science", seats: 3, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Chemistry", seats: 1, courseType: "4-Year B.S. Course" },
      { name: "Economics", seats: 1, courseType: "4-Year B.S. Course" },
      { name: "Mathematics", seats: 1, courseType: "4-Year B.S. Course" },
      { name: "Electrical Engineering", seats: 3, courseType: "5-Year B.Tech + M.Tech. (Dual Degree) Course" },
      { name: "Applied Geophysics", seats: 1, courseType: "4-Year B.S. Course" },
    ],
  },
  "ST": {
    "Gender-Neutral": [
      { name: "Aerospace Engineering", seats: 3, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Chemical Engineering", seats: 7, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Civil Engineering", seats: 8, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Computer Science and Engineering", seats: 11, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Electrical Engineering", seats: 6, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Energy Engineering", seats: 2, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Engineering Physics", seats: 3, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Environmental Science and Engineering", seats: 3, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Industrial Engineering and Operations Research", seats: 2, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Mechanical Engineering", seats: 10, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Metallurgical Engineering and Materials Science", seats: 6, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Chemistry", seats: 2, courseType: "4-Year B.S. Course" },
      { name: "Economics", seats: 2, courseType: "4-Year B.S. Course" },
      { name: "Mathematics", seats: 1, courseType: "4-Year B.S. Course" },
      { name: "Electrical Engineering", seats: 5, courseType: "5-Year B.Tech + M.Tech. (Dual Degree) Course" },
      { name: "Applied Geophysics", seats: 2, courseType: "4-Year B.S. Course" },
    ],
    "Female-Only": [
      { name: "Aerospace Engineering", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Chemical Engineering", seats: 2, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Civil Engineering", seats: 2, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Computer Science and Engineering", seats: 3, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Electrical Engineering", seats: 3, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Energy Engineering", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Engineering Physics", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Environmental Science and Engineering", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Industrial Engineering and Operations Research", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Mechanical Engineering", seats: 3, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Metallurgical Engineering and Materials Science", seats: 2, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Chemistry", seats: 1, courseType: "4-Year B.S. Course" },
      { name: "Economics", seats: 1, courseType: "4-Year B.S. Course" },
      { name: "Electrical Engineering", seats: 1, courseType: "5-Year B.Tech + M.Tech. (Dual Degree) Course" },
      { name: "Applied Geophysics", seats: 1, courseType: "4-Year B.S. Course" },
    ],
  },
  "General-PwD": {
    "Gender-Neutral": [
      { name: "Chemical Engineering", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Civil Engineering", seats: 2, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Computer Science and Engineering", seats: 3, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Electrical Engineering", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Engineering Physics", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Environmental Science and Engineering", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Industrial Engineering and Operations Research", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Mechanical Engineering", seats: 3, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Metallurgical Engineering and Materials Science", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Electrical Engineering", seats: 1, courseType: "5-Year B.Tech + M.Tech. (Dual Degree) Course" },
      { name: "Applied Geophysics", seats: 1, courseType: "4-Year B.S. Course" },
    ],
    "Female-Only": [
      { name: "Chemical Engineering", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Computer Science and Engineering", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
    ],
  },
  "EWS-PwD": {
    "Gender-Neutral": [
      { name: "Aerospace Engineering", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Chemical Engineering", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Civil Engineering", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Computer Science and Engineering", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Electrical Engineering", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Energy Engineering", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Mechanical Engineering", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Chemistry", seats: 1, courseType: "4-Year B.S. Course" },
      { name: "Economics", seats: 1, courseType: "4-Year B.S. Course" },
      { name: "Electrical Engineering", seats: 1, courseType: "5-Year B.Tech + M.Tech. (Dual Degree) Course" },
    ],
    "Female-Only": [
      { name: "Metallurgical Engineering and Materials Science", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
    ],
  },
  "OBC-NCL-PwD": {
    "Gender-Neutral": [
      { name: "Chemical Engineering", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Civil Engineering", seats: 2, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Computer Science and Engineering", seats: 2, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Electrical Engineering", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Engineering Physics", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Environmental Science and Engineering", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Industrial Engineering and Operations Research", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Mechanical Engineering", seats: 2, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Metallurgical Engineering and Materials Science", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Mathematics", seats: 1, courseType: "4-Year B.S. Course" },
      { name: "Electrical Engineering", seats: 1, courseType: "5-Year B.Tech + M.Tech. (Dual Degree) Course" },
    ],
    "Female-Only": [
      { name: "Aerospace Engineering", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
    ],
  },
  "SC-PwD": {
    "Gender-Neutral": [
      { name: "Chemical Engineering", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Civil Engineering", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Computer Science and Engineering", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Electrical Engineering", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Engineering Physics", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Mechanical Engineering", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Chemistry", seats: 1, courseType: "4-Year B.S. Course" },
      { name: "Economics", seats: 1, courseType: "4-Year B.S. Course" },
      { name: "Electrical Engineering", seats: 1, courseType: "5-Year B.Tech + M.Tech. (Dual Degree) Course" },
    ],
    "Female-Only": [
      { name: "Metallurgical Engineering and Materials Science", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
    ],
  },
  "ST-PwD": {
    "Gender-Neutral": [
      { name: "Aerospace Engineering", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Chemical Engineering", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Civil Engineering", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Computer Science and Engineering", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Electrical Engineering", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Energy Engineering", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
      { name: "Mechanical Engineering", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
    ],
    "Female-Only": [
      { name: "Metallurgical Engineering and Materials Science", seats: 1, courseType: "4-Year B.E./B.Tech. Course" },
    ],
  },
};

const TABS = ["Overview", "Rankings", "Admission", "Cutoffs", "Placements", "Fees", "Seats"];
const CATEGORIES = ["All", "General", "EWS", "OBC-NCL", "SC", "ST", "General-PwD", "EWS-PwD", "OBC-NCL-PwD", "SC-PwD", "ST-PwD"];
const POOLS = ["All", "Gender Neutral", "Female Only"];

const PLACEMENT_YEARS = ["2024", "2023", "2022", "2021", "2020"];

const COLLEGE_DATA = {
  basicInfo: {
    name: "Indian Institute of Technology, Bombay",
    alsoKnownAs: "IITB, IIT Mumbai",
    type: "Government",
    established: "1958",
    location: "Powai, Mumbai, Maharashtra - 400076",
    connectivity: {
      airport: "Chhatrapati Shivaji Maharaj International Airport, Mumbai (7 km)",
      railway: ["Kanjurmarg Railway Station (2 km)", "Mumbai Central Railway Station (26 km)", "Chhatrapati Shivaji Terminus (29 km)"]
    },
    campusFacilities: ["Bank", "Library", "WiFi", "Canteen", "Boys Hostel", "Girls Hostel", "Sports", "Medical"]
  },
  admissionProcess: [
    "Candidates must qualify the JEE (Main) exam and then appear for the JEE (Advanced) exam.",
    "Candidates must secure at least 75% marks (65% for SC/ST/PwD) in Class XII OR be within the category-wise top 20 percentile.",
    "Admissions are based on the rank obtained in JEE (Advanced) through JoSAA Counselling."
  ],
  coursesOffered: {
    "4-Year B.Tech": ["Aerospace Engineering","Chemical Engineering","Civil Engineering","Computer Science and Engineering","Electrical Engineering","Energy Engineering","Engineering Physics","Environmental Science and Engineering","Industrial Engineering and Operations Research","Mechanical Engineering","Metallurgical Engineering and Materials Science"],
    "4-Year B.S.": ["Chemistry","Economics","Mathematics"],
    "5-Year Dual Degree": ["Electrical Engineering"]
  },
  rankings: {
    international: [
      { body: "Nature Index Global Institutional Rankings", rank: "286 (2026)", previous: "270 (2025)" },
      { body: "Academic Ranking of World Universities", rank: "801-900 (2025)", previous: "--" },
      { body: "QS World University Rankings", rank: "129 (2026)", previous: "118 (2025)" },
      { body: "QS Asia University Rankings", rank: "71 (2026)", previous: "48 (2025)" },
      { body: "QS World University Rankings - Engineering & Technology", rank: "28 (2025)", previous: "45 (2024)" }
    ],
    national: [
      { body: "NIRF Overall Rankings", rank: "3 (2025)", previous: "3 (2024)" },
      { body: "NIRF Engineering Rankings", rank: "3 (2025)", previous: "3 (2024)" },
      { body: "NIRF Research Rankings", rank: "4 (2025)", previous: "4 (2024)" },
      { body: "NIRF Innovation Rankings", rank: "2 (2025)", previous: "1 (2024)" },
      { body: "India Today Top Engineering Colleges", rank: "1 (2025)", previous: "2 (2024)" },
      { body: "Outlook India's Top Govt. Technical Universities", rank: "3 (2025)", previous: "3 (2024)" },
      { body: "The Week Top Engineering Colleges India", rank: "2 (2025)", previous: "2 (2024)" }
    ]
  },
  placements: {
    "2024": { averagePackage: "₹23.50 LPA", medianPackage: "₹17.92 LPA", highlights: [{ branch: "Computer Science and Engineering", rate: "90.74%" },{ branch: "Electrical Engineering", rate: "90.80%" },{ branch: "Mechanical Engineering", rate: "90.91%" },{ branch: "Chemical Engineering", rate: "82.03%" },{ branch: "Civil Engineering", rate: "82.47%" },{ branch: "Overall B.Tech", rate: "83.39%" }] },
    "2023": { averagePackage: "₹21.82 LPA", medianPackage: "₹20.00 LPA", highlights: [{ branch: "CSE", rate: "97.71%" },{ branch: "Aerospace", rate: "85.42%" },{ branch: "Mechanical", rate: "89.60%" },{ branch: "Overall B.Tech", rate: "88.07%" },{ branch: "Highest Domestic", rate: "₹1.68 Cr" },{ branch: "Highest International", rate: "₹3.67 Cr" }] },
    "2022": { averagePackage: "₹21.50 LPA", medianPackage: "N/A", highlights: [{ branch: "B.Tech Overall", rate: "96.11%" },{ branch: "Dual Degree Overall", rate: "97.87%" },{ branch: "B.S. Overall", rate: "81.40%" },{ branch: "Highest Domestic", rate: "₹1.80 Cr" },{ branch: "Highest International", rate: "₹2.15 Cr" }] },
    "2021": { averagePackage: "₹17.91 LPA", medianPackage: "N/A", highlights: [{ branch: "B.Tech Overall", rate: "87.15%" },{ branch: "Dual Degree Overall", rate: "93.62%" }] },
    "2020": { averagePackage: "₹20.08 LPA", medianPackage: "N/A", highlights: [{ branch: "Microsoft Offer", rate: "1,64,000 USD/yr" },{ branch: "Uber Offer", rate: "1,43,000 USD/yr" },{ branch: "Google Offer", rate: "₹32.00 LPA" },{ branch: "Qualcomm Offer", rate: "₹32.59 LPA" }] }
  },
  cutoffs: [
    { branch: "Computer Science and Engineering", closingRank: 68 },
    { branch: "Electrical Engineering", closingRank: 496 },
    { branch: "Mechanical Engineering", closingRank: 1685 },
    { branch: "Aerospace Engineering", closingRank: 2394 },
    { branch: "Civil Engineering", closingRank: 4046 }
  ]
} as const;




const INSTITUTE_MAP: Record<string, string> = {
  // IITs
  "iitbombay": "IIT Bombay", "iitb": "IIT Bombay",
  "iitdelhi": "IIT Delhi", "iitd": "IIT Delhi",
  "iitmadras": "IIT Madras", "iitm": "IIT Madras",
  "iitkanpur": "IIT Kanpur", "iitk": "IIT Kanpur",
  "iitkharagpur": "IIT Kharagpur", "iitkgp": "IIT Kharagpur",
  "iitroorkee": "IIT Roorkee", "iitr": "IIT Roorkee",
  "iitguwahati": "IIT Guwahati", "iitg": "IIT Guwahati",
  "iithyderabad": "IIT Hyderabad", "iith": "IIT Hyderabad",
  "iitbhu": "IIT (BHU) Varanasi", "iitvaranasi": "IIT (BHU) Varanasi",
  "iitindore": "IIT Indore", "iiti": "IIT Indore",
  "iitgandhinagar": "IIT Gandhinagar", "iitgn": "IIT Gandhinagar",
  "iitropar": "IIT Ropar", "iitpr": "IIT Ropar",
  "iitjodhpur": "IIT Jodhpur", "iitj": "IIT Jodhpur",
  "iitmandi": "IIT Mandi",
  "iitpatna": "IIT Patna", "iitp": "IIT Patna",
  "iitbhubaneswar": "IIT Bhubaneswar", "iitbbs": "IIT Bhubaneswar",
  "iitdhanbad": "IIT (ISM) Dhanbad", "iitism": "IIT (ISM) Dhanbad",
  "iittirupati": "IIT Tirupati", "iitt": "IIT Tirupati",
  "iitgoa": "IIT Goa",
  "iitpalakkad": "IIT Palakkad", "iitpkd": "IIT Palakkad",
  "iitjammu": "IIT Jammu",
  "iitdharwad": "IIT Dharwad", "iitdh": "IIT Dharwad",
  "iitbhilai": "IIT Bhilai",

  // NITs
  "nitt": "NIT Tiruchirappalli", "nittrichy": "NIT Tiruchirappalli",
  "nitk": "NIT Karnataka", "nitsurathkal": "NIT Karnataka",
  "nitw": "NIT Warangal", "nitwarangal": "NIT Warangal",
  "nitr": "NIT Rourkela", "nitrourkela": "NIT Rourkela",
  "mnnit": "MNNIT Allahabad", "mnnitallahabad": "MNNIT Allahabad",
  "nitc": "NIT Calicut", "nitcalicut": "NIT Calicut",
  "mnit": "MNIT Jaipur", "mnitjaipur": "MNIT Jaipur",
  "vnit": "VNIT Nagpur", "vnitnagpur": "VNIT Nagpur",
  "svnit": "SVNIT Surat", "svnitsurat": "SVNIT Surat",
  "nitkkr": "NIT Kurukshetra", "nitkurukshetra": "NIT Kurukshetra",
  "nitjsr": "NIT Jamshedpur", "nitjamshedpur": "NIT Jamshedpur",
  "nitd": "NIT Delhi", "nitdelhi": "NIT Delhi",
  "nitdgp": "NIT Durgapur", "nitdurgapur": "NIT Durgapur",
  "nitbhopal": "NIT Bhopal", "manit": "NIT Bhopal",
  "nitj": "NIT Jalandhar", "nitjalandhar": "NIT Jalandhar",
  "nits": "NIT Silchar", "nitsilchar": "NIT Silchar",
  "nith": "NIT Hamirpur", "nithamirpur": "NIT Hamirpur",
  "nitg": "NIT Goa",
  "nitrr": "NIT Raipur", "nitraipur": "NIT Raipur",
  "nitp": "NIT Patna", "nitpatna": "NIT Patna",
  "iiest": "IIEST Shibpur", "iiestshibpur": "IIEST Shibpur",
  
  // Extra NITs
  "nituttarakhand": "NIT Uttarakhand",
  "nitpuducherry": "NIT Puducherry",
  "nitandhrapradesh": "NIT Andhra Pradesh",
  "nitmeghalaya": "NIT Meghalaya",
  "nitagartala": "NIT Agartala",
  "nitsrinagar": "NIT Srinagar",
  "nitsikkim": "NIT Sikkim",
  "nitarunachalpradesh": "NIT Arunachal Pradesh",
  "nitmanipur": "NIT Manipur",
  "nitnagaland": "NIT Nagaland",
  "nitmizoram": "NIT Mizoram"
};

function getInstituteName(id: string): string {
  const normalized = id.toLowerCase().replace(/-/g, "");
  if (INSTITUTE_MAP[normalized]) {
    return INSTITUTE_MAP[normalized];
  }
  return id.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

function getCollegeBasicInfo(id: string, name: string, type: string) {
  if (id === "iit-delhi") {
    return iitDelhiData.basicInfo;
  }
  const isNit = type === "NITs";
  const isIiit = type === "IIITs";
  const isGfti = type === "GFTIs";
  
  const aliases = collegeShortNames[id] || [];
  const alsoKnownAs = aliases[0]?.toUpperCase() || id.replace(/-/g, " ").toUpperCase();
  
  let established = "1960";
  if (isNit) established = "1965";
  else if (isIiit) established = "2013";
  else if (isGfti) established = "2002";

  return {
    name: name,
    alsoKnownAs: alsoKnownAs,
    type: type === "IITs" ? "IIT" : type === "NITs" ? "NIT" : type === "IIITs" ? "IIIT" : "GFTI",
    established: established,
    location: `${name} Campus, India`,
    connectivity: {
      airport: `Nearest International Airport (approx. 25 km)`,
      railway: [
        `Nearest Local Railway Junction (5 km)`,
        `State Central Railway Terminal (15 km)`
      ]
    },
    campusFacilities: ["WiFi", "Library", "Boys Hostel", "Girls Hostel", "Sports", "Medical", "Bank", "Canteen"]
  };
}

// Helper type for placement year records
type PlacementYearRecord = {
  averagePackage: string;
  medianPackage: string;
  highlights: { branch: string; rate: string }[];
};

export default function DeepLuminousCollegePage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id.toLowerCase() : "iit-bombay";
  const hasRichData = !!(collegesData as Record<string, unknown>)[id];
  const isIITBombay = id === "iit-bombay" || id === "iitb";

  // Load college record as Record<string,any> so every property access is any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const _col = ((collegesData as Record<string, any>)[id]
    ?? (collegesData as Record<string, any>)["iit-bombay"]) as Record<string, any>;

  // ── COLLEGE_DATA (shadows module-level const) ──────────────────────────────
  const COLLEGE_DATA = {
    basicInfo: {
      name: String(_col.name ?? ""),
      alsoKnownAs: (Array.isArray(_col.alsoKnownAs)
        ? (_col.alsoKnownAs as string[]).join(", ")
        : String(_col.alsoKnownAs ?? id.toUpperCase())),
      type: String(_col.type ?? "Government"),
      established: String(_col.established ?? "N/A"),
      location: String(_col.location ?? ""),
      connectivity: {
        airport: String(_col.overview?.connectivity?.airport ?? "Nearest Airport (~25 km)"),
        railway: (Array.isArray(_col.overview?.connectivity?.railway)
          ? (_col.overview.connectivity.railway as string[])
          : typeof _col.overview?.connectivity?.railway === "string"
          ? [String(_col.overview.connectivity.railway)]
          : ["Nearest Railway Junction (~5 km)"]) as string[],
      },
      campusFacilities: (Array.isArray(_col.basicInfo?.campusFacilities)
        ? (_col.basicInfo.campusFacilities as string[])
        : ["WiFi", "Library", "Boys Hostel", "Girls Hostel", "Sports", "Medical", "Bank", "Canteen"]),
    },
    admissionProcess: (Array.isArray(_col.admissionProcess)
      ? (_col.admissionProcess as string[])
      : []) as string[],
    coursesOffered: {
      "Programs Offered": Array.from(
        new Set(
          (Array.isArray(_col.seatMatrix) ? (_col.seatMatrix as { branch: string }[]) : [])
            .map((r) => r.branch)
        )
      ) as string[],
    },
    rankings: {
      national: (Array.isArray(_col.rankings) ? (_col.rankings as { body: unknown; rank: unknown; previous?: unknown }[]) : [])
        .map((r) => ({
          body: String(r.body ?? ""),
          rank: String(r.rank ?? "N/A"),
          previous: String(r.previous ?? "--"),
        })) as { body: string; rank: string; previous: string }[],
      international: [] as { body: string; rank: string; previous: string }[],
    },
    // placements: build a Record<year, PlacementYearRecord> from raw data
    placements: ((): Record<string, PlacementYearRecord> => {
      const raw = (_col.placements ?? {}) as Record<string, unknown>;
      const out: Record<string, PlacementYearRecord> = {};
      for (const [yr, val] of Object.entries(raw)) {
        if (typeof val !== "object" || val === null) continue;
        const v = val as Record<string, unknown>;
        // highlights can come from v.highlights OR v.branchHighlights (compile_colleges format)
        const hl: { branch: string; rate: string }[] = Array.isArray(v.highlights)
          ? (v.highlights as { branch?: unknown; rate?: unknown }[]).map((h) => ({
              branch: String(h.branch ?? ""),
              rate: String(h.rate ?? "N/A"),
            }))
          : Array.isArray(v.branchHighlights)
          ? (v.branchHighlights as { branch?: unknown; placed?: unknown; rate?: unknown }[]).map((h) => ({
              branch: String(h.branch ?? ""),
              rate: String(h.placed ?? h.rate ?? "N/A"),
            }))
          : [];
        out[yr] = {
          averagePackage: String(v.averagePackage ?? "N/A"),
          medianPackage: String(v.medianPackage ?? "N/A"),
          highlights: hl,
        };
      }
      // Guarantee "2024" key always exists
      if (!out["2024"]) {
        const ph = (_col.placements ?? {}) as Record<string, unknown>;
        const bh = Array.isArray(ph.branchHighlights)
          ? (ph.branchHighlights as { branch?: unknown; placed?: unknown; rate?: unknown }[]).map((b) => ({
              branch: String(b.branch ?? ""),
              rate: String(b.placed ?? b.rate ?? "N/A"),
            }))
          : [];
        out["2024"] = {
          averagePackage: String(ph.averagePackage ?? "N/A"),
          medianPackage: String(ph.medianPackage ?? "N/A"),
          highlights: bh,
        };
      }
      return out;
    })(),
    fees: (_col.fees ?? {}) as Record<string, unknown>,
    cutoffs: (Array.isArray(_col.cutoffs) ? (_col.cutoffs as Record<string, unknown>[]) : []).map((c) => ({
      branch: String(c.branch ?? ""),
      closingRank: Number(c.round6Closing ?? c.closingRank ?? 1000),
    })) as { branch: string; closingRank: number }[],
    seatMatrix: (Array.isArray(_col.seatMatrix)
      ? (_col.seatMatrix as Record<string, unknown>[])
      : []) as Record<string, unknown>[],
  };

  // ── DATA (shadows module-level const) ─────────────────────────────────────
  // IMPORTANT: cast the full (x || {}) expression so TypeScript infers Record<string,string>
  //            NOT (x as Record<string,string>) || {} which widens to {}
  const DATA = {
    name: (Array.isArray(_col.alsoKnownAs)
      ? String((_col.alsoKnownAs as string[])[0])
      : String(_col.alsoKnownAs ?? id.toUpperCase())),
    fullName: String(_col.name ?? ""),
    established: Number(_col.established ?? 1960),
    location: String(_col.location ?? ""),
    type: String(_col.type ?? "Government"),
    stats: {
      placementRate: String((_col.placements as Record<string, unknown>)?.overallPlacementRate ?? "N/A"),
      avgPackage: String((_col.placements as Record<string, unknown>)?.averagePackage ?? "N/A"),
      nirfRank: String(
        ((Array.isArray(_col.rankings) ? (_col.rankings as Record<string, unknown>[]) : [])
          .find((r) => String(r.body ?? "").includes("Engineering"))
          ?? (Array.isArray(_col.rankings) ? (_col.rankings as Record<string, unknown>[]) : [])[0]
          ?? { rank: "N/A" }).rank ?? "N/A"
      ),
    },
    fees: {
      // Cast the whole (x || {}) expression — this is what makes value: string not unknown
      instituteFee: (_col.fees?.instituteFee || {}) as Record<string, string>,
      hostelFee: (_col.fees?.hostelFee || {}) as Record<string, string>,
      feeWaivers: (Array.isArray(_col.fees?.feeWaivers)
        ? (_col.fees.feeWaivers as string[])
        : typeof _col.fees?.feeWaivers === "string"
        ? [String(_col.fees.feeWaivers)]
        : []) as string[],
    },
    seats: {
      totalSeatSummary: {
        overallTotal: (Array.isArray(_col.seatMatrix)
          ? (_col.seatMatrix as { seats?: number }[]).reduce((a, r) => a + Number(r.seats ?? 0), 0)
          : 0),
        branches: Array.from(
          new Set(
            (Array.isArray(_col.seatMatrix) ? (_col.seatMatrix as { branch: string }[]) : [])
              .map((r) => r.branch)
          )
        ).map((bName) => {
          const sm = (Array.isArray(_col.seatMatrix)
            ? (_col.seatMatrix as { branch: string; gender: string; seats?: number }[])
            : []);
          const gnSeats = sm.filter((r) => r.branch === bName && r.gender === "Gender-Neutral")
            .reduce((a, r) => a + Number(r.seats ?? 0), 0);
          const foSeats = sm.filter((r) => r.branch === bName && r.gender === "Female-Only")
            .reduce((a, r) => a + Number(r.seats ?? 0), 0);
          return { name: bName, genderNeutral: gnSeats, femaleOnly: foSeats };
        }),
      },
      categoryWiseData: {} as Record<string, unknown>,
    },
  };

  // ── SEAT_MATRIX_DATA (shadows module-level const) ──────────────────────────
  const SEAT_MATRIX_DATA: Record<
    string,
    { "Gender-Neutral": { name: string; seats: number; courseType: string }[];
      "Female-Only":   { name: string; seats: number; courseType: string }[] }
  > = {};
  (Array.isArray(_col.seatMatrix)
    ? (_col.seatMatrix as { branch?: unknown; gender?: unknown; seats?: unknown; category?: unknown; courseType?: unknown }[])
    : []
  ).forEach((row) => {
    const cat = String(row.category ?? "General");
    const gen = row.gender === "Gender-Neutral" ? "Gender-Neutral" : "Female-Only";
    if (!SEAT_MATRIX_DATA[cat]) {
      SEAT_MATRIX_DATA[cat] = { "Gender-Neutral": [], "Female-Only": [] };
    }
    SEAT_MATRIX_DATA[cat][gen].push({
      name: String(row.branch ?? ""),
      seats: Number(row.seats ?? 0),
      courseType: String(row.courseType ?? "4-Year B.E./B.Tech. Course"),
    });
  });

  const [activeTab, setActiveTab] = useState("Overview");
  const [logoError, setLogoError] = useState(false);
  const [buildingError, setBuildingError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Seat Matrix States
  const [seatCategory, setSeatCategory] = useState("All");
  const [seatPool, setSeatPool] = useState("All");
  const [placementYear, setPlacementYear] = useState("2024");

  // Cutoff tab state
  const [cutoffYear, setCutoffYear] = useState("2025");
  const [cutoffRound, setCutoffRound] = useState<number | string>(6);
  const [csabData, setCsabData] = useState<any[]>([]);
  const [isParsingCsab, setIsParsingCsab] = useState(false);

  const handleCsabRoundSelect = async (srRound: string) => {
    setCutoffRound(srRound);
    setCutoffQuota("All"); setCutoffCategory("All"); setCutoffGender("All"); setCutoffBranch("All"); setCutoffSearch("");
    setIsParsingCsab(true);
    
    try {
      let url = "";
      if (cutoffYear === "2024") {
        url = srRound === "SR 1" ? "/CSAB20241.html" : "/CSAB20242.html";
      } else {
        url = srRound === "SR 1" ? "/CSAB20251.html" : srRound === "SR 2" ? "/CSAB20252.html" : "/CSAB20253.html";
      }
      const res = await fetch(url);
      const html = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const table = doc.querySelector("table");
      if (!table) return;

      const rows = Array.from(table.querySelectorAll("tr"));
      const data: any[] = [];
      const headerRow = rows.find(r => r.querySelector("th") || r.querySelector("td"));
      if (!headerRow) return;
      const headers = Array.from(headerRow.children).map(th => th.textContent?.trim().toLowerCase() || "");
      const instIdx = headers.findIndex(h => h.includes("institute"));
      const progIdx = headers.findIndex(h => h.includes("academic program"));
      const quotaIdx = headers.findIndex(h => h.includes("quota"));
      const catIdx = headers.findIndex(h => h.includes("seat type"));
      const genIdx = headers.findIndex(h => h.includes("gender"));
      const opIdx = headers.findIndex(h => h.includes("opening rank"));
      const clIdx = headers.findIndex(h => h.includes("closing rank"));

      for (let i = 1; i < rows.length; i++) {
        const cells = Array.from(rows[i].children).map(td => td.textContent?.trim() || "");
        if (cells.length > Math.max(instIdx, clIdx) && cells[instIdx] && cells[instIdx] !== "Institute") {
          data.push({
            Institute: cells[instIdx] || "",
            "Academic Program Name": cells[progIdx] || "",
            Quota: cells[quotaIdx] || "",
            "Seat Type": cells[catIdx] || "",
            Gender: cells[genIdx] || "",
            "Opening Rank": cells[opIdx] || "",
            "Closing Rank": cells[clIdx] || "",
          });
        }
      }
      setCsabData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsParsingCsab(false);
    }
  };

  const [cutoffQuota, setCutoffQuota] = useState("All");
  const [cutoffCategory, setCutoffCategory] = useState("All");
  const [cutoffGender, setCutoffGender] = useState("All");
  const [cutoffBranch, setCutoffBranch] = useState("All");
  const [cutoffSearch, setCutoffSearch] = useState("");

  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const buildingRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (buildingRef.current) {
        gsap.fromTo(buildingRef.current,
          { scale: 1 },
          {
            scale: 1.15,
            transformOrigin: "bottom center",
            ease: "power2.out",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            }
          }
        );
      }
      if (headlineRef.current) {
        gsap.to(headlineRef.current, {
          yPercent: -100,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          }
        });
      }
    }, heroRef);
    return () => ctx.revert();
  }, []);

    if (!hasRichData) {
    const instName = getInstituteName(id);
    
    const activeCollege = masterColleges.find(c => c.id.toLowerCase() === id.toLowerCase()) || 
                          masterColleges.find(c => c.name.toLowerCase().includes(instName.toLowerCase())) || 
                          { id, name: instName, type: "IITs" as const };
    
    const collegeType = activeCollege.type;
    const isNit = collegeType === "NITs";
    const isIiit = collegeType === "IIITs";
    const isGfti = collegeType === "GFTIs";
    const isIit = collegeType === "IITs";

    let themeColor = "blue";
    if (isNit) themeColor = "blue";
    else if (isIiit) themeColor = "orange";
    else if (isGfti) themeColor = "green";

    const radialBg = themeColor === "orange"
      ? 'radial-gradient(circle at 50% 0%, #321400 0%, #000000 80%)'
      : themeColor === "green"
      ? 'radial-gradient(circle at 50% 0%, #003214 0%, #000000 80%)'
      : 'radial-gradient(circle at 50% 0%, #001432 0%, #000000 80%)';

    const accentText = themeColor === "orange" 
      ? 'text-orange-400' 
      : themeColor === "green" 
      ? 'text-green-400' 
      : 'text-blue-400';

    const activeTabStyle = themeColor === "orange"
      ? 'bg-orange-500/10 border-orange-500 text-orange-400'
      : themeColor === "green"
      ? 'bg-green-500/10 border-green-500 text-green-400'
      : 'bg-blue-500/10 border-blue-500 text-blue-400';

    const borderStyle = themeColor === "orange"
      ? 'border-orange-500/30'
      : themeColor === "green"
      ? 'border-green-500/30'
      : 'border-blue-500/30';

    const searchFocusStyle = themeColor === "orange"
      ? 'focus:border-orange-500'
      : themeColor === "green"
      ? 'focus:border-green-500'
      : 'focus:border-blue-500';

    const tableHoverStyle = themeColor === "orange"
      ? 'hover:bg-orange-500/10 hover:text-orange-400'
      : themeColor === "green"
      ? 'hover:bg-green-500/10 hover:text-green-400'
      : 'hover:bg-blue-500/10 hover:text-blue-400';

    const activeRanks = isNit ? nitOpenRanks : iitOpenRanks;
    const instituteCutoffs = activeRanks.filter(row => 
      row.institute.toLowerCase().includes(instName.toLowerCase()) ||
      instName.toLowerCase().includes(row.institute.toLowerCase())
    );
    
    const filteredCutoffs = searchQuery 
      ? instituteCutoffs.filter(row => row.program.toLowerCase().includes(searchQuery.toLowerCase()))
      : instituteCutoffs;

    const basicInfo = getCollegeBasicInfo(activeCollege.id, activeCollege.name, activeCollege.type);

    return (
      <main className="min-h-screen bg-[#000000] text-[#FFFFFF] font-sans selection:bg-[#3B82F6] selection:text-[#000000] overflow-hidden flex flex-col relative">
        {/* Background Deep Luminous wash */}
        <div className="fixed inset-0 z-0 pointer-events-none" style={{
          background: radialBg
        }} />

        <div className="relative z-10 w-full flex flex-col flex-1">
          <section ref={heroRef} className={`relative w-full h-[100vh] flex flex-col justify-end overflow-hidden pt-12 px-6 pb-0 border-b-[1px] ${borderStyle}`}>
            <div className="absolute top-12 left-6 z-20 w-16 h-16 md:w-24 md:h-24">
              <div className={`w-full h-full bg-[#111111] flex items-center justify-center text-[10px] text-white break-words text-center border-[1px] ${borderStyle} font-mono uppercase tracking-tighter`}>
                {id.substring(0, 4).toUpperCase()}
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none mix-blend-difference text-white">
              <h1 ref={headlineRef} className="text-[10vw] md:text-[12vw] leading-[0.75] font-black tracking-tighter uppercase whitespace-normal text-center break-words max-w-[90vw]">
                {instName}
              </h1>
            </div>

            <div className="relative w-full h-[70vh] flex justify-center items-end z-0 pointer-events-none">
              <div ref={buildingRef} className={`w-full h-full bg-[#0A0A0A] flex flex-col items-center justify-center text-center p-6 border-[1px] ${borderStyle}`}>
                <span className={`text-sm font-mono uppercase tracking-widest ${accentText} mb-2`}>CAMPUS ARCHIVE</span>
                <div className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">
                  {instName}
                </div>
              </div>
            </div>
          </section>

          <div className={`sticky top-0 z-50 bg-[#000000]/90 backdrop-blur-md border-b-[1px] ${borderStyle}`}>
            <nav className="max-w-screen-2xl mx-auto px-6 flex overflow-x-auto no-scrollbar gap-8 md:gap-16 pt-6">
              {TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setSearchQuery('');
                  }}
                  className={`text-xl md:text-3xl font-bold uppercase tracking-tighter transition-none whitespace-nowrap pb-4 border-b-[4px] px-4 ${
                    activeTab === tab 
                    ? activeTabStyle 
                    : 'border-transparent text-neutral-500 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex-1 w-full max-w-screen-2xl mx-auto px-6 py-20 min-w-0 flex flex-col">
            {activeTab === 'Overview' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-w-0 overflow-hidden break-words w-full animate-in fade-in duration-500">
                {/* Column 1 & 2: Info hub */}
                <div className="col-span-1 lg:col-span-2 flex flex-col gap-8 min-w-0">
                  {/* Hero Header Card */}
                  <div className={`border-[1px] ${borderStyle} p-8 md:p-12 bg-black flex flex-col justify-between min-w-0 overflow-hidden break-words`}>
                    <div className="mb-8">
                      <span className="text-xs font-mono uppercase tracking-widest opacity-50 block mb-4">Official Designation</span>
                      <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase leading-[0.9] text-white break-words">
                        {basicInfo.name}
                      </h2>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-auto pt-6 border-t border-neutral-900 text-neutral-400 font-mono text-xs uppercase tracking-widest">
                      <span>A.K.A: {basicInfo.alsoKnownAs}</span>
                      <span>ESTD: {basicInfo.established}</span>
                    </div>
                  </div>

                  {/* Location & Connectivity Card */}
                  <div className={`border-[1px] ${borderStyle} p-8 md:p-12 bg-black flex flex-col gap-6 min-w-0 overflow-hidden break-words`}>
                    <div className="flex items-center gap-4 border-b border-neutral-900 pb-4">
                      <div className={`w-3 h-3 bg-current shrink-0 ${accentText}`}></div>
                      <h3 className="font-mono text-xs uppercase tracking-widest opacity-60">Location & Transit</h3>
                    </div>
                    <p className="text-2xl md:text-3xl font-bold tracking-tighter uppercase break-words text-white mb-2 leading-tight">
                      {basicInfo.location}
                    </p>

                    <div className="flex flex-col gap-4 mt-4">
                      {/* Airport */}
                      <div className="flex gap-4 items-start hover:bg-[#0A0A0A] p-4 -mx-4 transition-none cursor-default group border-t border-neutral-950">
                        <div className={`w-[4px] h-[36px] bg-current shrink-0 mt-1 ${accentText}`}></div>
                        <div>
                          <p className="text-[10px] font-mono uppercase tracking-widest opacity-50 mb-1">Airport Connectivity</p>
                          <p className="text-lg md:text-xl font-bold tracking-tighter text-white break-words">{basicInfo.connectivity.airport}</p>
                        </div>
                      </div>

                      {/* Railways */}
                      {basicInfo.connectivity.railway.map((r, i) => (
                        <div key={i} className="flex gap-4 items-start hover:bg-[#0A0A0A] p-4 -mx-4 transition-none cursor-default group border-t border-neutral-950">
                          <div className="w-[4px] h-[36px] bg-neutral-800 group-hover:bg-current shrink-0 mt-1 transition-colors duration-0"></div>
                          <div>
                            <p className="text-[10px] font-mono uppercase tracking-widest opacity-50 mb-1">Nearest Station ${i + 1}</p>
                            <p className="text-lg md:text-xl font-bold tracking-tighter text-white break-words">{r}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Column 3: Campus Facilities card */}
                <div className="col-span-1 min-w-0">
                  <div className={`border-[1px] ${borderStyle} p-8 md:p-12 bg-black flex flex-col gap-6 h-full min-w-0 overflow-hidden break-words`}>
                    <div className="flex items-center gap-4 border-b border-neutral-900 pb-4">
                      <div className={`w-3 h-3 bg-current shrink-0 ${accentText}`}></div>
                      <h3 className="font-mono text-xs uppercase tracking-widest opacity-60">Campus Facilities</h3>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-4">
                      {basicInfo.campusFacilities.map((f) => (
                        <span 
                          key={f} 
                          className={`border px-4 py-2 text-xs md:text-sm font-bold uppercase tracking-widest bg-black rounded-none cursor-default transition-all duration-300 border-current ${accentText} hover:bg-white hover:text-black`}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : activeTab === 'Cutoffs' ? (
              (() => {
                const exactCollegeInfo = allIitsData.find(c => c.collegeId === id);
                const actualExactName = exactCollegeInfo ? exactCollegeInfo.basicInfo.name : instName;
                const _allCutoffs = typeof cutoffRound === "string" ? getJoSAACutoffsFromCsab(id, actualExactName, csabData) : getJoSAACutoffs(id, actualExactName, cutoffYear, cutoffRound as number);
                const _cutoffQuotas     = ["All", ...Array.from(new Set(_allCutoffs.map(r => r.quota))).sort()];
                const _cutoffCategories = ["All", ...Array.from(new Set(_allCutoffs.map(r => r.category))).sort()];
                const _cutoffGenders    = ["All", ...Array.from(new Set(_allCutoffs.map(r => r.gender))).sort()];
                const _cutoffBranches   = ["All", ...Array.from(new Set(_allCutoffs.map(r => r.branch))).sort()];
                const _filtered = _allCutoffs.filter(r => {
                  if (cutoffQuota    !== "All" && r.quota    !== cutoffQuota)    return false;
                  if (cutoffCategory !== "All" && r.category !== cutoffCategory) return false;
                  if (cutoffGender   !== "All" && r.gender   !== cutoffGender)   return false;
                  if (cutoffBranch   !== "All" && r.branch   !== cutoffBranch)   return false;
                  if (cutoffSearch.trim() && !r.branch.toLowerCase().includes(cutoffSearch.toLowerCase())) return false;
                  return true;
                });
                const _availRounds = Object.keys(JOSAA_ROUND_DATA[cutoffYear] || {}).map(Number).sort((a,b)=>a-b);
                return (
                  <div className="flex flex-col gap-6 min-w-0 animate-in fade-in duration-500">
                    {/* Year + Round */}
                    <div className="flex flex-wrap gap-6 items-end">
                      <div className="flex flex-col gap-2">
                        <span className={`text-xs font-mono uppercase tracking-widest ${accentText}`}>Year</span>
                        <div className="flex gap-2">
                          {["2025","2024"].map(y => (
                            <button key={y} onClick={() => { setCutoffYear(y); setCutoffRound(y==="2025"?6:5); setCutoffQuota("All"); setCutoffCategory("All"); setCutoffGender("All"); setCutoffBranch("All"); setCutoffSearch(""); }}
                              className={`px-5 py-2 text-lg font-black tracking-tighter uppercase border-[1px] transition-none ${cutoffYear===y ? activeTabStyle : `${borderStyle} text-neutral-500 hover:text-white`}`}>
                              {y}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className={`text-xs font-mono uppercase tracking-widest ${accentText}`}>Round</span>
                        <div className="text-[9px] opacity-60 mb-1 leading-tight font-mono">* R: JoSAA Round | SR: CSAB Special Round</div>
                        <div className="flex gap-2 flex-wrap">
                          {_availRounds.map(r => (
                            <button key={r} onClick={() => { setCutoffRound(r); setCutoffQuota("All"); setCutoffCategory("All"); setCutoffGender("All"); setCutoffBranch("All"); setCutoffSearch(""); }}
                              className={`px-4 py-2 text-lg font-black tracking-tighter uppercase border-[1px] transition-none ${cutoffRound===r ? activeTabStyle : `${borderStyle} text-neutral-500 hover:text-white`}`}>
                              R {r}
                            </button>
                          ))}
                          {["2025", "2024"].includes(cutoffYear) && !(id.includes("iit") && !id.includes("iiit")) && (
                            <>
                              {(cutoffYear === "2025" ? ["SR 1", "SR 2", "SR 3"] : ["SR 1", "SR 2"]).map(sr => (
                                <button key={sr} onClick={() => handleCsabRoundSelect(sr)}
                                  className={`px-4 py-2 text-lg font-black tracking-tighter uppercase border-[1px] transition-none ${cutoffRound===sr ? activeTabStyle : `${borderStyle} text-neutral-500 hover:text-white`}`}>
                                  {sr}
                                </button>
                              ))}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="ml-auto flex gap-8 items-end">
                        <div><div className="text-xs font-mono uppercase tracking-widest opacity-40">Total</div><div className={`text-4xl font-black tracking-tighter`}>{_allCutoffs.length}</div></div>
                        <div><div className="text-xs font-mono uppercase tracking-widest opacity-40">Shown</div><div className={`text-4xl font-black tracking-tighter ${accentText}`}>{_filtered.length}</div></div>
                      </div>
                    </div>

                    {/* Filters */}
                    <div className={`border-[1px] ${borderStyle} p-6 bg-[#0A0A0A] flex flex-col gap-4`}>
                      <input value={cutoffSearch} onChange={e => setCutoffSearch(e.target.value)}
                        placeholder="Search branch / program name…"
                        className={`w-full text-lg font-bold border-b-[1px] ${borderStyle} bg-transparent text-white outline-none pb-2 placeholder:opacity-25 ${searchFocusStyle}`} />
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          {label:"Quota",    opts:_cutoffQuotas,     val:cutoffQuota,    fn:setCutoffQuota},
                          {label:"Category", opts:_cutoffCategories, val:cutoffCategory, fn:setCutoffCategory},
                          {label:"Gender",   opts:_cutoffGenders,    val:cutoffGender,   fn:setCutoffGender},
                          {label:"Branch",   opts:_cutoffBranches,   val:cutoffBranch,   fn:setCutoffBranch},
                        ].map(({label,opts,val,fn}) => (
                          <div key={label} className="flex flex-col gap-1">
                            <label className={`text-xs font-mono uppercase tracking-widest opacity-50`}>{label}</label>
                            <select value={val} onChange={e => fn(e.target.value)}
                              className={`text-sm font-bold uppercase border-b-[1px] ${borderStyle} bg-[#0A0A0A] text-white outline-none pb-1 cursor-pointer appearance-none rounded-none ${searchFocusStyle}`}>
                              {opts.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                          </div>
                        ))}
                      </div>
                      {(cutoffQuota!=="All"||cutoffCategory!=="All"||cutoffGender!=="All"||cutoffBranch!=="All"||cutoffSearch) && (
                        <button onClick={() => { setCutoffQuota("All"); setCutoffCategory("All"); setCutoffGender("All"); setCutoffBranch("All"); setCutoffSearch(""); }}
                          className={`self-start px-4 py-1 border-[1px] ${borderStyle} text-xs font-mono uppercase tracking-widest ${accentText} ${tableHoverStyle} transition-none`}>
                          Clear Filters
                        </button>
                      )}
                    </div>

                    {/* Table */}
                    {isParsingCsab ? (
                      <div className={`border-[1px] ${borderStyle} p-20 text-center bg-[#0A0A0A]`}>
                        <p className={`text-4xl font-black uppercase tracking-tighter animate-pulse ${accentText}`}>Loading CSAB Data...</p>
                        <p className="text-sm font-mono uppercase tracking-widest opacity-40 mt-4">Parsing local HTML files</p>
                      </div>
                    ) : !_allCutoffs.length ? (
                      <div className={`border-[1px] ${borderStyle} p-20 text-center bg-[#0A0A0A]`}>
                        <p className="text-4xl font-black uppercase tracking-tighter opacity-25">No Data Available</p>
                        <p className="text-sm font-mono uppercase tracking-widest opacity-20 mt-4">{cutoffYear} · Round {cutoffRound}</p>
                      </div>
                    ) : !_filtered.length ? (
                      <div className={`border-[1px] ${borderStyle} p-20 text-center bg-[#0A0A0A]`}>
                        <p className="text-3xl font-black uppercase tracking-tighter">No Results Match Filters</p>
                        <button onClick={() => { setCutoffQuota("All"); setCutoffCategory("All"); setCutoffGender("All"); setCutoffBranch("All"); setCutoffSearch(""); }}
                          className={`mt-6 px-6 py-2 border-[1px] ${borderStyle} text-sm font-black uppercase tracking-widest ${accentText} ${tableHoverStyle} transition-none`}>
                          Clear Filters
                        </button>
                      </div>
                    ) : (
                      <div className={`w-full overflow-x-auto no-scrollbar border-[1px] ${borderStyle}`}>
                        <table className="w-full text-left border-collapse" style={{minWidth:860}}>
                          <thead>
                            <tr className="bg-[#1E293B]">
                              {["#","Branch / Program","Quota","Category","Gender","Opening","Closing"].map((h,i) => (
                                <th key={h} className={`p-4 text-xs font-mono uppercase tracking-widest ${i<6?"border-r-[1px] border-[#0A0A0A]":""} ${i>=5?"text-right":""}`}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {_filtered.map((r, i) => (
                              <tr key={i} className={`border-b-[1px] ${borderStyle} ${tableHoverStyle} transition-none cursor-default`}>
                                <td className={`p-4 text-xs font-mono opacity-30 border-r-[1px] ${borderStyle}`}>{String(i+1).padStart(3,"0")}</td>
                                <td className={`p-4 text-sm font-bold uppercase tracking-tight border-r-[1px] ${borderStyle} break-words`} style={{maxWidth:260}}>{r.branch}</td>
                                <td className={`p-4 text-sm font-bold uppercase border-r-[1px] ${borderStyle} whitespace-nowrap`}>{r.quota}</td>
                                <td className={`p-4 text-sm font-bold uppercase border-r-[1px] ${borderStyle} whitespace-nowrap`}>{r.category}</td>
                                <td className={`p-4 text-xs font-bold uppercase border-r-[1px] ${borderStyle} whitespace-nowrap`}>{r.gender}</td>
                                <td className={`p-4 text-xl font-black tracking-tighter text-right border-r-[1px] ${borderStyle} whitespace-nowrap opacity-50`}>{r.openingRank.toLocaleString("en-IN")}</td>
                                <td className={`p-4 text-2xl font-black tracking-tighter text-right whitespace-nowrap ${accentText}`}>{r.closingRank.toLocaleString("en-IN")}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    <p className="text-xs font-mono uppercase tracking-widest opacity-25 text-center">
                      JoSAA {cutoffYear} Official Data · Round {cutoffRound} · {_filtered.length} of {_allCutoffs.length} rows
                    </p>
                  </div>
                );
              })()
            ) : (
              <div className={`flex-1 flex flex-col items-center justify-center border-[1px] ${borderStyle} animate-in fade-in duration-500 min-h-[40vh] min-w-0 overflow-hidden bg-[#0A0A0A] p-12 text-center`}>
                <span className={`text-sm font-mono uppercase tracking-widest ${accentText} mb-4`}>JoSAA Portal 2026</span>
                <p className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-neutral-600 break-words whitespace-normal mb-4">
                  {activeTab} Data Pending
                </p>
                <p className="text-neutral-500 font-mono text-sm max-w-md mx-auto leading-relaxed">
                  Our verification and data engineering teams are currently validating and structuring the official JoSAA datasets for this section. Please check back shortly.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }


  return (
    <main className="min-h-screen bg-[#000000] text-[#FFFFFF] font-sans selection:bg-[#3B82F6] selection:text-[#000000] overflow-hidden flex flex-col relative">
      
      {/* Background Deep Luminous Washes */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{
        background: 'radial-gradient(circle at 50% 0%, #001432 0%, #000000 80%)'
      }} />

      <div className="relative z-10 w-full flex flex-col flex-1">
        {/* Cinematic Brutalist Hero */}
        <section ref={heroRef} className="relative w-full h-[100vh] flex flex-col justify-end overflow-hidden pt-12 px-6 pb-0 border-b-[1px] border-[#1E293B]">
          
          <div className="absolute top-12 left-6 z-20 w-16 h-16 md:w-24 md:h-24">
            {/* Make sure your iitb-logo.png file is placed directly inside the public folder */}
            {!logoError ? (
              <img 
                src="/iitb-logo.png" 
                alt="Logo" 
                className="w-full h-full object-contain grayscale"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="w-full h-full bg-[#111111] flex items-center justify-center text-[10px] text-white break-words text-center border-[1px] border-[#1E293B]">No Logo</div>
            )}
          </div>

          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none mix-blend-difference text-white">
            <h1 ref={headlineRef} className="text-[18vw] leading-[0.75] font-black tracking-tighter uppercase whitespace-nowrap text-center">
              {DATA.name}
            </h1>
          </div>

          <div className="relative w-full h-[70vh] flex justify-center items-end z-0 pointer-events-none">
            {/* Make sure your iit-bombay-building.png file is placed directly inside the public folder */}
            {!buildingError ? (
              <img 
                ref={buildingRef}
                src="/iit-bombay-building.png"
                alt="Building"
                className="w-full max-w-screen-2xl h-full object-cover object-bottom"
                onError={() => setBuildingError(true)}
              />
            ) : (
              <div ref={buildingRef} className="w-full h-full bg-[#0A0A0A] flex items-center justify-center text-2xl uppercase tracking-widest text-white border-[1px] border-[#1E293B]">
                Image Not Found
              </div>
            )}
          </div>
        </section>

        {/* Sticky Sub-Nav */}
        <div className="sticky top-0 z-50 bg-[#000000]/90 backdrop-blur-md border-b-[1px] border-[#1E293B]">
          <nav className="max-w-screen-2xl mx-auto px-6 flex overflow-x-auto no-scrollbar gap-8 md:gap-16 pt-6">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xl md:text-3xl font-bold uppercase tracking-tighter transition-none whitespace-nowrap pb-4 border-b-[4px] ${
                  activeTab === tab 
                  ? "border-[#3B82F6] text-[#3B82F6]" 
                  : "border-transparent text-neutral-500 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Page Content */}
        <div className="flex-1 w-full max-w-screen-2xl mx-auto px-6 py-20 min-w-0 flex flex-col">
          {activeTab === "Overview" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-w-0 animate-in fade-in duration-500">
              <div className="border-[1px] border-[#1E293B] p-8 md:p-12 col-span-1 md:col-span-2 min-w-0 overflow-hidden break-words flex flex-col justify-between hover:bg-[#1E293B] hover:text-[#FFFFFF] transition-none cursor-default">
                <span className="text-sm font-mono uppercase tracking-widest mb-8 opacity-60">Full Name</span>
                <p className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] break-words">{COLLEGE_DATA.basicInfo.name}</p>
              </div>
              <div className="border-[1px] border-[#1E293B] p-8 md:p-12 min-w-0 overflow-hidden break-words flex flex-col justify-between hover:bg-[#1E293B] hover:text-[#FFFFFF] transition-none cursor-default">
                <span className="text-sm font-mono uppercase tracking-widest mb-8 opacity-60">Type / Est.</span>
                <p className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-[0.9] break-words">{COLLEGE_DATA.basicInfo.type}</p>
                <p className="text-6xl font-black tracking-tighter text-[#3B82F6] mt-4">{COLLEGE_DATA.basicInfo.established}</p>
              </div>
              <div className="border-[1px] border-[#1E293B] p-8 md:p-12 col-span-1 md:col-span-2 min-w-0 overflow-hidden break-words flex flex-col gap-4 hover:bg-[#1E293B] hover:text-[#FFFFFF] transition-none cursor-default">
                <span className="text-sm font-mono uppercase tracking-widest opacity-60">Location</span>
                <p className="text-3xl md:text-4xl font-black tracking-tighter uppercase break-words">{COLLEGE_DATA.basicInfo.location}</p>
              </div>
              <div className="border-[1px] border-[#1E293B] p-8 md:p-12 min-w-0 overflow-hidden break-words flex flex-col gap-4">
                <span className="text-sm font-mono uppercase tracking-widest opacity-60">Campus Facilities</span>
                <div className="flex flex-wrap gap-3 mt-2">
                  {COLLEGE_DATA.basicInfo.campusFacilities.map((f) => (
                    <span key={f} className="border-[1px] border-[#1E293B] px-4 py-2 text-sm font-bold uppercase tracking-widest hover:bg-[#3B82F6] hover:text-black transition-none cursor-default">{f}</span>
                  ))}
                </div>
              </div>
              <div className="border-[1px] border-[#1E293B] p-8 md:p-12 col-span-1 md:col-span-3 min-w-0 overflow-hidden break-words flex flex-col gap-6">
                <span className="text-sm font-mono uppercase tracking-widest opacity-60">Connectivity</span>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4 items-start hover:bg-[#1E293B] p-4 -mx-4 transition-none cursor-default">
                    <div className="w-[4px] h-[36px] bg-[#3B82F6] shrink-0 mt-1"></div>
                    <div><p className="text-xs font-mono uppercase tracking-widest opacity-50 mb-1">Airport</p><p className="text-xl md:text-2xl font-bold tracking-tighter">{COLLEGE_DATA.basicInfo.connectivity.airport}</p></div>
                  </div>
                  {COLLEGE_DATA.basicInfo.connectivity.railway.map((r, i) => (
                    <div key={i} className="flex gap-4 items-start hover:bg-[#1E293B] p-4 -mx-4 transition-none cursor-default">
                      <div className="w-[4px] h-[36px] bg-[#1E293B] shrink-0 mt-1"></div>
                      <div><p className="text-xs font-mono uppercase tracking-widest opacity-50 mb-1">Railway {i + 1}</p><p className="text-xl md:text-2xl font-bold tracking-tighter">{r}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : activeTab === "Rankings" ? (
            <div className="flex flex-col gap-12 min-w-0 animate-in fade-in duration-500">
              {(["national", "international"] as const).map((type) => (
                <div key={type} className="border-[1px] border-[#1E293B] flex flex-col bg-[#0A0A0A]">
                  <div className="p-8 md:p-12 border-b-[1px] border-[#1E293B] bg-[#111111] flex justify-between items-center">
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">{type} Rankings</h2>
                    <span className="text-[#3B82F6] font-mono text-sm uppercase tracking-widest">{COLLEGE_DATA.rankings[type].length} bodies</span>
                  </div>
                  <div className="w-full overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="bg-[#1E293B]">
                          <th className="p-6 text-sm font-mono uppercase tracking-widest border-r-[1px] border-[#0A0A0A] w-1/2">Ranking Body</th>
                          <th className="p-6 text-sm font-mono uppercase tracking-widest border-r-[1px] border-[#0A0A0A]">Current Rank</th>
                          <th className="p-6 text-sm font-mono uppercase tracking-widest opacity-50">Previous</th>
                        </tr>
                      </thead>
                      <tbody>
                        {COLLEGE_DATA.rankings[type].map((r, i) => (
                          <tr key={i} className="border-b-[1px] border-[#1E293B] hover:bg-[#3B82F6] hover:text-black transition-none cursor-default">
                            <td className="p-6 text-xl md:text-2xl font-bold tracking-tighter border-r-[1px] border-[#1E293B] break-words">{r.body}</td>
                            <td className="p-6 text-3xl font-black tracking-tighter border-r-[1px] border-[#1E293B] text-[#3B82F6] group-hover:text-black">{r.rank}</td>
                            <td className="p-6 text-xl font-bold tracking-tighter opacity-40">{r.previous}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          ) : activeTab === "Admission" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0 animate-in fade-in duration-500 items-start">
              <div className="border-[1px] border-[#1E293B] flex flex-col bg-[#0A0A0A]">
                <div className="p-8 md:p-12 border-b-[1px] border-[#1E293B] bg-[#111111]">
                  <h2 className="font-mono text-sm uppercase tracking-widest text-[#3B82F6]">Admission Process</h2>
                </div>
                <div className="flex flex-col p-8 md:p-12 gap-8">
                  {COLLEGE_DATA.admissionProcess.map((step, i) => (
                    <div key={i} className="flex gap-6 items-start hover:bg-[#1E293B] p-4 -mx-4 transition-none cursor-default group">
                      <span className="text-5xl font-black tracking-tighter text-[#3B82F6] opacity-30 group-hover:opacity-100 shrink-0 w-12">0{i+1}</span>
                      <p className="text-xl md:text-2xl font-bold tracking-tighter leading-snug break-words">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-6">
                {Object.entries(COLLEGE_DATA.coursesOffered).map(([degree, courses]) => (
                  <div key={degree} className="border-[1px] border-[#1E293B] flex flex-col bg-[#0A0A0A]">
                    <div className="p-6 border-b-[1px] border-[#1E293B] bg-[#111111]">
                      <h3 className="font-mono text-sm uppercase tracking-widest text-[#3B82F6]">{degree}</h3>
                    </div>
                    <div className="flex flex-col">
                      {(courses as readonly string[]).map((c, i) => (
                        <div key={i} className="px-8 py-5 border-b-[1px] border-[#1E293B] last:border-b-0 text-xl font-bold uppercase tracking-tighter hover:bg-[#3B82F6] hover:text-black transition-none cursor-default">{c}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === "Cutoffs" ? (
            (() => {
              const _allCutoffs = typeof cutoffRound === "string" ? getJoSAACutoffsFromCsab(id, COLLEGE_DATA.basicInfo?.name || "", csabData) : getJoSAACutoffs(id, COLLEGE_DATA.basicInfo?.name || "", cutoffYear, cutoffRound as number);
              const _cutoffQuotas     = ["All", ...Array.from(new Set(_allCutoffs.map(r => r.quota))).sort()];
              const _cutoffCategories = ["All", ...Array.from(new Set(_allCutoffs.map(r => r.category))).sort()];
              const _cutoffGenders    = ["All", ...Array.from(new Set(_allCutoffs.map(r => r.gender))).sort()];
              const _cutoffBranches   = ["All", ...Array.from(new Set(_allCutoffs.map(r => r.branch))).sort()];
              const _filtered = _allCutoffs.filter(r => {
                if (cutoffQuota    !== "All" && r.quota    !== cutoffQuota)    return false;
                if (cutoffCategory !== "All" && r.category !== cutoffCategory) return false;
                if (cutoffGender   !== "All" && r.gender   !== cutoffGender)   return false;
                if (cutoffBranch   !== "All" && r.branch   !== cutoffBranch)   return false;
                if (cutoffSearch.trim() && !r.branch.toLowerCase().includes(cutoffSearch.toLowerCase())) return false;
                return true;
              });
              const _availRounds = Object.keys(JOSAA_ROUND_DATA[cutoffYear] || {}).map(Number).sort((a,b)=>a-b);
              return (
                <div className="flex flex-col gap-6 min-w-0 animate-in fade-in duration-500">
                  {/* Year + Round */}
                  <div className="flex flex-wrap gap-6 items-end">
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-mono uppercase tracking-widest opacity-40">Year</span>
                      <div className="flex gap-2">
                        {["2025","2024"].map(y => (
                          <button key={y} onClick={() => { setCutoffYear(y); setCutoffRound(y==="2025"?6:5); setCutoffQuota("All"); setCutoffCategory("All"); setCutoffGender("All"); setCutoffBranch("All"); setCutoffSearch(""); }}
                            className={`px-5 py-2 text-lg font-black tracking-tighter uppercase border-[2px] transition-none ${cutoffYear===y?"bg-[#3B82F6] text-black border-[#3B82F6]":"border-[#1E293B] text-neutral-400 hover:text-white hover:border-white"}`}>
                            {y}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-mono uppercase tracking-widest opacity-40">Round</span>
                      <div className="text-[9px] opacity-60 mb-1 leading-tight font-mono">* R: JoSAA Round | SR: CSAB Special Round</div>
                      <div className="flex gap-2 flex-wrap">
                        {_availRounds.map(r => (
                          <button key={r} onClick={() => { setCutoffRound(r); setCutoffQuota("All"); setCutoffCategory("All"); setCutoffGender("All"); setCutoffBranch("All"); setCutoffSearch(""); }}
                            className={`px-4 py-2 text-lg font-black tracking-tighter uppercase border-[2px] transition-none ${cutoffRound===r?"bg-[#3B82F6] text-black border-[#3B82F6]":"border-[#1E293B] text-neutral-400 hover:text-white hover:border-white"}`}>
                            R {r}
                          </button>
                        ))}
                        {["2025", "2024"].includes(cutoffYear) && !(id.includes("iit") && !id.includes("iiit")) && (
                          <>
                            {(cutoffYear === "2025" ? ["SR 1", "SR 2", "SR 3"] : ["SR 1", "SR 2"]).map(sr => (
                              <button key={sr} onClick={() => handleCsabRoundSelect(sr)}
                                className={`px-4 py-2 text-lg font-black tracking-tighter uppercase border-[2px] transition-none ${cutoffRound===sr?"bg-[#3B82F6] text-black border-[#3B82F6]":"border-[#1E293B] text-neutral-400 hover:text-white hover:border-white"}`}>
                                {sr}
                              </button>
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="ml-auto flex gap-8 items-end">
                      <div><div className="text-xs font-mono uppercase tracking-widest opacity-40">Total</div><div className="text-4xl font-black tracking-tighter">{_allCutoffs.length}</div></div>
                      <div><div className="text-xs font-mono uppercase tracking-widest opacity-40">Shown</div><div className="text-4xl font-black tracking-tighter text-[#3B82F6]">{_filtered.length}</div></div>
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="border-[1px] border-[#1E293B] p-6 bg-[#0A0A0A] flex flex-col gap-4">
                    <input value={cutoffSearch} onChange={e => setCutoffSearch(e.target.value)}
                      placeholder="Search branch / program name…"
                      className="w-full text-lg font-bold border-b-[2px] border-[#1E293B] bg-transparent text-white outline-none pb-2 placeholder:opacity-25 focus:border-[#3B82F6]" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        {label:"Quota",    opts:_cutoffQuotas,     val:cutoffQuota,    fn:setCutoffQuota},
                        {label:"Category", opts:_cutoffCategories, val:cutoffCategory, fn:setCutoffCategory},
                        {label:"Gender",   opts:_cutoffGenders,    val:cutoffGender,   fn:setCutoffGender},
                        {label:"Branch",   opts:_cutoffBranches,   val:cutoffBranch,   fn:setCutoffBranch},
                      ].map(({label,opts,val,fn}) => (
                        <div key={label} className="flex flex-col gap-1">
                          <label className="text-xs font-mono uppercase tracking-widest opacity-40">{label}</label>
                          <select value={val} onChange={e => fn(e.target.value)}
                            className="text-sm font-bold uppercase border-b-[2px] border-[#1E293B] bg-[#0A0A0A] text-white outline-none pb-1 cursor-pointer appearance-none rounded-none focus:border-[#3B82F6]">
                            {opts.map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      ))}
                    </div>
                    {(cutoffQuota!=="All"||cutoffCategory!=="All"||cutoffGender!=="All"||cutoffBranch!=="All"||cutoffSearch) && (
                      <button onClick={() => { setCutoffQuota("All"); setCutoffCategory("All"); setCutoffGender("All"); setCutoffBranch("All"); setCutoffSearch(""); }}
                        className="self-start px-4 py-1 border-[1px] border-[#3B82F6] text-xs font-mono uppercase tracking-widest text-[#3B82F6] hover:bg-[#3B82F6] hover:text-black transition-none">
                        Clear Filters
                      </button>
                    )}
                  </div>

                  {/* Table */}
                  {!_allCutoffs.length ? (
                    <div className="border-[1px] border-[#1E293B] p-20 text-center bg-[#0A0A0A]">
                      <p className="text-4xl font-black uppercase tracking-tighter opacity-25">No JoSAA Data Available</p>
                      <p className="text-sm font-mono uppercase tracking-widest opacity-20 mt-4">{cutoffYear} · Round {cutoffRound}</p>
                    </div>
                  ) : !_filtered.length ? (
                    <div className="border-[1px] border-[#1E293B] p-20 text-center bg-[#0A0A0A]">
                      <p className="text-3xl font-black uppercase tracking-tighter">No Results Match Filters</p>
                      <button onClick={() => { setCutoffQuota("All"); setCutoffCategory("All"); setCutoffGender("All"); setCutoffBranch("All"); setCutoffSearch(""); }}
                        className="mt-6 px-6 py-2 border-[2px] border-[#3B82F6] text-sm font-black uppercase tracking-widest text-[#3B82F6] hover:bg-[#3B82F6] hover:text-black transition-none">
                        Clear Filters
                      </button>
                    </div>
                  ) : (
                    <div className="w-full overflow-x-auto no-scrollbar border-[1px] border-[#1E293B]">
                      <table className="w-full text-left border-collapse" style={{minWidth:860}}>
                        <thead>
                          <tr className="bg-[#1E293B]">
                            {["#","Branch / Program","Quota","Category","Gender","Opening","Closing"].map((h,i) => (
                              <th key={h} className={`p-4 text-xs font-mono uppercase tracking-widest ${i<6?"border-r-[1px] border-[#0A0A0A]":""} ${i>=5?"text-right":""}`}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {_filtered.map((r, i) => (
                            <tr key={i} className="border-b-[1px] border-[#1E293B] hover:bg-[#3B82F6] hover:text-black transition-none cursor-default">
                              <td className="p-4 text-xs font-mono opacity-30 border-r-[1px] border-[#1E293B]">{String(i+1).padStart(3,"0")}</td>
                              <td className="p-4 text-sm font-bold uppercase tracking-tight border-r-[1px] border-[#1E293B] break-words" style={{maxWidth:260}}>{r.branch}</td>
                              <td className="p-4 text-sm font-bold uppercase border-r-[1px] border-[#1E293B] whitespace-nowrap">{r.quota}</td>
                              <td className="p-4 text-sm font-bold uppercase border-r-[1px] border-[#1E293B] whitespace-nowrap">{r.category}</td>
                              <td className="p-4 text-xs font-bold uppercase border-r-[1px] border-[#1E293B] whitespace-nowrap">{r.gender}</td>
                              <td className="p-4 text-xl font-black tracking-tighter text-right border-r-[1px] border-[#1E293B] whitespace-nowrap opacity-50">{r.openingRank.toLocaleString("en-IN")}</td>
                              <td className="p-4 text-2xl font-black tracking-tighter text-right whitespace-nowrap text-[#3B82F6]">{r.closingRank.toLocaleString("en-IN")}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  <p className="text-xs font-mono uppercase tracking-widest opacity-25 text-center">
                    JoSAA {cutoffYear} Official Data · Round {cutoffRound} · {_filtered.length} of {_allCutoffs.length} rows
                  </p>
                </div>
              );
            })()
          ) : activeTab === "Placements" ? (
            <div className="flex flex-col gap-8 min-w-0 animate-in fade-in duration-500">
              <div className="flex flex-wrap gap-3">
                {PLACEMENT_YEARS.map((yr) => (
                  <button key={yr} onClick={() => setPlacementYear(yr)} className={`px-6 py-3 text-xl font-black tracking-tighter uppercase border-[1px] transition-none ${placementYear === yr ? "bg-[#3B82F6] text-black border-[#3B82F6]" : "border-[#1E293B] text-neutral-500 hover:text-white hover:border-white"}`}>{yr}</button>
                ))}
              </div>
              {(() => {
                const pd = COLLEGE_DATA.placements[placementYear as keyof typeof COLLEGE_DATA.placements];
                if (!pd) return null;
                return (
                  <div className="border-[1px] border-[#1E293B] bg-[#0A0A0A] flex flex-col">
                    <div className="p-8 md:p-12 border-b-[1px] border-[#1E293B] bg-[#111111] flex flex-wrap gap-8 items-end">
                      <div>
                        <p className="font-mono text-xs uppercase tracking-widest opacity-50 mb-2">Average Package</p>
                        <p className="text-5xl md:text-7xl font-black tracking-tighter text-[#3B82F6]">{pd.averagePackage}</p>
                      </div>
                      {pd.medianPackage !== "N/A" && (
                        <div>
                          <p className="font-mono text-xs uppercase tracking-widest opacity-50 mb-2">Median Package</p>
                          <p className="text-3xl md:text-5xl font-black tracking-tighter">{pd.medianPackage}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      {(pd.highlights as { branch: string; rate: string }[]).map((h, i) => (
                        <div key={i} className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 border-b-[1px] border-[#1E293B] last:border-b-0 hover:bg-[#3B82F6] hover:text-black transition-none cursor-default">
                          <span className="font-bold text-xl md:text-2xl uppercase tracking-tighter mb-2 md:mb-0 break-words">{h.branch}</span>
                          <span className="font-black text-3xl md:text-4xl tracking-tighter whitespace-nowrap">{h.rate}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : activeTab === "Fees" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0 animate-in fade-in duration-500 items-start">
              {/* Fees Content (Dark Luminous PMA layout) */}
              <div className="border-[1px] border-[#1E293B] flex flex-col min-w-0 overflow-hidden break-words bg-[#0A0A0A]">
                <div className="p-8 md:p-12 border-b-[1px] border-[#1E293B]">
                  <h2 className="font-mono text-sm uppercase tracking-widest opacity-60 mb-0">01 / Institute Fee</h2>
                </div>
                <div className="flex flex-col flex-1">
                  {Object.entries(DATA.fees.instituteFee).filter(([k]) => k !== 'total').map(([key, value]) => (
                    <div key={key} className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 border-b-[1px] border-[#1E293B] hover:bg-[#3B82F6] hover:text-[#000000] transition-none group cursor-default">
                      <span className="font-bold text-xl md:text-2xl tracking-tighter uppercase mr-4 mb-2 md:mb-0 whitespace-normal break-words">{key.replace(/_/g, ' - ').replace(/([a-z])([A-Z])/g, '$1 $2')}</span>
                      <span className="font-black text-2xl md:text-3xl tracking-tighter whitespace-nowrap">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="p-8 md:p-12 group hover:bg-[#3B82F6] hover:text-[#000000] transition-none cursor-default bg-[#111111]">
                  <span className="font-mono text-xs uppercase tracking-widest opacity-60 mb-4 block">Total</span>
                  <p className="text-6xl md:text-[5vw] font-black tracking-tighter leading-none whitespace-normal break-words">{DATA.fees.instituteFee.total}</p>
                </div>
              </div>

              <div className="border-[1px] border-[#1E293B] flex flex-col min-w-0 overflow-hidden break-words bg-[#0A0A0A]">
                <div className="p-8 md:p-12 border-b-[1px] border-[#1E293B]">
                  <h2 className="font-mono text-sm uppercase tracking-widest opacity-60 mb-0">02 / Hostel Fee</h2>
                </div>
                <div className="flex flex-col flex-1">
                  {Object.entries(DATA.fees.hostelFee).filter(([k]) => k !== 'total').map(([key, value]) => (
                    <div key={key} className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 border-b-[1px] border-[#1E293B] hover:bg-[#3B82F6] hover:text-[#000000] transition-none group cursor-default">
                      <span className="font-bold text-xl md:text-2xl tracking-tighter uppercase mr-4 mb-2 md:mb-0 whitespace-normal break-words">{key.replace(/_/g, ' - ').replace(/([a-z])([A-Z])/g, '$1 $2')}</span>
                      <span className="font-black text-2xl md:text-3xl tracking-tighter whitespace-nowrap">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="p-8 md:p-12 group hover:bg-[#3B82F6] hover:text-[#000000] transition-none cursor-default bg-[#111111]">
                  <span className="font-mono text-xs uppercase tracking-widest opacity-60 mb-4 block">Total</span>
                  <p className="text-6xl md:text-[5vw] font-black tracking-tighter leading-none whitespace-normal break-words">{DATA.fees.hostelFee.total}</p>
                </div>
              </div>

              <div className="border-[1px] border-[#1E293B] bg-[#1E293B] text-[#FFFFFF] flex flex-col min-w-0 overflow-hidden break-words">
                <div className="p-8 md:p-12 border-b-[1px] border-black">
                  <h2 className="font-mono text-sm uppercase tracking-widest text-[#3B82F6] mb-0">03 / Eligibility & Waivers</h2>
                </div>
                <div className="flex flex-col p-8 md:p-12 gap-8 flex-1">
                  {DATA.fees.feeWaivers.map((waiver, idx) => (
                    <div key={idx} className="flex gap-6 group hover:text-[#3B82F6] transition-none cursor-default items-start">
                      <div className="w-[4px] h-[40px] bg-[#3B82F6] shrink-0 mt-2"></div>
                      <p className="text-2xl md:text-4xl font-bold tracking-tighter leading-[1.1] whitespace-normal break-words">
                        {waiver}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : activeTab === "Seats" ? (
            <div className="flex flex-col gap-12 min-w-0 animate-in fade-in duration-500">
              
              {/* Filter Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-4">
                  <label className="text-sm font-mono uppercase tracking-widest text-neutral-400">01 / Category Filter</label>
                  <select 
                    value={seatCategory}
                    onChange={(e) => setSeatCategory(e.target.value)}
                    className="bg-black text-[#3B82F6] border-[1px] border-[#1E293B] p-6 text-2xl font-bold uppercase tracking-widest outline-none focus:border-[#3B82F6] cursor-pointer appearance-none transition-colors duration-0"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                
                <div className="flex flex-col gap-4">
                  <label className="text-sm font-mono uppercase tracking-widest text-neutral-400">02 / Seat Pool</label>
                  <select 
                    value={seatPool}
                    onChange={(e) => setSeatPool(e.target.value)}
                    className="bg-black text-[#3B82F6] border-[1px] border-[#1E293B] p-6 text-2xl font-bold uppercase tracking-widest outline-none focus:border-[#3B82F6] cursor-pointer appearance-none transition-colors duration-0"
                  >
                    {POOLS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              {/* Data Matrix */}
              <div className="border-[1px] border-[#1E293B] flex flex-col min-w-0 bg-[#0A0A0A]">
                {(() => {
                  // All + All => show aggregate overview
                  if (seatCategory === "All" && seatPool === "All") {
                    return (
                      <>
                        <div className="p-12 border-b-[1px] border-[#1E293B] flex flex-wrap justify-between items-center gap-6 bg-[#111111]">
                          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Aggregate Matrix</h2>
                          <p className="text-6xl md:text-[5vw] font-black tracking-tighter text-[#3B82F6] leading-none">{DATA.seats.totalSeatSummary.overallTotal}</p>
                        </div>
                        {/* Category summary bars */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 border-b-[1px] border-[#1E293B]">
                          {CATEGORIES.filter(c => c !== "All").map((cat) => {
                            const gnTotal = SEAT_MATRIX_DATA[cat]?.["Gender-Neutral"]?.reduce((s, r) => s + r.seats, 0) ?? 0;
                            const foTotal = SEAT_MATRIX_DATA[cat]?.["Female-Only"]?.reduce((s, r) => s + r.seats, 0) ?? 0;
                            const total = gnTotal + foTotal;
                            return (
                              <div key={cat} onClick={() => setSeatCategory(cat)} className="p-6 border-r-[1px] border-b-[1px] border-[#1E293B] hover:bg-[#3B82F6] hover:text-black transition-none cursor-pointer group">
                                <p className="font-mono text-xs uppercase tracking-widest opacity-60 mb-3 group-hover:opacity-100">{cat}</p>
                                <p className="text-4xl font-black tracking-tighter">{total}</p>
                                <div className="flex gap-3 mt-2 text-sm font-bold opacity-70">
                                  <span>GN: {gnTotal}</span>
                                  <span>FO: {foTotal}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="w-full overflow-x-auto no-scrollbar">
                          <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                              <tr className="bg-[#1E293B] text-white">
                                <th className="p-6 text-sm font-mono uppercase tracking-widest border-r-[1px] border-[#0A0A0A] w-1/2">Branch Name</th>
                                <th className="p-6 text-sm font-mono uppercase tracking-widest border-r-[1px] border-[#0A0A0A]">Gender Neutral</th>
                                <th className="p-6 text-sm font-mono uppercase tracking-widest">Female Only</th>
                              </tr>
                            </thead>
                            <tbody>
                              {DATA.seats.totalSeatSummary.branches.map((b, idx) => (
                                <tr key={idx} className="border-b-[1px] border-[#1E293B] hover:bg-[#3B82F6] hover:text-black transition-none duration-0 cursor-default">
                                  <td className="p-8 text-xl md:text-3xl font-bold uppercase tracking-tighter border-r-[1px] border-[#1E293B] whitespace-normal break-words min-w-0">{b.name}</td>
                                  <td className="p-8 text-3xl font-black tracking-tighter border-r-[1px] border-[#1E293B]">{b.genderNeutral}</td>
                                  <td className="p-8 text-3xl font-black tracking-tighter">{b.femaleOnly}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    );
                  }

                  // Specific category selected
                  const catData = seatCategory !== "All" ? SEAT_MATRIX_DATA[seatCategory] : null;
                  
                  // Determine which gender pools to show
                  let gnRows: { name: string; seats: number; courseType: string }[] = [];
                  let foRows: { name: string; seats: number; courseType: string }[] = [];
                  
                  if (catData) {
                    gnRows = catData["Gender-Neutral"] ?? [];
                    foRows = catData["Female-Only"] ?? [];
                  } else {
                    // All categories - aggregate by branch
                    const branchMap: Record<string, { gn: number; fo: number; courseType: string }> = {};
                    for (const cat of Object.keys(SEAT_MATRIX_DATA)) {
                      for (const row of (SEAT_MATRIX_DATA[cat]["Gender-Neutral"] ?? [])) {
                        if (!branchMap[row.name]) branchMap[row.name] = { gn: 0, fo: 0, courseType: row.courseType };
                        branchMap[row.name].gn += row.seats;
                      }
                      for (const row of (SEAT_MATRIX_DATA[cat]["Female-Only"] ?? [])) {
                        if (!branchMap[row.name]) branchMap[row.name] = { gn: 0, fo: 0, courseType: row.courseType };
                        branchMap[row.name].fo += row.seats;
                      }
                    }
                    gnRows = Object.entries(branchMap).map(([name, v]) => ({ name, seats: v.gn, courseType: v.courseType }));
                    foRows = Object.entries(branchMap).map(([name, v]) => ({ name, seats: v.fo, courseType: v.courseType }));
                  }

                  const showGN = seatPool === "All" || seatPool === "Gender Neutral";
                  const showFO = seatPool === "All" || seatPool === "Female Only";
                  
                  const gnTotal = gnRows.reduce((s, r) => s + r.seats, 0);
                  const foTotal = foRows.reduce((s, r) => s + r.seats, 0);
                  const displayTotal = (showGN ? gnTotal : 0) + (showFO ? foTotal : 0);

                  // Build unified branch list for display
                  const allBranches = Array.from(new Set([...gnRows.map(r => r.name), ...foRows.map(r => r.name)]));
                  const gnMap = Object.fromEntries(gnRows.map(r => [r.name, r.seats]));
                  const foMap = Object.fromEntries(foRows.map(r => [r.name, r.seats]));
                  const ctMap = Object.fromEntries([...gnRows, ...foRows].map(r => [r.name, r.courseType]));

                  // Group by courseType
                  const grouped: Record<string, string[]> = {};
                  for (const b of allBranches) {
                    const ct = ctMap[b] || "Other";
                    if (!grouped[ct]) grouped[ct] = [];
                    grouped[ct].push(b);
                  }

                  const maxSeats = Math.max(...allBranches.map(b => (gnMap[b] ?? 0) + (foMap[b] ?? 0)), 1);

                  return (
                    <>
                      <div className="p-12 border-b-[1px] border-[#1E293B] flex flex-wrap justify-between items-center gap-6 bg-[#111111]">
                        <div>
                          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
                            {seatCategory === "All" ? "All Categories" : seatCategory}
                            {seatPool !== "All" && <span className="text-[#3B82F6]"> / {seatPool}</span>}
                          </h2>
                          <p className="font-mono text-sm uppercase tracking-widest opacity-50 mt-2">JoSAA 2024 Seat Allocation</p>
                        </div>
                        <p className="text-6xl md:text-[5vw] font-black tracking-tighter text-[#3B82F6] leading-none">{displayTotal}</p>
                      </div>

                      {/* Bar chart visualization */}
                      <div className="p-8 md:p-12 border-b-[1px] border-[#1E293B] flex flex-col gap-3">
                        <p className="font-mono text-xs uppercase tracking-widest opacity-50 mb-4">Seat Distribution by Branch</p>
                        {allBranches.map((branch) => {
                          const gn = showGN ? (gnMap[branch] ?? 0) : 0;
                          const fo = showFO ? (foMap[branch] ?? 0) : 0;
                          const total = gn + fo;
                          const gnPct = (gn / maxSeats) * 100;
                          const foPct = (fo / maxSeats) * 100;
                          return (
                            <div key={branch} className="group flex flex-col gap-1 hover:bg-[#1E293B] p-3 -mx-3 transition-none cursor-default">
                              <div className="flex justify-between items-baseline">
                                <span className="text-sm md:text-base font-bold uppercase tracking-tight whitespace-normal break-words mr-4 opacity-80 group-hover:opacity-100">{branch}</span>
                                <span className="text-2xl font-black tracking-tighter text-[#3B82F6] whitespace-nowrap">{total}</span>
                              </div>
                              <div className="w-full h-6 flex gap-[2px]">
                                {showGN && gn > 0 && (
                                  <div 
                                    className="h-full bg-[#3B82F6] flex items-center justify-end pr-2 transition-none"
                                    style={{ width: `${gnPct}%` }}
                                  >
                                    <span className="text-xs font-black text-black">{gn}</span>
                                  </div>
                                )}
                                {showFO && fo > 0 && (
                                  <div 
                                    className="h-full bg-[#60A5FA] flex items-center justify-end pr-2 transition-none"
                                    style={{ width: `${foPct}%` }}
                                  >
                                    <span className="text-xs font-black text-black">{fo}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                        {showGN && showFO && (
                          <div className="flex gap-6 mt-4 pt-4 border-t-[1px] border-[#1E293B]">
                            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#3B82F6]"></div><span className="text-sm font-mono uppercase tracking-widest opacity-60">Gender Neutral ({gnTotal})</span></div>
                            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#60A5FA]"></div><span className="text-sm font-mono uppercase tracking-widest opacity-60">Female Only ({foTotal})</span></div>
                          </div>
                        )}
                      </div>

                      {/* Full table grouped by course type */}
                      <div className="w-full overflow-x-auto no-scrollbar">
                        {Object.entries(grouped).map(([courseType, branches]) => (
                          <div key={courseType}>
                            <div className="px-8 py-4 bg-[#1E293B] border-b-[1px] border-[#0A0A0A]">
                              <span className="font-mono text-xs uppercase tracking-widest text-[#3B82F6]">{courseType}</span>
                            </div>
                            <table className="w-full text-left border-collapse min-w-[700px]">
                              <thead>
                                <tr className="bg-[#111111]">
                                  <th className="p-5 text-sm font-mono uppercase tracking-widest border-r-[1px] border-[#1E293B] w-1/2 opacity-50">Branch</th>
                                  {showGN && <th className="p-5 text-sm font-mono uppercase tracking-widest border-r-[1px] border-[#1E293B] opacity-50">Gender Neutral</th>}
                                  {showFO && <th className="p-5 text-sm font-mono uppercase tracking-widest opacity-50">Female Only</th>}
                                </tr>
                              </thead>
                              <tbody>
                                {branches.map((b, idx) => (
                                  <tr key={idx} className="border-b-[1px] border-[#1E293B] hover:bg-[#3B82F6] hover:text-black transition-none duration-0 cursor-default">
                                    <td className="p-6 text-lg md:text-2xl font-bold uppercase tracking-tighter border-r-[1px] border-[#1E293B] whitespace-normal break-words">{b}</td>
                                    {showGN && <td className="p-6 text-2xl md:text-3xl font-black tracking-tighter border-r-[1px] border-[#1E293B]">{gnMap[b] ?? 0}</td>}
                                    {showFO && <td className="p-6 text-2xl md:text-3xl font-black tracking-tighter">{foMap[b] ?? 0}</td>}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>

            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center border-[1px] border-[#1E293B] animate-in fade-in duration-500 min-h-[40vh] min-w-0 overflow-hidden bg-[#0A0A0A]">
              <p className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-neutral-600 break-words whitespace-normal text-center">
                {activeTab} Data Pending
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
