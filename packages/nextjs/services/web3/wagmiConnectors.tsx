import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  coinbaseWallet,
  ledgerWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { Chain, configureChains } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { mainnet, optimism } from "wagmi/chains";
import scaffoldConfig from "~~/scaffold.config";

// Fallback chains if scaffoldConfig.targetNetworks is undefined
const fallbackChains = [mainnet, optimism];

const { chains, publicClient, webSocketPublicClient } = configureChains(
  (scaffoldConfig.targetNetworks && scaffoldConfig.targetNetworks.length > 0) 
    ? [...scaffoldConfig.targetNetworks] as any[]
    : fallbackChains as any[],
  [
    alchemyProvider({
      apiKey: scaffoldConfig.alchemyApiKey || "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF",
    }),
    publicProvider(),
  ],
);

// Ensure chains is always an array for connectors
const safeChains = Array.isArray(chains) && chains.length > 0 ? chains : fallbackChains;

const connectors = connectorsForWallets([
  {
    groupName: "Supported Wallets",
    wallets: [
      metaMaskWallet({ 
        chains: safeChains, 
        projectId: scaffoldConfig.walletConnectProjectId,
        shimDisconnect: true,
      }),
      walletConnectWallet({ 
        chains: safeChains, 
        projectId: scaffoldConfig.walletConnectProjectId,
      }),
      ledgerWallet({ 
        chains: safeChains, 
        projectId: scaffoldConfig.walletConnectProjectId,
      }),
      coinbaseWallet({ 
        appName: "Turkish Web3 Community", 
        chains: safeChains,
      }),
      rainbowWallet({ 
        chains: safeChains, 
        projectId: scaffoldConfig.walletConnectProjectId,
      }),
    ],
  },
]);

export { safeChains as chains, connectors, publicClient, webSocketPublicClient };
export const appChains = safeChains;
