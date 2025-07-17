import { createConfig } from "wagmi";
import { chains, connectors, publicClient, webSocketPublicClient } from "~~/services/web3/wagmiConnectors";

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});
