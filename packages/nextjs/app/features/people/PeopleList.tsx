"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAccount } from "wagmi";
import { getAllTurkishPeople, getTurkishPersonByWallet, searchTurkishPeople } from "~~/services/database/data";
import { TurkishPerson } from "~~/services/database/schema";
import { XIcon } from "~~/components/assets/XIcon";
import { GitHubIcon } from "~~/components/assets/GitHubIcon";
import { LinkedInIcon } from "~~/components/assets/LinkedInIcon";
import { InstagramIcon } from "~~/components/assets/InstagramIcon";

const PersonCard = ({
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
      case "tasarımcı":
        return "bg-pink-100 text-pink-800";
      case "pazarlama-uzmanı":
        return "bg-red-100 text-red-800";
      case "araştırmacı":
        return "bg-indigo-100 text-indigo-800";
      case "girişimci":
        return "bg-amber-100 text-amber-800";
      case "yatırımcı":
        return "bg-green-100 text-green-800";
      case "eğitmen":
        return "bg-teal-100 text-teal-800";
      case "analiz-uzmanı":
        return "bg-cyan-100 text-cyan-800";
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
      case "tasarımcı":
        return "Tasarımcı";
      case "pazarlama-uzmanı":
        return "Pazarlama Uzmanı";
      case "araştırmacı":
        return "Araştırmacı";
      case "girişimci":
        return "Girişimci";
      case "yatırımcı":
        return "Yatırımcı";
      case "eğitmen":
        return "Eğitmen";
      case "analiz-uzmanı":
        return "Analiz Uzmanı";
      case "topluluk-yöneticisi":
        return "Topluluk Yöneticisi";
      default:
        return role;
    }
  };

  return (
    <div className="bg-base-100 rounded-2xl min-h-[420px] max-w-[370px] flex flex-col">
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
          <p className="text-base-content/70 text-sm leading-relaxed">
            {bio}
          </p>
        </div>

        {/* Skills */}
        {skills && Array.isArray(skills) && skills.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span key={index} className="bg-base-200 text-base-content px-2 py-1 rounded-md text-xs">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Social Links */}
        {social_links && (
          <div className="flex gap-4 justify-center">
            {social_links.x && (
              <a 
                href={social_links.x} 
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
            {social_links.instagram && (
              <a 
                href={social_links.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                title="Instagram"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const PeopleList = () => {
  const [people, setPeople] = useState<TurkishPerson[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { address, isConnected } = useAccount();
  const [userProfile, setUserProfile] = useState<TurkishPerson | null>(null);

  const roles = [
    { value: "all", label: "Tümü", icon: "👥" },
    { value: "geliştirici", label: "Geliştirici", icon: "🔨" },
    { value: "içerik-üretici", label: "İçerik Üretici", icon: "🎨" },
    { value: "tasarımcı", label: "Tasarımcı", icon: "🎯" },
    { value: "pazarlama-uzmanı", label: "Pazarlama Uzmanı", icon: "📢" },
    { value: "araştırmacı", label: "Araştırmacı", icon: "🔬" },
    { value: "girişimci", label: "Girişimci", icon: "🚀" },
    { value: "yatırımcı", label: "Yatırımcı", icon: "💰" },
    { value: "eğitmen", label: "Eğitmen", icon: "👨‍🏫" },
    { value: "analiz-uzmanı", label: "Analiz Uzmanı", icon: "📊" },
    { value: "topluluk-yöneticisi", label: "Topluluk Yöneticisi", icon: "🌟" },
  ];

  useEffect(() => {
    const fetchPeople = async () => {
      setLoading(true);
      try {
        let fetchedPeople;
        if (searchTerm.trim()) {
          fetchedPeople = await searchTurkishPeople(searchTerm, selectedRole);
        } else {
          fetchedPeople = await getAllTurkishPeople(selectedRole);
        }
        setPeople(fetchedPeople || []);
      } catch (error) {
        console.error("Error fetching people:", error);
        setPeople([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(fetchPeople, 300);
    return () => clearTimeout(timeoutId);
  }, [selectedRole, searchTerm]);

  useEffect(() => {
    const checkUserProfile = async () => {
      if (isConnected && address) {
        try {
          const profile = await getTurkishPersonByWallet(address);
          setUserProfile(profile || null);
        } catch (error) {
          console.error("Error checking user profile:", error);
        }
      }
    };

    checkUserProfile();
  }, [address, isConnected]);

  return (
    <div className="bg-base-300">
      <div className="container flex flex-col justify-center max-w-[90%] xl:max-w-7xl mx-auto py-12 lg:pt-20 lg:pb-28 xl:px-4 gap-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="self-center lg:self-start w-fit relative">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-center lg:text-left font-ppEditorial">
              Turkish Web3 People
            </h2>
            <Image className="absolute -top-3 -right-7" src="/assets/sparkle.png" alt="sparkle" width={32} height={32} />
          </div>
          
          {/* Create Profile Button */}
          {isConnected && !userProfile && (
            <button 
              className="btn btn-primary btn-md"
              onClick={() => {
                // This will be handled by the CreateProfileModal
                const modal = document.getElementById('create-profile-modal') as HTMLDialogElement;
                if (modal) modal.showModal();
              }}
            >
              Profil Oluştur
            </button>
          )}
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
              placeholder="İsim, bio, konum veya yeteneklerde ara..."
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

        {/* Role Filter */}
        <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
          {roles.map((role) => (
            <button
              key={role.value}
              onClick={() => setSelectedRole(role.value)}
              className={`btn btn-sm gap-2 ${
                selectedRole === role.value
                  ? "btn-primary"
                  : "btn-ghost"
              }`}
            >
              <span>{role.icon}</span>
              {role.label}
            </button>
          ))}
        </div>

        {/* People Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="flex flex-col flex-wrap items-center md:flex-row md:justify-center md:items-stretch gap-8 px-4 lg:px-0">
            {Array.isArray(people) && people.map((person) => (
              <PersonCard
                key={person.id}
                {...person}
              />
            ))}
          </div>
        )}

        {(!Array.isArray(people) || people.length === 0) && !loading && (
          <div className="text-center py-16">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-lg text-gray-600 mb-2">
              {searchTerm.trim() 
                ? `"${searchTerm}" araması için sonuç bulunamadı.`
                : selectedRole === "all" 
                ? "Henüz kişi eklenmemiş." 
                : `${roles.find(r => r.value === selectedRole)?.label} rolünde kişi bulunamadı.`}
            </p>
            {searchTerm.trim() && (
              <p className="text-sm text-gray-500">
                Farklı anahtar kelimeler deneyin veya filtreleri değiştirin.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 