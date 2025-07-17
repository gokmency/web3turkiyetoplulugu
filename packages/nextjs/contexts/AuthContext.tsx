"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { 
  AuthUser, 
  AuthSession, 
  signInWithWallet, 
  signOut, 
  getSession, 
  saveSession, 
  clearSession, 
  generateSiweMessage,
  generateNonce
} from "~~/services/database/auth";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: () => Promise<void>;
  logOut: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const isAuthenticated = !!user && isConnected;

  // Check existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = getSession();
        if (session && session.user) {
          setUser(session.user);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  // Clear session when wallet disconnects
  useEffect(() => {
    if (!isConnected && user) {
      logOut();
    }
  }, [isConnected, user]);

  const signIn = async () => {
    if (!address || !isConnected) {
      setError("Please connect your wallet first");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Generate nonce and SIWE message
      const nonce = generateNonce();
      const domain = window.location.hostname;
      const chainId = 1; // Ethereum mainnet
      
      const siweMessage = generateSiweMessage(address, domain, nonce, chainId);
      const messageToSign = siweMessage.prepareMessage();

      // Sign message with wallet
      const signature = await signMessageAsync({
        message: messageToSign,
      });

      // Verify signature and create session
      const result = await signInWithWallet(address, signature, messageToSign);

      if (result.success && result.user) {
        // Create session
        const session: AuthSession = {
          user: result.user,
          token: `session_${Date.now()}`, // Simple token generation
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        };

        // Save session
        saveSession(session);
        setUser(result.user);
      } else {
        setError(result.error || "Authentication failed");
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      setError(error.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const logOut = async () => {
    setIsLoading(true);
    
    try {
      await signOut();
      clearSession();
      setUser(null);
      setError(null);
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        signIn,
        logOut,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// HOC for protected routes
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-6">Please connect your wallet and sign in to access this page.</p>
            <button className="btn btn-primary">Connect Wallet</button>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
};

// Hook for admin-only access
export const useAdminAuth = () => {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isModerator = user?.role === 'moderator' || user?.role === 'admin';

  return {
    isAdmin,
    isModerator,
    isAuthenticated,
    user,
  };
}; 