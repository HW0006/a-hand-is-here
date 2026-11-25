import type { Tier } from "../types";

// 2024 HHS Federal Poverty Guidelines, 48 contiguous states + D.C.
export const FPL_BASE: Record<number, number> = {
  1: 15060,
  2: 20440,
  3: 25820,
  4: 31200,
  5: 36580,
  6: 41960,
  7: 47340,
  8: 52720,
};
export const FPL_STEP = 5380;

export function fplForHousehold(size: number): number {
  if (size <= 8) return FPL_BASE[size];
  return FPL_BASE[8] + (size - 8) * FPL_STEP;
}

export function pctOfFPL(income: number, size: number): number {
  const base = fplForHousehold(size);
  return Math.round((income / base) * 100);
}

export function tierFor(pct: number): Tier {
  if (pct <= 200) {
    return {
      key: "free",
      label: "Qualifies — Free Care",
      discount: 100,
      detail:
        "At or below 200% of the Federal Poverty Level, the full balance is forgiven under this hospital's charity care policy.",
    };
  }
  if (pct <= 300) {
    return {
      key: "partial",
      label: "Qualifies — 75% Discount",
      discount: 75,
      detail:
        "Between 201–300% of FPL, this hospital's sliding-fee schedule applies a 75% discount to the balance.",
    };
  }
  if (pct <= 400) {
    return {
      key: "partial",
      label: "Qualifies — 50% Discount",
      discount: 50,
      detail:
        "Between 301–400% of FPL, a 50% discount applies, plus access to an interest-free payment plan.",
    };
  }
  if (pct <= 500) {
    return {
      key: "reduced",
      label: "Qualifies — 25% Discount",
      discount: 25,
      detail:
        "Between 401–500% of FPL, a 25% discount applies under the extended assistance tier.",
    };
  }
  return {
    key: "none",
    label: "Not eligible for charity care",
    discount: 0,
    detail:
      "Above 500% of FPL, this policy's charity-care thresholds don't apply — but an interest-free payment plan is still available.",
  };
}

export const money = (n: number): string => "$" + Math.round(n).toLocaleString("en-US");
