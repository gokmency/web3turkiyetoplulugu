"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getAllTurkishProjects } from "~~/services/database/data";
import { TurkishProject } from "~~/services/database/schema";
import { WebsiteIcon } from "~~/components/assets/WebsiteIcon";
import { XIcon } from "~~/components/assets/XIcon";
import { GitHubIcon } from "~~/components/assets/GitHubIcon";
import { getCategoryLabel } from "~~/utils/categoryTranslations";

const ProjectPreviewCard = ({
  name,
  description,
  category,
  image_url,
  website_url,
  twitter_url,
  github_url,
}: TurkishProject) => {
  return (
    <div className="bg-base-100 rounded-2xl min-h-[380px] max-w-[370px] flex flex-col shadow-md hover:shadow-lg transition-shadow">
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

export const ProjectsPreview = () => {
  const [projects, setProjects] = useState<TurkishProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const fetchedProjects = await getAllTurkishProjects();
        setProjects((fetchedProjects || []).slice(0, 3)); // Show only first 3 projects
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="bg-base-100">
      <div className="container flex flex-col justify-center max-w-[90%] xl:max-w-7xl mx-auto py-16 lg:py-24 xl:px-4 gap-8">
        <div className="text-center">
          <div className="relative inline-block">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-ppEditorial mb-4">
              Öne Çıkan Projeler
            </h2>
            <Image className="absolute -top-3 -right-7" src="/assets/sparkle.png" alt="sparkle" width={32} height={32} />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Türkiye'deki Web3 ekosisteminin en innovatif projelerini keşfedin
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="flex flex-col flex-wrap items-center md:flex-row md:justify-center md:items-stretch gap-8 px-4 lg:px-0">
            {Array.isArray(projects) && projects.map((project) => (
              <ProjectPreviewCard
                key={project.id}
                {...project}
              />
            ))}
          </div>
        )}

        {(!Array.isArray(projects) || projects.length === 0) && !loading && (
          <div className="text-center py-16">
            <p className="text-lg text-gray-600">
              Henüz proje eklenmemiş.
            </p>
          </div>
        )}

        {Array.isArray(projects) && projects.length > 0 && (
          <div className="text-center">
            <Link href="/projects">
              <button className="btn btn-primary btn-lg">
                Tüm Projeleri Görüntüle
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}; 