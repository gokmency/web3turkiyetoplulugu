import { supabase } from "./supabase";
import { SiweMessage } from "siwe";

export interface AuthUser {
  id: string;
  wallet_address: string;
  ens?: string;
  role: 'user' | 'admin' | 'moderator';
  is_verified: boolean;
  created_at: string;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
  expires_at: string;
}

// SIWE Authentication Functions
export const generateSiweMessage = (
  address: string,
  domain: string,
  nonce: string,
  chainId: number = 1
): SiweMessage => {
  const message = new SiweMessage({
    domain,
    address,
    statement: "Turkish Web3 Community'ye hoş geldiniz!",
    uri: `https://${domain}`,
    version: "1",
    chainId,
    nonce,
  });

  return message;
};

export const generateNonce = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

export const verifySiweMessage = async (
  message: string,
  signature: string
): Promise<{ success: boolean; address?: string; error?: string }> => {
  try {
    const siweMessage = new SiweMessage(message);
    const result = await siweMessage.verify({ signature });
    
    if (result.success) {
      return { success: true, address: siweMessage.address };
    } else {
      return { success: false, error: "Invalid signature" };
    }
  } catch (error) {
    console.error("SIWE verification error:", error);
    return { success: false, error: "Verification failed" };
  }
};

// Supabase Authentication Functions
export const signInWithWallet = async (
  walletAddress: string,
  signature: string,
  message: string
): Promise<{ success: boolean; user?: AuthUser; error?: string }> => {
  try {
    // Verify SIWE message
    const verification = await verifySiweMessage(message, signature);
    if (!verification.success) {
      return { success: false, error: verification.error };
    }

    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is fine
      console.error("Error fetching user:", fetchError);
      return { success: false, error: "Database error" };
    }

    let user: AuthUser;

    if (existingUser) {
      // Update last login
      const { data: updatedUser, error: updateError } = await supabase
        .from('user_profiles')
        .update({ updated_at: new Date().toISOString() })
        .eq('wallet_address', walletAddress)
        .select()
        .single();

      if (updateError) {
        console.error("Error updating user:", updateError);
        return { success: false, error: "Update failed" };
      }

      user = {
        id: updatedUser.id,
        wallet_address: updatedUser.wallet_address,
        ens: updatedUser.ens,
        role: updatedUser.role,
        is_verified: updatedUser.is_verified,
        created_at: updatedUser.created_at,
      };
    } else {
      // Create new user
      const { data: newUser, error: createError } = await supabase
        .from('user_profiles')
        .insert([{
          wallet_address: walletAddress,
          role: 'user',
          is_verified: false,
        }])
        .select()
        .single();

      if (createError) {
        console.error("Error creating user:", createError);
        return { success: false, error: "Failed to create user" };
      }

      user = {
        id: newUser.id,
        wallet_address: newUser.wallet_address,
        ens: newUser.ens,
        role: newUser.role,
        is_verified: newUser.is_verified,
        created_at: newUser.created_at,
      };
    }

    return { success: true, user };
  } catch (error) {
    console.error("Sign in error:", error);
    return { success: false, error: "Authentication failed" };
  }
};

export const signOut = async (): Promise<{ success: boolean }> => {
  try {
    // Clear any local session data
    localStorage.removeItem('auth_session');
    sessionStorage.removeItem('auth_session');
    
    return { success: true };
  } catch (error) {
    console.error("Sign out error:", error);
    return { success: true }; // Always return success for sign out
  }
};

// Session Management
export const saveSession = (session: AuthSession): void => {
  localStorage.setItem('auth_session', JSON.stringify(session));
};

export const getSession = (): AuthSession | null => {
  try {
    const sessionData = localStorage.getItem('auth_session');
    if (!sessionData) return null;

    const session: AuthSession = JSON.parse(sessionData);
    
    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      localStorage.removeItem('auth_session');
      return null;
    }

    return session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
};

export const clearSession = (): void => {
  localStorage.removeItem('auth_session');
  sessionStorage.removeItem('auth_session');
};

// User Profile Functions
export const getUserProfile = async (walletAddress: string): Promise<AuthUser | null> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }

    return {
      id: data.id,
      wallet_address: data.wallet_address,
      ens: data.ens,
      role: data.role,
      is_verified: data.is_verified,
      created_at: data.created_at,
    };
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    return null;
  }
};

export const updateUserProfile = async (
  walletAddress: string,
  updates: Partial<{ ens: string; email: string }>
): Promise<{ success: boolean; user?: AuthUser; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('wallet_address', walletAddress)
      .select()
      .single();

    if (error) {
      console.error("Error updating user profile:", error);
      return { success: false, error: "Update failed" };
    }

    return { 
      success: true, 
      user: {
        id: data.id,
        wallet_address: data.wallet_address,
        ens: data.ens,
        role: data.role,
        is_verified: data.is_verified,
        created_at: data.created_at,
      }
    };
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    return { success: false, error: "Update failed" };
  }
};

// Admin Functions
export const isUserAdmin = async (walletAddress: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('wallet_address', walletAddress)
      .single();

    if (error) {
      console.error("Error checking admin status:", error);
      return false;
    }

    return data.role === 'admin';
  } catch (error) {
    console.error("Error in isUserAdmin:", error);
    return false;
  }
};

export const getAllUsers = async (): Promise<AuthUser[]> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching all users:", error);
      return [];
    }

    return data.map(user => ({
      id: user.id,
      wallet_address: user.wallet_address,
      ens: user.ens,
      role: user.role,
      is_verified: user.is_verified,
      created_at: user.created_at,
    }));
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    return [];
  }
};

// ENS Integration (optional)
export const resolveENS = async (address: string): Promise<string | null> => {
  try {
    // This would typically use ethers.js or similar
    // For now, return null - implement when needed
    return null;
  } catch (error) {
    console.error("Error resolving ENS:", error);
    return null;
  }
}; 