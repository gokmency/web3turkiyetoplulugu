"use client";

import { useEffect, useState } from "react";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";
import { SWRConfig } from "swr";
import { WagmiConfig } from "wagmi";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { ProgressBar } from "~~/components/scaffold-eth/ProgressBar";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import { chains } from "~~/services/web3/wagmiConnectors";
import { fetcher } from "~~/utils/swr";
import { AuthProvider } from "~~/contexts/AuthContext";

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="flex flex-col min-h-screen font-spaceGrotesk">
        <Header />
        <main className="relative flex flex-col flex-1">{children}</main>
        <Footer />
      </div>
      <Toaster />
    </>
  );
};

export const ScaffoldEthAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Prevent ethereum provider redefinition errors
    if (typeof window !== "undefined") {
      const handleEthereumProviderError = (error: ErrorEvent) => {
        if (error.message?.includes("Cannot redefine property: ethereum")) {
          console.warn("Ethereum provider redefinition prevented");
          error.preventDefault();
        }
      };
      
      window.addEventListener("error", handleEthereumProviderError);
      
      return () => {
        window.removeEventListener("error", handleEthereumProviderError);
      };
    }
  }, []);

  return (
    <WagmiConfig config={wagmiConfig}>
      <ProgressBar />
      <RainbowKitProvider
        chains={chains}
        avatar={BlockieAvatar}
        theme={mounted ? (isDarkMode ? darkTheme() : lightTheme()) : lightTheme()}
      >
        <SWRConfig value={{ fetcher: fetcher, revalidateOnFocus: false }}>
          <AuthProvider>
            <ScaffoldEthApp>{children}</ScaffoldEthApp>
          </AuthProvider>
        </SWRConfig>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};
