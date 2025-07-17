import { supabase } from "../database/supabase";

export type UploadAvatarResult = {
  success: boolean;
  url?: string;
  error?: string;
};

export const uploadAvatar = async (file: File, walletAddress: string): Promise<UploadAvatarResult> => {
  try {
    // Dosya boyutu kontrolü (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        error: "Dosya boyutu 5MB'dan küçük olmalıdır."
      };
    }

    // Dosya tipi kontrolü
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: "Sadece resim dosyaları yüklenebilir."
      };
    }

    // Benzersiz dosya adı oluştur
    const fileExtension = file.name.split('.').pop();
    const fileName = `${walletAddress}-${Date.now()}.${fileExtension}`;
    const filePath = `avatars/${fileName}`;

    // Supabase storage'a yükle
    const { data, error } = await supabase.storage
      .from('turkish-web3-assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return {
        success: false,
        error: "Dosya yüklenirken bir hata oluştu."
      };
    }

    // Public URL al
    const { data: urlData } = supabase.storage
      .from('turkish-web3-assets')
      .getPublicUrl(filePath);

    return {
      success: true,
      url: urlData.publicUrl
    };

  } catch (error) {
    console.error('Avatar upload error:', error);
    return {
      success: false,
      error: "Beklenmeyen bir hata oluştu."
    };
  }
};

export const deleteAvatar = async (avatarUrl: string): Promise<boolean> => {
  try {
    // URL'den dosya yolunu çıkar
    const url = new URL(avatarUrl);
    const pathSegments = url.pathname.split('/');
    const filePath = pathSegments.slice(-2).join('/'); // avatars/filename.ext

    const { error } = await supabase.storage
      .from('turkish-web3-assets')
      .remove([filePath]);

    if (error) {
      console.error('Avatar delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Avatar delete error:', error);
    return false;
  }
};

// Varsayılan avatar listesi
export const defaultAvatars = [
  '/assets/avatar-1.png',
  '/assets/avatar-2.png',
  '/assets/avatar-3.png',
  '/assets/default-avatar.png'
]; 