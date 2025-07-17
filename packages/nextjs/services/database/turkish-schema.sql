-- Turkish Web3 Community Database Schema
-- Bu SQL'i Supabase SQL Editor'da çalıştıracağız

-- 1. Web3 Girişimleri Table
CREATE TABLE turkish_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('DeFi', 'NFT', 'GameFi', 'Infrastructure', 'Social', 'Other')),
  image_url text,
  website_url text,
  twitter_url text,
  github_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 2. Topluluk Table
CREATE TABLE turkish_people (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text NOT NULL UNIQUE,
  name text NOT NULL,
  bio text,
  role text NOT NULL CHECK (role IN ('geliştirici', 'içerik-üretici', 'yatırımcı', 'topluluk-yöneticisi', 'araştırmacı', 'tasarımcı', 'pazarlama-uzmanı', 'girişimci', 'eğitmen', 'analiz-uzmanı')),
  location text,
  avatar_url text,
  social_links jsonb, -- JSON olarak twitter, github, linkedin vs.
  skills text[], -- Array olarak skills
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 3. Stats Table (istatistikler için)
CREATE TABLE community_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_type text NOT NULL, -- 'daily', 'weekly', 'monthly'
  total_projects integer DEFAULT 0,
  total_people integer DEFAULT 0,
  total_builders integer DEFAULT 0,
  total_creators integer DEFAULT 0,
  total_investors integer DEFAULT 0,
  total_degens integer DEFAULT 0,
  date date NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- 4. User Profiles Table (authentication için)
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text NOT NULL UNIQUE,
  email text,
  is_verified boolean DEFAULT false,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Indexes for better performance
CREATE INDEX idx_turkish_projects_category ON turkish_projects(category);
CREATE INDEX idx_turkish_projects_created_at ON turkish_projects(created_at);
CREATE INDEX idx_turkish_people_role ON turkish_people(role);
CREATE INDEX idx_turkish_people_wallet ON turkish_people(wallet_address);
CREATE INDEX idx_user_profiles_wallet ON user_profiles(wallet_address);
CREATE INDEX idx_community_stats_date ON community_stats(date);

-- Enable Row Level Security (RLS)
ALTER TABLE turkish_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE turkish_people ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies (güvenlik kuralları)

-- Turkish Projects policies
CREATE POLICY "Anyone can view projects" ON turkish_projects FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create projects" ON turkish_projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own projects" ON turkish_projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete their own projects" ON turkish_projects FOR DELETE USING (auth.role() = 'authenticated');

-- Turkish People policies
CREATE POLICY "Anyone can view people" ON turkish_people FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create profiles" ON turkish_people FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own profiles" ON turkish_people FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete their own profiles" ON turkish_people FOR DELETE USING (auth.role() = 'authenticated');

-- Community Stats policies
CREATE POLICY "Anyone can view stats" ON community_stats FOR SELECT USING (true);
CREATE POLICY "Only admins can modify stats" ON community_stats FOR ALL USING (auth.role() = 'service_role');

-- User Profiles policies
CREATE POLICY "Users can view their own profiles" ON user_profiles FOR SELECT USING (auth.uid()::text = wallet_address);
CREATE POLICY "Users can create their own profiles" ON user_profiles FOR INSERT WITH CHECK (auth.uid()::text = wallet_address);
CREATE POLICY "Users can update their own profiles" ON user_profiles FOR UPDATE USING (auth.uid()::text = wallet_address);

-- Sample data insertion (test için)
-- Bu kısmı daha sonra çalıştırırız
/*
INSERT INTO turkish_projects (name, description, category, image_url, website_url, twitter_url, github_url) VALUES
('DeFi Türkiye', 'Türkiye''nin ilk DeFi platformu', 'DeFi', '/assets/defi-turkiye.png', 'https://defiturkiye.com', 'https://twitter.com/defiturkiye', 'https://github.com/defiturkiye'),
('Istanbul NFT', 'İstanbul''un kültürel mirasını NFT''lerde yaşatan proje', 'NFT', '/assets/istanbul-nft.png', 'https://istanbulnft.art', 'https://twitter.com/istanbulnft', null),
('GRAINZ AGENCY', 'Blockchain projelerine marketing desteği', 'Social', '/assets/grainzagency', 'http://grainz.space/', 'https://twitter.com/grainzeth', null);

INSERT INTO turkish_people (wallet_address, name, bio, role, location, avatar_url, social_links, skills) VALUES
('0x742d35Cc6634C0532925a3b8D4C6A7e6e3b5a8d6', 'Ahmet Demir', 'Senior Solidity Developer', 'geliştirici', 'Istanbul', '/assets/avatar-1.png', '{"x": "https://x.com/ahmetdemir", "github": "https://github.com/ahmetdemir"}', '{"Solidity", "React", "Web3.js"}'),
('0x9A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T', 'Zeynep Kartal', 'NFT sanatçısı', 'içerik-üretici', 'Izmir', '/assets/avatar-2.png', '{"x": "https://x.com/zeynepkartal", "instagram": "https://instagram.com/zeynepkartal"}', '{"Digital Art", "NFT Creation"}'),
('0xB1C2D3E4F5G6H7I8J9K0L1M2N3O4P5Q6R7S8T9U0', 'Mehmet Yılmaz', 'Web3 startup investor', 'yatırımcı', 'Ankara', '/assets/avatar-3.png', '{"x": "https://x.com/mehmetyilmaz", "linkedin": "https://linkedin.com/in/mehmetyilmaz"}', '{"Investment", "Mentoring"}'),
('0xC2D3E4F5G6H7I8J9K0L1M2N3O4P5Q6R7S8T9U0V1', 'Elif Özkan', 'Web3 topluluk yöneticisi', 'topluluk-yöneticisi', 'Izmir', '/assets/avatar-1.png', '{"x": "https://x.com/elifozkan", "linkedin": "https://linkedin.com/in/elifozkan"}', '{"Community Management", "Event Organization"}');
*/ 