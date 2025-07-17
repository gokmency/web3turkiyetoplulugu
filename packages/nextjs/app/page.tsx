import { ProjectsPreview } from "./components/previews/ProjectsPreview";
import { PeoplePreview } from "./components/previews/PeoplePreview";
import { Stats } from "./features/stats/Stats";
import { HomepageHero } from "./components/hero/HomepageHero";

export const dynamic = 'force-dynamic';

const Home = () => {
  return (
    <>
      <HomepageHero />
              <Stats />
      <ProjectsPreview />
      <PeoplePreview />
    </>
  );
};

export default Home;
