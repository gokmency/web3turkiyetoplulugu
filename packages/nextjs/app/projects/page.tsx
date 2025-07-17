import { ProjectsList } from "../features/projects/ProjectsList";
import { Stats } from "../features/stats/Stats";

export const dynamic = 'force-dynamic';

const ProjectsPage = () => {
  return (
    <>
      <div className="container max-w-[90%] xl:max-w-7xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-ppEditorial mb-4">
            Web3 Girişimleri
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Türkiye'deki innovatif Web3 girişimlerini keşfedin. DeFi'den NFT'lere, 
            Blockchain oyunlarından altyapı projelerine kadar geniş bir yelpazede girişimler.
          </p>
        </div>
      </div>
      
      <Stats />
      <ProjectsList />
    </>
  );
};

export default ProjectsPage; 