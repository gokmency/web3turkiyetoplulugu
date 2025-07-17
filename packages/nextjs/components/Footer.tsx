import React from "react";
import Link from "next/link";
import Image from "next/image";

/**
 * Site footer
 */
export const Footer = () => {
  return (
    <>
      {/* Project Application Section */}
      <div className="bg-secondary py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="text-4xl">✨</div>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-secondary-content leading-tight">
                Anlamlı projeleri
                <br />
                Türkiye Web3 ekosisteminde
                <br />
                fonlama
              </h2>
              <p className="text-secondary-content text-lg leading-relaxed max-w-md">
                Türkiye Web3 Directory, Türkiye'deki blockchain projelerini destekler ve 
                Web3 ekosistemine katkıda bulunur. Projenizi kaydetmek için başvuru yapın.
              </p>
              <div className="pt-4">
                <Link href="/projects">
                  <button className="btn btn-primary btn-lg px-8 py-3 text-lg font-semibold rounded-full hover:shadow-lg transition-all duration-200">
                    Daha fazla bilgi
                  </button>
                </Link>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <Image 
                  src="/assets/turkish-web3-hero.png" 
                  alt="Turkish Web3 Community" 
                  width={400} 
                  height={400}
                  className="w-full max-w-[400px] h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Footer */}
      <div className="min-h-0 py-5 px-1 mb-11 lg:mb-0">
        <div className="w-full">
          <ul className="menu menu-horizontal w-full">
            <div className="flex justify-center items-center gap-2 text-sm w-full">
              <div className="text-center">
                <span className="text-gray-600">
                  Web3 Türkiye Topluluğu
                </span>
              </div>
            </div>
          </ul>
        </div>
      </div>
    </>
  );
};
