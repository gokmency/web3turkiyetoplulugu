"use client";

import { useState, useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import { createTurkishPerson, getTurkishPersonByWallet } from "~~/services/database/data";
import { TurkishPerson } from "~~/services/database/schema";
import { uploadAvatar, defaultAvatars, UploadAvatarResult } from "~~/services/storage/avatarUpload";

interface CreateProfileModalProps {
  onProfileCreated?: (profile: TurkishPerson) => void;
}

// Rol tanımları
const roleOptions = [
  { value: "geliştirici", label: "🔨 Geliştirici", description: "Smart contract, DApp, Frontend/Backend geliştirici" },
  { value: "içerik-üretici", label: "🎨 İçerik Üretici", description: "Content creator, influencer, eğitim içerikleri" },
  { value: "tasarımcı", label: "🎯 Tasarımcı", description: "UI/UX, grafik tasarım, brand tasarım" },
  { value: "pazarlama-uzmanı", label: "📢 Pazarlama Uzmanı", description: "Marketing, sosyal medya, community building" },
  { value: "araştırmacı", label: "🔬 Araştırmacı", description: "Blockchain research, tokenomics, analiz" },
  { value: "girişimci", label: "🚀 Girişimci", description: "Startup founder, proje yöneticisi" },
  { value: "yatırımcı", label: "💰 Yatırımcı", description: "Angel investor, VC, trader" },
  { value: "eğitmen", label: "👨‍🏫 Eğitmen", description: "Blockchain eğitmeni, workshop lideri" },
  { value: "analiz-uzmanı", label: "📊 Analiz Uzmanı", description: "Data analysis, onchain analytics" },
  { value: "topluluk-yöneticisi", label: "🌟 Topluluk Yöneticisi", description: "Community manager, moderatör" },
] as const;

export const CreateProfileModal = ({ onProfileCreated }: CreateProfileModalProps) => {
  const { address, isConnected } = useAccount();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    role: "geliştirici" as TurkishPerson["role"],
    location: "",
    avatar_url: "",
    x_url: "",
    github_url: "",
    linkedin_url: "",
    website_url: "",
    youtube_url: "",
    medium_url: "",
    instagram_url: "",
    skills: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [existingProfile, setExistingProfile] = useState<TurkishPerson | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string>("");
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);

  useEffect(() => {
    const checkExistingProfile = async () => {
      if (isConnected && address) {
        try {
          const profile = await getTurkishPersonByWallet(address);
          setExistingProfile(profile || null);
        } catch (error) {
          console.error("Error checking existing profile:", error);
        }
      }
    };

    checkExistingProfile();
  }, [address, isConnected]);

  // Avatar yükleme fonksiyonu
  const handleAvatarUpload = async (file: File) => {
    if (!address) return;
    
    setUploading(true);
    setError("");
    
    try {
      const result: UploadAvatarResult = await uploadAvatar(file, address);
      
      if (result.success && result.url) {
        setFormData(prev => ({ ...prev, avatar_url: result.url! }));
        setSelectedAvatar(result.url);
        setShowAvatarOptions(false);
      } else {
        setError(result.error || "Avatar yüklenirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Avatar upload error:", error);
      setError("Avatar yüklenirken beklenmeyen bir hata oluştu.");
    } finally {
      setUploading(false);
    }
  };

  // Dosya seçildiğinde
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleAvatarUpload(file);
    }
  };

  // Varsayılan avatar seçimi
  const handleDefaultAvatarSelect = (avatarUrl: string) => {
    setFormData(prev => ({ ...prev, avatar_url: avatarUrl }));
    setSelectedAvatar(avatarUrl);
    setShowAvatarOptions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !address) {
      setError("Lütfen önce cüzdanınızı bağlayın.");
      return;
    }

    if (!formData.name.trim()) {
      setError("Ad alanı zorunludur.");
      return;
    }

    if (existingProfile) {
      setError("Bu cüzdan adresi için zaten bir profil mevcut.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const skillsArray = formData.skills
        .split(",")
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);

      const profileData = {
        wallet_address: address,
        name: formData.name.trim(),
        bio: formData.bio.trim() || undefined,
        role: formData.role,
        location: formData.location.trim() || undefined,
        avatar_url: formData.avatar_url.trim() || undefined,
        social_links: {
          x: formData.x_url.trim() || undefined,
          github: formData.github_url.trim() || undefined,
          linkedin: formData.linkedin_url.trim() || undefined,
          website: formData.website_url.trim() || undefined,
          youtube: formData.youtube_url.trim() || undefined,
          medium: formData.medium_url.trim() || undefined,
          instagram: formData.instagram_url.trim() || undefined,
        },
        skills: skillsArray.length > 0 ? skillsArray : undefined,
      };

      const createdProfile = await createTurkishPerson(profileData);
      
      if (onProfileCreated && createdProfile) {
        onProfileCreated(createdProfile);
      }

      // Close modal
      const modal = document.getElementById('create-profile-modal') as HTMLDialogElement;
      if (modal) modal.close();

      // Reset form
      setFormData({
        name: "",
        bio: "",
        role: "geliştirici",
        location: "",
        avatar_url: "",
        x_url: "",
        github_url: "",
        linkedin_url: "",
        website_url: "",
        youtube_url: "",
        medium_url: "",
        instagram_url: "",
        skills: "",
      });

      // Refresh the page to show the new profile
      window.location.reload();
    } catch (error) {
      console.error("Error creating profile:", error);
      setError("Profil oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (existingProfile) {
    return (
      <dialog id="create-profile-modal" className="modal">
        <div className="modal-box w-11/12 max-w-2xl">
          <h3 className="font-bold text-lg mb-4">Profil Mevcut</h3>
          <p className="text-gray-600 mb-4">
            Bu cüzdan adresi için zaten bir profil mevcut. Profilinizi güncellemek için lütfen iletişime geçin.
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Kapat</button>
            </form>
          </div>
        </div>
      </dialog>
    );
  }

  return (
    <dialog id="create-profile-modal" className="modal">
      <div className="modal-box w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-xl">Turkish Web3 Profili Oluştur</h3>
          <form method="dialog">
            <button type="button" className="btn btn-sm btn-circle btn-ghost">✕</button>
          </form>
        </div>
        
        {error && (
          <div className="alert alert-error mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Bölümü */}
          <div className="card bg-base-200 p-6">
            <h4 className="font-semibold text-lg mb-4">Profil Fotoğrafı</h4>
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar Preview */}
              <div className="avatar">
                <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img 
                    src={formData.avatar_url || selectedAvatar || "/assets/default-avatar.png"}
                    alt="Avatar"
                    className="rounded-full object-cover"
                  />
                </div>
              </div>
              
              {/* Avatar Options */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn btn-primary btn-sm"
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Yükleniyor...
                      </>
                    ) : (
                      <>
                        📁 Dosyadan Yükle
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setShowAvatarOptions(!showAvatarOptions)}
                    className="btn btn-outline btn-sm"
                  >
                    🎨 Hazır Avatar
                  </button>
                </div>
                
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {/* Default Avatar Options */}
                {showAvatarOptions && (
                  <div className="grid grid-cols-4 gap-2 p-4 border rounded-lg bg-base-100">
                    {defaultAvatars.map((avatar, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleDefaultAvatarSelect(avatar)}
                        className={`avatar hover:scale-110 transition-transform ${
                          selectedAvatar === avatar ? 'ring-2 ring-primary' : ''
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full">
                          <img src={avatar} alt={`Avatar ${index + 1}`} className="rounded-full" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                
                <p className="text-sm text-gray-600">
                  Maksimum 5MB, JPG/PNG/GIF formatları desteklenir.
                </p>
              </div>
            </div>
          </div>

          {/* Temel Bilgiler */}
          <div className="card bg-base-200 p-6">
            <h4 className="font-semibold text-lg mb-4">Temel Bilgiler</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Ad Soyad *</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="Adınız ve soyadınız"
                  required
                />
              </div>

              {/* Location */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Konum</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="İstanbul, Ankara, İzmir..."
                />
              </div>
            </div>

            {/* Bio */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text font-medium">Bio</span>
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="textarea textarea-bordered h-24 resize-none"
                placeholder="Kendinizi kısaca tanıtın, Web3'teki deneyimlerinizden bahsedin..."
                maxLength={300}
              />
              <label className="label">
                <span className="label-text-alt">{formData.bio.length}/300</span>
              </label>
            </div>
          </div>

          {/* Rol ve Yetenekler */}
          <div className="card bg-base-200 p-6">
            <h4 className="font-semibold text-lg mb-4">Rol ve Yetenekler</h4>
            
            {/* Role Selection */}
            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text font-medium">Rolünüz *</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {roleOptions.map((option) => (
                  <label key={option.value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value={option.value}
                      checked={formData.role === option.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className={`card card-compact border-2 p-3 transition-all hover:border-primary ${
                      formData.role === option.value 
                        ? 'border-primary bg-primary/10' 
                        : 'border-base-300'
                    }`}>
                      <div className="card-body">
                        <h5 className="font-medium text-sm">{option.label}</h5>
                        <p className="text-xs text-gray-600">{option.description}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Skills - tüm roller için */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Yetenekler {formData.role === "geliştirici" ? "(Teknik)" : "(Uzmanlık Alanları)"}
                </span>
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                placeholder={
                  formData.role === "geliştirici" 
                    ? "Solidity, React, Node.js, Web3.js, Hardhat"
                    : formData.role === "tasarımcı"
                    ? "Figma, Photoshop, UI/UX, Brand Design"
                    : formData.role === "pazarlama-uzmanı"
                    ? "Social Media, Content Marketing, SEO, Growth Hacking"
                    : "Uzmanlık alanlarınızı virgülle ayırarak yazın"
                }
              />
              <label className="label">
                <span className="label-text-alt">Yeteneklerinizi virgülle ayırarak yazın</span>
              </label>
            </div>
          </div>

          {/* Sosyal Medya */}
          <div className="card bg-base-200 p-6">
            <h4 className="font-semibold text-lg mb-4">Sosyal Medya & İletişim</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">𝕏 (X / Twitter)</span>
                </label>
                <input
                  type="url"
                  name="x_url"
                  value={formData.x_url}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="https://x.com/kullanici"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">GitHub</span>
                </label>
                <input
                  type="url"
                  name="github_url"
                  value={formData.github_url}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="https://github.com/kullanici"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">LinkedIn</span>
                </label>
                <input
                  type="url"
                  name="linkedin_url"
                  value={formData.linkedin_url}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="https://linkedin.com/in/kullanici"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Website</span>
                </label>
                <input
                  type="url"
                  name="website_url"
                  value={formData.website_url}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="https://websitesi.com"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">YouTube</span>
                </label>
                <input
                  type="url"
                  name="youtube_url"
                  value={formData.youtube_url}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="https://youtube.com/@kanal"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Medium</span>
                </label>
                <input
                  type="url"
                  name="medium_url"
                  value={formData.medium_url}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="https://medium.com/@kullanici"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Instagram</span>
                </label>
                <input
                  type="url"
                  name="instagram_url"
                  value={formData.instagram_url}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="https://instagram.com/kullanici"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="modal-action pt-6">
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading || !isConnected || uploading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Profil Oluşturuluyor...
                </>
              ) : (
                <>
                  🚀 Profil Oluştur
                </>
              )}
            </button>
            <form method="dialog">
              <button type="button" className="btn btn-lg">
                İptal
              </button>
            </form>
          </div>
        </form>
      </div>
    </dialog>
  );
}; 