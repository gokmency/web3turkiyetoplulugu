import { Space_Grotesk, Space_Mono } from "next/font/google";
import localFont from "next/font/local";
import "@rainbow-me/rainbowkit/styles.css";
import { Metadata } from "next";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";

const baseUrl = "https://web3turkiyetoplulugu.vercel.app";
const imageUrl = `${baseUrl}/thumbnail.png`;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Web3 Türkiye Topluluğu",
    template: "%s | Web3 Türkiye Topluluğu",
  },
  description:
    "Türkiye'deki Web3 girişimlerini ve topluluk üyelerini tanıtan platform. DeFi'den NFT'lere, blockchain oyunlarından altyapı projelerine kadar geniş bir yelpazede girişimler.",
  openGraph: {
    title: {
      default: "Web3 Türkiye Topluluğu",
      template: "%s | Web3 Türkiye Topluluğu",
    },
    description:
      "Türkiye'deki Web3 girişimlerini ve topluluk üyelerini tanıtan platform. DeFi'den NFT'lere, blockchain oyunlarından altyapı projelerine kadar geniş bir yelpazede girişimler.",
    images: [
      {
        url: imageUrl,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [imageUrl],
    title: {
      default: "Web3 Türkiye Topluluğu",
      template: "%s | Web3 Türkiye Topluluğu",
    },
    description:
      "Türkiye'deki Web3 girişimlerini ve topluluk üyelerini tanıtan platform. DeFi'den NFT'lere, blockchain oyunlarından altyapı projelerine kadar geniş bir yelpazede girişimler.",
  },
  icons: {
    icon: [{ url: "/favicon.png", sizes: "32x32", type: "image/png" }],
  },
};

const ppEditorial = localFont({
  src: [
    { path: "../public/fonts/PPEditorialNew-Ultralight.woff2", weight: "200", style: "normal" },
    {
      path: "../public/fonts/PPEditorialNew-UltralightItalic.woff2",
      weight: "200",
      style: "italic",
    },
  ],
  variable: "--font-pp-editorial",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html
      suppressHydrationWarning
      className={`${ppEditorial.variable} ${spaceMono.variable} ${spaceGrotesk.variable} scroll-smooth`}
    >
      <body>
        <ThemeProvider enableSystem={false} defaultTheme="light" forcedTheme="light">
          <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
