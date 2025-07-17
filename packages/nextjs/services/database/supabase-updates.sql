-- Supabase Database Updates
-- Bu SQL komutlarını Supabase SQL Editor'da çalıştırın

-- 1. Role constraint'ini güncelle (yeni roller ekle)
ALTER TABLE turkish_people 
DROP CONSTRAINT IF EXISTS turkish_people_role_check;

ALTER TABLE turkish_people 
ADD CONSTRAINT turkish_people_role_check 
CHECK (role IN (
  'geliştirici', 
  'içerik-üretici', 
  'yatırımcı', 
  'topluluk-yöneticisi', 
  'araştırmacı', 
  'tasarımcı', 
  'pazarlama-uzmanı', 
  'girişimci', 
  'eğitmen', 
  'analiz-uzmanı'
));

-- 2. Mevcut mock data'daki twitter -> x güncellemesi (eğer zaten var ise)
UPDATE turkish_people 
SET social_links = jsonb_set(
  social_links - 'twitter', 
  '{x}', 
  social_links->'twitter'
)
WHERE social_links ? 'twitter';

-- 3. Storage bucket oluşturma (eğer henüz yoksa)
-- Bu kısmı Supabase Dashboard'dan Storage bölümünden yapın:
-- Bucket Name: turkish-web3-assets
-- Public: true

-- 4. Bucket policy (public access için)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('turkish-web3-assets', 'turkish-web3-assets', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Storage policies (avatar upload için)
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'turkish-web3-assets');
CREATE POLICY "Authenticated users can upload avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'turkish-web3-assets' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update their own avatars" ON storage.objects FOR UPDATE USING (bucket_id = 'turkish-web3-assets' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete their own avatars" ON storage.objects FOR DELETE USING (bucket_id = 'turkish-web3-assets' AND auth.role() = 'authenticated'); 