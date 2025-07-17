import Image from "next/image";
import Link from "next/link";

export const HomepageHero = () => (
  <div className="container max-w-[90%] lg:py-12 py-0 xl:max-w-7xl xl:pl-4 m-auto pt-4 pb-8 flex flex-col-reverse lg:flex-row items-center justify-between gap-5 lg:gap-0">
    <div className="space-y-2 lg:max-w-[55%] flex flex-col items-center lg:items-start">
      <div className="relative">
        <h2 className="text-3xl md:text-4xl lg:text-6xl lg:leading-[1.2] text-center lg:text-left font-ppEditorial">
          Türkiye'nin Web3 <br /> Ekosistemini keşfet
        </h2>
        <Image className="absolute -top-3 -right-7" src="/assets/sparkle.png" alt="sparkle" width={32} height={32} />
      </div>
      <div className="text-center font-spaceMono px-1 max-w-lg lg:max-w-none lg:w-4/5 lg:px-0 lg:text-left space-y-5">
        <div className="bg-base-300 p-4 rounded-2xl">
          <p className="m-0 text-xs md:text-sm lg:text-base">
            Türkiye'deki Web3 girişimlerini ve bu alandaki yetenekli insanları keşfet. Geliştiricilerden içerik üreticilerine, 
            yatırımcılardan topluluk yöneticilerine kadar Web3 ekosisteminin nabzını tut. Cüzdanını bağla, profilini oluştur ve 
            topluluğun bir parçası ol.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <Link
            href="/projects"
            className="btn btn-primary btn-md border-1 border-black hover:border-black hover:border-1 rounded-2xl px-8 font-bold shadow-none"
          >
            Girişimleri Keşfet
          </Link>
          <Link
            href="/people"
            className="btn btn-secondary btn-md border-1 border-black hover:border-black hover:border-1 rounded-2xl px-8 font-bold shadow-none"
          >
            Topluluğu Keşfet
          </Link>
        </div>
      </div>
    </div>
    <div className="flex flex-col items-center">
      <div className="max-w-md lg:max-w-none">
        <Image src="/assets/turkish-web3-hero.png" alt="turkish web3 community" width={550} height={550} className="w-auto h-auto" />
      </div>
    </div>
  </div>
);
