// Helper function to translate category names from English to Turkish
export const getCategoryLabel = (category: string): string => {
  const categoryMap: Record<string, string> = {
    "DeFi": "DeFi",
    "NFT": "NFT", 
    "GameFi": "Blockchain Oyunları",
    "Infrastructure": "Altyapı",
    "Social": "Sosyal",
    "Other": "Diğer"
  };
  return categoryMap[category] || category;
};

// Category definitions with icons for UI components
export const categoryDefinitions = [
  { value: "all", label: "Hepsi", icon: "🌟" },
  { value: "DeFi", label: "DeFi", icon: "💰" },
  { value: "NFT", label: "NFT", icon: "🎨" },
  { value: "GameFi", label: "Blockchain Oyunları", icon: "🎮" },
  { value: "Infrastructure", label: "Altyapı", icon: "🔧" },
  { value: "Social", label: "Sosyal", icon: "👥" },
  { value: "Other", label: "Diğer", icon: "📦" },
]; 