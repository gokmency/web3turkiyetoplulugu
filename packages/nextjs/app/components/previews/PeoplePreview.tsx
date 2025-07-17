"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getAllTurkishPeople } from "~~/services/database/data";
import { TurkishPerson } from "~~/services/database/schema";
import { XIcon } from "~~/components/assets/XIcon";
import { GitHubIcon } from "~~/components/assets/GitHubIcon";
import { LinkedInIcon } from "~~/components/assets/LinkedInIcon";

const PersonPreviewCard = ({
  name,
  bio,
  role,
  location,
  avatar_url,
  social_links,
  skills,
}: TurkishPerson) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case "geliştirici":
        return "bg-blue-100 text-blue-800";
      case "içerik-üretici":
        return "bg-purple-100 text-purple-800";
      case "yatırımcı":
        return "bg-green-100 text-green-800";
      case "topluluk-yöneticisi":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "geliştirici":
        return "Geliştirici";
      case "içerik-üretici":
        return "İçerik Üretici";
      case "yatırımcı":
        return "Yatırımcı";
      case "topluluk-yöneticisi":
        return "Topluluk Yöneticisi";
      default:
        return role;
    }
  };

  return (
    <div className="bg-base-100 rounded-2xl min-h-[380px] max-w-[370px] flex flex-col shadow-md hover:shadow-lg transition-shadow">
      <div className="p-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gray-400/60 relative overflow-hidden">
            <Image 
              src={avatar_url || "/assets/default-avatar.png"} 
              alt={name} 
              fill={true} 
              sizes="64px"
              className="object-cover" 
            />
          </div>
          <div>
            <h3 className="text-xl font-ppEditorial font-bold mb-1">{name}</h3>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(role)}`}>
                {getRoleLabel(role)}
              </span>
              {location && (
                <span className="text-sm text-gray-500">📍 {location}</span>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="flex-1 mb-4">
          <p className="text-base-content/70 text-sm leading-relaxed line-clamp-3">
            {bio}
          </p>
        </div>

        {/* Skills */}
        {skills && Array.isArray(skills) && skills.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 3).map((skill, index) => (
                <span key={index} className="bg-base-200 text-base-content px-2 py-1 rounded-md text-xs">
                  {skill}
                </span>
              ))}
              {skills.length > 3 && (
                <span className="bg-base-200 text-base-content px-2 py-1 rounded-md text-xs">
                  +{skills.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Social Links */}
        {social_links && (
          <div className="flex gap-4 justify-center">
            {social_links.twitter && (
              <a 
                href={social_links.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                title="X (Twitter)"
              >
                <XIcon className="w-5 h-5" />
              </a>
            )}
            {social_links.github && (
              <a 
                href={social_links.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                title="GitHub"
              >
                <GitHubIcon className="w-5 h-5" />
              </a>
            )}
            {social_links.linkedin && (
              <a 
                href={social_links.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                title="LinkedIn"
              >
                <LinkedInIcon className="w-5 h-5" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const PeoplePreview = () => {
  const [people, setPeople] = useState<TurkishPerson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPeople = async () => {
      setLoading(true);
      try {
        const fetchedPeople = await getAllTurkishPeople();
        setPeople((fetchedPeople || []).slice(0, 3)); // Show only first 3 people
      } catch (error) {
        console.error("Error fetching people:", error);
        setPeople([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPeople();
  }, []);

  return (
    <div className="bg-base-300">
      <div className="container flex flex-col justify-center max-w-[90%] xl:max-w-7xl mx-auto py-16 lg:py-24 xl:px-4 gap-8">
        <div className="text-center">
          <div className="relative inline-block">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-ppEditorial mb-4">
              Topluluk Üyeleri
            </h2>
            <Image className="absolute -top-3 -right-7" src="/assets/sparkle.png" alt="sparkle" width={32} height={32} />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Türkiye'deki Web3 topluluğunun aktif üyelerini tanıyın
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="flex flex-col flex-wrap items-center md:flex-row md:justify-center md:items-stretch gap-8 px-4 lg:px-0">
            {Array.isArray(people) && people.map((person) => (
              <PersonPreviewCard
                key={person.id}
                {...person}
              />
            ))}
          </div>
        )}

        {(!Array.isArray(people) || people.length === 0) && !loading && (
          <div className="text-center py-16">
            <p className="text-lg text-gray-600">
              Henüz kişi eklenmemiş.
            </p>
          </div>
        )}

        {Array.isArray(people) && people.length > 0 && (
          <div className="text-center">
            <Link href="/people">
              <button className="btn btn-primary btn-lg">
                Tüm Üyeleri Görüntüle
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}; 