"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getAllTurkishProjects, searchTurkishProjects } from "~~/services/database/data";
import { TurkishProject } from "~~/services/database/schema";
import { WebsiteIcon } from "~~/components/assets/WebsiteIcon";
import { XIcon } from "~~/components/assets/XIcon";
import { GitHubIcon } from "~~/components/assets/GitHubIcon";
import { getCategoryLabel, categoryDefinitions } from "~~/utils/categoryTranslations";

const TurkishProjectCard = ({
  name,
  description,
  category,
  image_url,
  website_url,
  twitter_url,
  github_url,
}: TurkishProject) => {
  return (
    <div className="bg-base-100 rounded-2xl min-h-[380px] max-w-[370px] flex flex-col">
      <div className="h-56 w-full bg-gray-400/60 rounded-tl-2xl rounded-tr-2xl relative">
        <Image 
          src={image_url || "/assets/default-project.png"} 
          alt={name} 
          fill={true} 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="rounded-tl-2xl rounded-tr-2xl object-cover" 
        />
        <div className="absolute top-4 left-4">
          <span className="bg-primary text-primary-content px-3 py-1 rounded-full text-sm font-bold">
            {getCategoryLabel(category)}
          </span>
        </div>
        <p className="m-0 absolute bottom-4 left-4 text-2xl md:text-3xl lg:text-4xl font-ppEditorial text-white">
          {name}
        </p>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex-1 mb-6">
          <p className="text-base-content/70 text-sm leading-relaxed">
            {description}
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          {website_url && (
            <a 
              href={website_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
              title="Website"
            >
              <WebsiteIcon className="w-5 h-5" />
            </a>
          )}
          {twitter_url && (
            <a 
              href={twitter_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
              title="X (Twitter)"
            >
              <XIcon className="w-5 h-5" />
            </a>
          )}
          {github_url && (
            <a 
              href={github_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
              title="GitHub"
            >
              <GitHubIcon className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export const ProjectsList = () => {
  const [projects, setProjects] = useState<TurkishProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = categoryDefinitions;

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        let fetchedProjects;
        if (searchTerm.trim()) {
          fetchedProjects = await searchTurkishProjects(searchTerm, selectedCategory);
        } else {
          fetchedProjects = await getAllTurkishProjects(selectedCategory);
        }
        setProjects(fetchedProjects || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(fetchProjects, 300);
    return () => clearTimeout(timeoutId);
  }, [selectedCategory, searchTerm]);

  return (
    <div>
      <div className="container flex flex-col justify-center max-w-[90%] xl:max-w-7xl mx-auto py-12 lg:pt-20 lg:pb-28 xl:px-4 gap-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="self-center lg:self-start w-fit relative">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-center lg:text-left font-ppEditorial">
              Yerli Web3 Girişimleri
            </h2>
            <Image className="absolute -top-3 -right-7" src="/assets/sparkle.png" alt="sparkle" width={32} height={32} />
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Proje adı, açıklama veya kategoride ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full pl-10 pr-4"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`btn btn-sm gap-2 ${
                selectedCategory === category.value
                  ? "btn-primary"
                  : "btn-ghost"
              }`}
            >
              <span>{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="flex flex-col flex-wrap items-center md:flex-row md:justify-center md:items-stretch gap-8 px-4 lg:px-0">
            {Array.isArray(projects) && projects.map((project) => (
              <TurkishProjectCard
                key={project.id}
                {...project}
              />
            ))}
          </div>
        )}

        {(!Array.isArray(projects) || projects.length === 0) && !loading && (
          <div className="text-center py-16">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-lg text-gray-600 mb-2">
              {searchTerm.trim() 
                ? `"${searchTerm}" araması için sonuç bulunamadı.`
                : selectedCategory === "all" 
                ? "Henüz proje eklenmemiş." 
                : `${categories.find(c => c.value === selectedCategory)?.label} kategorisinde proje bulunamadı.`}
            </p>
            {searchTerm.trim() && (
              <p className="text-sm text-gray-500">
                Farklı anahtar kelimeler deneyin veya kategori filtrelerini değiştirin.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 