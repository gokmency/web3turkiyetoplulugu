import type { Simplify } from "type-fest";

export type SocialLinks = {
  x?: string; // X (formerly Twitter)
  github?: string;
  discord?: string;
  telegram?: string;
  instagram?: string;
  email?: string;
  linkedin?: string;
  website?: string;
  youtube?: string;
  medium?: string;
};

// Web3 Girişimleri Schema
export type TurkishProject = {
  id: string;
  name: string;
  description: string;
  category: "DeFi" | "NFT" | "GameFi" | "Infrastructure" | "Social" | "Other";
  image_url?: string;
  website_url?: string;
  twitter_url?: string;
  github_url?: string;
  created_at: number;
};

// Topluluk Schema
export type TurkishPerson = {
  id: string;
  wallet_address: string;
  name: string;
  bio?: string;
  role: "geliştirici" | "içerik-üretici" | "yatırımcı" | "topluluk-yöneticisi" | "araştırmacı" | "tasarımcı" | "pazarlama-uzmanı" | "girişimci" | "eğitmen" | "analiz-uzmanı";
  location?: string;
  avatar_url?: string;
  social_links?: SocialLinks;
  skills?: string[]; // skills for any role
  created_at: number;
  updated_at?: number;
};

type Build = {
  submittedTimestamp: number;
  id: string;
};

type Status = {
  text: string;
  timestamp: number;
};

type Graduated = {
  reason: string;
  status: boolean;
};

export type BuilderData = {
  id: string;
  ens?: string;
  socialLinks?: SocialLinks;
  role?: "anonymous" | "builder" | "admin";
  function?: string;
  creationTimestamp?: number;
  builds?: Build[];
  status?: Status;
  graduated?: Graduated;
  batch?: {
    number: string;
    status: string;
  };
  builderCohort?: { id: string; name: string; url: string }[];
  stream?: {
    balance: string;
    cap: string;
    frequency: number;
    lastContract: number;
    lastIndexedBlock: number;
    streamAddress: string;
  };
};

export type BuilderDataResponse = {
  exists: boolean;
  data?: BuilderData;
};

export type GrantWithoutTimestamps = {
  id: string;
  title: string;
  description: string;
  askAmount: number;
  builder: string;
  link?: string;
  status: "proposed" | "approved" | "submitted" | "completed" | "rejected";
  approvedTx?: string;
  completedTx?: string;
  note?: string;
  txChainId?: string;
};

export type GrantData = Simplify<
  GrantWithoutTimestamps & {
    [k in GrantWithoutTimestamps["status"] as `${k}At`]?: number;
  }
>;

export type GrantDataWithBuilder = Simplify<GrantData & { builderData?: BuilderData }>;
export type GrantDataWithPrivateNote = Simplify<GrantDataWithBuilder & { private_note?: string }>;
