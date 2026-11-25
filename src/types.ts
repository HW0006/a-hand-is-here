import type { ReactNode } from "react";

export type Sender = "bot" | "user";

export interface ChatMsg {
  id: string;
  sender: Sender;
  node: ReactNode;
}

export type Step =
  | "intro"
  | "name"
  | "household"
  | "income"
  | "insurance"
  | "computing"
  | "result";

export type TierKey = "free" | "partial" | "reduced" | "none";

export interface Tier {
  key: TierKey;
  label: string;
  discount: number;
  detail: string;
}
