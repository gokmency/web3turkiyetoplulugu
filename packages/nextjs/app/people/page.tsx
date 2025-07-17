import { PeopleList } from "../features/people/PeopleList";
import { CreateProfileModal } from "../components/modals/CreateProfileModal";
import { Stats } from "../features/stats/Stats";

export const dynamic = 'force-dynamic';

const PeoplePage = () => {
  return (
    <>
      <div className="container max-w-[90%] xl:max-w-7xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-ppEditorial mb-4">
            Topluluk
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Türkiye'deki Web3 topluluğunu keşfedin. Geliştiricilerden içerik üreticilere, 
            yatırımcılardan topluluk yöneticilerine kadar uzanan geniş ağımıza katılın.
          </p>
        </div>
      </div>
      
      <Stats />
      <PeopleList />
      <CreateProfileModal />
    </>
  );
};

export default PeoplePage; 