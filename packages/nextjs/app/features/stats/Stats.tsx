import Image from "next/image";
import { getTurkishStats } from "~~/services/database/data";

const Stat = ({ label, imgLink, value }: { label: string; imgLink: string; value: string | number }) => {
  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="flex gap-2 items-baseline">
        <Image src={imgLink} alt={label} width={45} height={50} className="w-[30px] lg:w-[50px] h-auto mt-1" />
        <h2 className="text-4xl lg:text-6xl my-0 font-ppEditorial leading-[0.5rem] lg:leading-3">{value}</h2>
      </div>
      <p className="text-lg my-0">{label}</p>
    </div>
  );
};

export const Stats = async () => {
  const stats = await getTurkishStats();

  return (
    <div className="bg-base-300">
      <div className="container flex flex-col items-center justify-center max-w-[90%] lg:max-w-7xl mx-auto py-12 lg:px-12 gap-6">
        <div className="flex flex-col gap-8 md:flex-row justify-between items-start md:w-4/5 lg:w-full">
          <Stat label="Web3 Girişimleri" imgLink="/assets/stats-total.png" value={stats.total_projects} />
          <Stat label="Topluluk Üyeleri" imgLink="/assets/stats-active.png" value={stats.total_people} />
          <Stat label="Geliştiriciler" imgLink="/assets/stats-eth-granted.png" value={stats.total_builders} />
          <Stat label="İçerik Üreticiler" imgLink="/assets/stats-total.png" value={stats.total_creators} />
        </div>
      </div>
    </div>
  );
}; 