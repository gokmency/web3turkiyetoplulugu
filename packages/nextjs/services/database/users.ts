import { supabase } from "./supabase";
import { BuilderDataResponse } from "./schema";

export const findUserByAddress = async (builderAddress: string): Promise<BuilderDataResponse> => {
  // TODO: Implement with Supabase when tables are created
  console.log("Finding user by address (mock):", builderAddress);
  
  // Mock admin user for testing
  if (builderAddress === "0x742d35Cc6634C0532925a3b8D4C6A7e6e3b5a8d6") {
    return {
      exists: true,
      data: {
        id: builderAddress,
        role: "admin",
        ens: "test.eth",
        function: "developer",
        creationTimestamp: Date.now() - 86400000 * 30, // 30 days ago
      },
    };
  }
  
  return { exists: false };
};

export const getUserSnapshotById = async (builderAddress: string) => {
  // TODO: Implement with Supabase when tables are created
  console.log("Getting user snapshot by id (mock):", builderAddress);
  
  if (builderAddress === "0x742d35Cc6634C0532925a3b8D4C6A7e6e3b5a8d6") {
    return {
      exists: true,
      id: builderAddress,
      data: () => ({
        role: "admin",
        ens: "test.eth",
        function: "developer",
        creationTimestamp: Date.now() - 86400000 * 30, // 30 days ago
      }),
    };
  }
  
  return { exists: false };
};
