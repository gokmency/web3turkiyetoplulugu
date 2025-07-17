import { supabase } from "./supabase";
import { BuilderData, GrantData, GrantDataWithPrivateNote, TurkishProject, TurkishPerson } from "./schema";
import { findUserByAddress } from "~~/services/database/users";

// Local constants for proposal status
export const PROPOSAL_STATUS = {
  PROPOSED: "proposed",
  APPROVED: "approved", 
  REJECTED: "rejected",
  SUBMITTED: "submitted",
  COMPLETED: "completed",
} as const;

export type ProposalStatusType = typeof PROPOSAL_STATUS[keyof typeof PROPOSAL_STATUS];

// TEMPORARY: Mock data for testing
const mockGrants: GrantData[] = [
  {
    id: "1",
    title: "DeFi Dashboard",
    description: "A comprehensive dashboard for DeFi protocols",
    askAmount: 0.25,
    builder: "0x742d35Cc6634C0532925a3b8D4C6A7e6e3b5a8d6",
    status: "completed",
    completedAt: Date.now() - 86400000, // 1 day ago
    link: "https://github.com/example/defi-dashboard"
  },
  {
    id: "2", 
    title: "NFT Marketplace",
    description: "A decentralized NFT marketplace with advanced features",
    askAmount: 0.15,
    builder: "0x742d35Cc6634C0532925a3b8D4C6A7e6e3b5a8d6",
    status: "approved",
    approvedAt: Date.now() - 172800000, // 2 days ago
  }
];

// TEMPORARY: Mock Turkish Projects
const mockTurkishProjects: TurkishProject[] = [
  {
    id: "1",
    name: "DeFi Türkiye",
    description: "Türkiye'nin ilk DeFi platformu. Yerel para birimleri ile DeFi protokollerini birleştiren yenilikçi çözüm.",
    category: "DeFi",
    image_url: "/assets/defi-turkiye.png",
    website_url: "https://defiturkiye.com",
    twitter_url: "https://twitter.com/defiturkiye",
    github_url: "https://github.com/defiturkiye",
    created_at: Date.now() - 86400000 * 30, // 30 days ago
  },
  {
    id: "2",
    name: "Istanbul NFT",
    description: "İstanbul'un kültürel mirasını NFT'lerde yaşatan topluluk projesi. Sanat ve teknoloji buluşması.",
    category: "NFT",
    image_url: "/assets/istanbul-nft.png",
    website_url: "https://istanbulnft.art",
    twitter_url: "https://twitter.com/istanbulnft",
    created_at: Date.now() - 86400000 * 15, // 15 days ago
  },
  {
    id: "3",
    name: "GRAINZ AGENCY",
    description: "Blockchain ve web3 projelerine Türkiye marketinde destek olmak için kurulan bir oluşumdur. sosyal medya ve topluluk yonetimi ve marketing alanında destek vermektedir.",
    category: "Social",
    image_url: "/assets/grainzagency",
    website_url: "http://grainz.space/",
    twitter_url: "https://twitter.com/grainzeth",
    created_at: Date.now() - 86400000 * 20, // 20 days ago
  }
];

// TEMPORARY: Mock Topluluk
const mockTurkishPeople: TurkishPerson[] = [
  {
    id: "1",
    wallet_address: "0x742d35Cc6634C0532925a3b8D4C6A7e6e3b5a8d6",
    name: "Ahmet Demir",
    bio: "Senior Solidity Developer ve DeFi protokol uzmanı. 5+ yıl Web3 deneyimi.",
    role: "geliştirici",
    location: "Istanbul",
    avatar_url: "/assets/avatar-1.png",
    social_links: {
      x: "https://x.com/ahmetdemir",
      github: "https://github.com/ahmetdemir",
      linkedin: "https://linkedin.com/in/ahmetdemir"
    },
    skills: ["Solidity", "React", "Web3.js", "Hardhat"],
    created_at: Date.now() - 86400000 * 10, // 10 days ago
  },
  {
    id: "2",
    wallet_address: "0x9A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T",
    name: "Zeynep Kartal",
    bio: "NFT sanatçısı ve digital asset creator. Türk kültürünü blockchain'e taşıyor.",
    role: "içerik-üretici",
    location: "Izmir",
    avatar_url: "/assets/avatar-2.png",
    social_links: {
      x: "https://x.com/zeynepkartal",
      instagram: "https://instagram.com/zeynepkartal"
    },
    skills: ["Digital Art", "NFT Creation", "Photoshop", "Illustrator"],
    created_at: Date.now() - 86400000 * 5, // 5 days ago
  },
  {
    id: "3",
    wallet_address: "0xB1C2D3E4F5G6H7I8J9K0L1M2N3O4P5Q6R7S8T9U0",
    name: "Mehmet Yılmaz",
    bio: "Web3 startup investor ve mentor. Early stage projelere odaklanıyor.",
    role: "yatırımcı",
    location: "Ankara",
    avatar_url: "/assets/avatar-3.png",
    social_links: {
      x: "https://x.com/mehmetyilmaz",
      linkedin: "https://linkedin.com/in/mehmetyilmaz"
    },
    skills: ["Investment", "Mentoring", "Strategy", "DeFi"],
    created_at: Date.now() - 86400000 * 7, // 7 days ago
  },
  {
    id: "4",
    wallet_address: "0xC2D3E4F5G6H7I8J9K0L1M2N3O4P5Q6R7S8T9U0V1",
    name: "Elif Özkan",
    bio: "Web3 topluluk yöneticisi ve etkinlik organizatörü. Türkiye'de Web3 adoption artırmaya odaklanıyor.",
    role: "topluluk-yöneticisi",
    location: "Izmir",
    avatar_url: "/assets/avatar-1.png",
    social_links: {
      x: "https://x.com/elifozkan",
      linkedin: "https://linkedin.com/in/elifozkan",
      telegram: "https://t.me/elifozkan"
    },
    skills: ["Community Management", "Event Organization", "Marketing", "Social Media"],
    created_at: Date.now() - 86400000 * 3, // 3 days ago
  }
];

export const createGrant = async (grantData: Omit<GrantData, "id" | "proposedAt" | "status">) => {
  // TODO: Implement with Supabase when tables are created
  console.log("Creating grant (mock):", grantData);
  return {
    id: "mock-id",
    ...grantData,
    status: PROPOSAL_STATUS.PROPOSED,
    proposedAt: Date.now(),
  } as GrantData;
};

export const getAllGrants = async () => {
  // TODO: Implement with Supabase when tables are created
  console.log("Getting all grants (mock)");
  return mockGrants;
};

export const getAllGrantsForUser = async (userAddress: string) => {
  // TODO: Implement with Supabase when tables are created
  console.log("Getting grants for user (mock):", userAddress);
  return mockGrants.filter(grant => grant.builder === userAddress);
};

export const getAllGrantsForReview = async () => {
  // TODO: Implement with Supabase when tables are created
  console.log("Getting grants for review (mock)");
  return mockGrants.filter(grant => 
    grant.status === PROPOSAL_STATUS.PROPOSED || 
    grant.status === PROPOSAL_STATUS.SUBMITTED
  ).map(grant => ({
    ...grant,
    private_note: undefined,
    builderData: undefined,
  })) as GrantDataWithPrivateNote[];
};

export const getAllCompletedGrants = async (limit?: number) => {
  // TODO: Implement with Supabase when tables are created
  console.log("Getting completed grants (mock)", limit);
  const completed = mockGrants.filter(grant => grant.status === PROPOSAL_STATUS.COMPLETED);
  return limit ? completed.slice(0, limit) : completed;
};

export const getAllActiveGrants = async (limit?: number) => {
  // TODO: Implement with Supabase when tables are created
  console.log("Getting active grants (mock)", limit);
  const active = mockGrants.filter(grant => grant.status === PROPOSAL_STATUS.APPROVED);
  return limit ? active.slice(0, limit) : active;
};

export const getAllEcosystemGrants = async () => {
  // TODO: Implement with Supabase when tables are created
  console.log("Getting ecosystem grants (mock)");
  return []; // Return empty array since we removed ecosystem grants
};

export const reviewGrant = async ({ grantId, action, txHash, txChainId, note }: {
  grantId: string;
  action: ProposalStatusType;
  txHash: string;
  txChainId: string;
  note?: string;
}) => {
  // TODO: Implement with Supabase when tables are created
  console.log("Reviewing grant (mock):", { grantId, action, txHash, txChainId, note });
};

export const updateGrant = async (grantId: string, grantData: Partial<GrantData>, private_note?: string) => {
  // TODO: Implement with Supabase when tables are created
  console.log("Updating grant (mock):", { grantId, grantData, private_note });
};

export const getGrantsStats = async () => {
  // TODO: Implement with Supabase when tables are created
  console.log("Getting grants stats (mock)");
  return {
    total_grants: 2,
    total_eth_granted: 0.4,
    total_active_grants: 1,
  };
};

export const getGrantById = async (grantId: string) => {
  // TODO: Implement with Supabase when tables are created
  console.log("Getting grant by id (mock):", grantId);
  return mockGrants.find(grant => grant.id === grantId) || null;
};

export const submitGrantBuild = async (grantId: string, link: string) => {
  // TODO: Implement with Supabase when tables are created
  console.log("Submitting grant build (mock):", { grantId, link });
};

// Turkish Projects Functions - Updated to use real Supabase
export const getAllTurkishProjects = async (category?: string) => {
  console.log("Getting Turkish projects (real Supabase)", category || "all");
  
  // Try to get from Supabase first
  try {
    const { getAllTurkishProjects: realGetAllTurkishProjects } = await import("./turkish-data");
    return await realGetAllTurkishProjects(category);
  } catch (error) {
    console.error("Supabase not configured, falling back to mock data:", error);
    // Fallback to mock data
    if (category && category !== "all") {
      return mockTurkishProjects.filter(project => project.category === category);
    }
    return mockTurkishProjects;
  }
};

export const createTurkishProject = async (projectData: Omit<TurkishProject, "id" | "created_at">) => {
  console.log("Creating Turkish project:", projectData);
  
  try {
    const { createTurkishProject: realCreateTurkishProject } = await import("./turkish-data");
    return await realCreateTurkishProject(projectData);
  } catch (error) {
    console.error("Supabase not configured, using mock:", error);
    return {
      id: `project-${Date.now()}`,
      ...projectData,
      created_at: Date.now(),
    } as TurkishProject;
  }
};

export const updateTurkishProject = async (projectId: string, projectData: Partial<TurkishProject>) => {
  console.log("Updating Turkish project:", { projectId, projectData });
  
  try {
    const { updateTurkishProject: realUpdateTurkishProject } = await import("./turkish-data");
    return await realUpdateTurkishProject(projectId, projectData);
  } catch (error) {
    console.error("Supabase not configured, using mock:", error);
    return null;
  }
};

export const deleteTurkishProject = async (projectId: string) => {
  console.log("Deleting Turkish project:", projectId);
  
  try {
    const { deleteTurkishProject: realDeleteTurkishProject } = await import("./turkish-data");
    return await realDeleteTurkishProject(projectId);
  } catch (error) {
    console.error("Supabase not configured, using mock:", error);
    return false;
  }
};

// Turkish People Functions - Updated to use real Supabase
export const getAllTurkishPeople = async (role?: string) => {
  console.log("Getting Turkish people (real Supabase)", role || "all");
  
  try {
    const { getAllTurkishPeople: realGetAllTurkishPeople } = await import("./turkish-data");
    return await realGetAllTurkishPeople(role);
  } catch (error) {
    console.error("Supabase not configured, falling back to mock data:", error);
    if (role && role !== "all") {
      return mockTurkishPeople.filter(person => person.role === role);
    }
    return mockTurkishPeople;
  }
};

export const getTurkishPersonByWallet = async (walletAddress: string) => {
  console.log("Getting Turkish person by wallet:", walletAddress);
  
  try {
    const { getTurkishPersonByWallet: realGetTurkishPersonByWallet } = await import("./turkish-data");
    return await realGetTurkishPersonByWallet(walletAddress);
  } catch (error) {
    console.error("Supabase not configured, using mock:", error);
    return mockTurkishPeople.find(person => person.wallet_address === walletAddress);
  }
};

export const createTurkishPerson = async (personData: Omit<TurkishPerson, "id" | "created_at">) => {
  console.log("Creating Turkish person:", personData);
  
  try {
    const { createTurkishPerson: realCreateTurkishPerson } = await import("./turkish-data");
    return await realCreateTurkishPerson(personData);
  } catch (error) {
    console.error("Supabase not configured, using mock:", error);
    return {
      id: `person-${Date.now()}`,
      ...personData,
      created_at: Date.now(),
    } as TurkishPerson;
  }
};

export const updateTurkishPerson = async (personId: string, personData: Partial<TurkishPerson>) => {
  console.log("Updating Turkish person:", { personId, personData });
  
  try {
    const { updateTurkishPerson: realUpdateTurkishPerson } = await import("./turkish-data");
    return await realUpdateTurkishPerson(personId, personData);
  } catch (error) {
    console.error("Supabase not configured, using mock:", error);
    return null;
  }
};

export const deleteTurkishPerson = async (personId: string) => {
  console.log("Deleting Turkish person:", personId);
  
  try {
    const { deleteTurkishPerson: realDeleteTurkishPerson } = await import("./turkish-data");
    return await realDeleteTurkishPerson(personId);
  } catch (error) {
    console.error("Supabase not configured, using mock:", error);
    return false;
  }
};

// Stats functions - Updated to use real Supabase
export const getTurkishStats = async () => {
  console.log("Getting Turkish stats (real Supabase)");
  
  try {
    const { getTurkishStats: realGetTurkishStats } = await import("./turkish-data");
    return await realGetTurkishStats();
  } catch (error) {
    console.error("Supabase not configured, falling back to mock data:", error);
    return {
      total_projects: mockTurkishProjects.length,
      total_people: mockTurkishPeople.length,
      total_builders: mockTurkishPeople.filter(p => p.role === "geliştirici").length,
      total_creators: mockTurkishPeople.filter(p => p.role === "içerik-üretici").length,
      total_investors: mockTurkishPeople.filter(p => p.role === "yatırımcı").length,
      total_degens: mockTurkishPeople.filter(p => p.role === "topluluk-yöneticisi").length,
    };
  }
};

export const searchTurkishPeople = async (searchTerm: string, role?: string) => {
  console.log("Searching Turkish people:", { searchTerm, role });
  
  try {
    const { searchTurkishPeople: realSearchTurkishPeople } = await import("./turkish-data");
    return await realSearchTurkishPeople(searchTerm, role);
  } catch (error) {
    console.error("Supabase not configured, using mock search:", error);
    let filteredPeople = mockTurkishPeople;
    
    // Apply role filter
    if (role && role !== "all") {
      filteredPeople = filteredPeople.filter(person => person.role === role);
    }
    
    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filteredPeople = filteredPeople.filter(person => 
        person.name.toLowerCase().includes(searchLower) ||
        person.bio?.toLowerCase().includes(searchLower) ||
        person.location?.toLowerCase().includes(searchLower) ||
        person.skills?.some(skill => skill.toLowerCase().includes(searchLower))
      );
    }
    
    return filteredPeople;
  }
};

export const searchTurkishProjects = async (searchTerm: string, category?: string) => {
  console.log("Searching Turkish projects:", { searchTerm, category });
  
  try {
    const { searchTurkishProjects: realSearchTurkishProjects } = await import("./turkish-data");
    return await realSearchTurkishProjects(searchTerm, category);
  } catch (error) {
    console.error("Supabase not configured, using mock search:", error);
    let filteredProjects = mockTurkishProjects;
    
    // Apply category filter
    if (category && category !== "all") {
      filteredProjects = filteredProjects.filter(project => project.category === category);
    }
    
    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filteredProjects = filteredProjects.filter(project => 
        project.name.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        project.category.toLowerCase().includes(searchLower)
      );
    }
    
    return filteredProjects;
  }
};
