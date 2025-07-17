# Web3Turk - Türkiye'nin Web3 Topluluk Platformu

Web3Turk, Türkiye'deki blockchain projelerini ve yetenekli developer'ları buluşturan topluluk platformudur.

## 🚀 Özellikler

- **Projeler**: Türkiye'deki innovatif Web3 projelerini keşfedin
- **Topluluk**: Builder'lar, creator'lar, investor'lar ve degen'lerin bir araya geldiği platform
- **Profil Sistemi**: Cüzdan bağlayarak kendi profilinizi oluşturun
- **Kategori Filtreleme**: Projeler ve kişiler için gelişmiş filtreleme seçenekleri

## 📁 Proje Yapısı

```
web3turk/
├── packages/nextjs/
│   ├── app/
│   │   ├── components/          # Genel UI component'leri
│   │   │   ├── hero/           # Hero section component'leri
│   │   │   ├── modals/         # Modal component'leri
│   │   │   └── previews/       # Önizleme component'leri
│   │   ├── features/           # Özellik bazlı component'ler
│   │   │   ├── projects/       # Proje yönetimi
│   │   │   ├── people/         # Kişi yönetimi
│   │   │   └── stats/          # İstatistikler
│   │   ├── projects/           # Projeler sayfası
│   │   ├── people/             # Kişiler sayfası
│   │   └── layout.tsx          # Ana layout
│   ├── components/             # Shared component'ler
│   ├── services/              # Servisler
│   │   ├── database/          # Database işlemleri
│   │   ├── web3/              # Web3 konfigürasyonu
│   │   └── store/             # State management
│   ├── hooks/                 # Custom hook'lar
│   ├── utils/                 # Utility fonksiyonları
│   └── styles/                # Stil dosyaları
└── README.md
```

## 🛠️ Teknolojiler

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, DaisyUI
- **Web3**: Wagmi, RainbowKit, Viem
- **Database**: Supabase
- **State Management**: Zustand
- **Deployment**: Vercel

## 🚀 Kurulum

1. Projeyi klonlayın:
```bash
git clone https://github.com/username/web3turk.git
cd web3turk
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Environment variables'ları ayarlayın:
```bash
cp .env.example .env.local
```

4. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

## 📝 Komutlar

```bash
# Geliştirme modunda çalıştır
npm run dev

# Production build
npm run build

# Production'da çalıştır
npm start

# Linting
npm run lint

# Tip kontrolü
npm run next:check-types
```

## 🗂️ Component Yapısı

### Features (Özellikler)
- `features/projects/ProjectsList.tsx` - Proje listesi
- `features/people/PeopleList.tsx` - Kişi listesi
- `features/stats/Stats.tsx` - İstatistikler

### Components (Genel Bileşenler)
- `components/hero/HomepageHero.tsx` - Ana sayfa hero
- `components/modals/CreateProfileModal.tsx` - Profil oluşturma modal'ı
- `components/previews/ProjectsPreview.tsx` - Proje önizleme
- `components/previews/PeoplePreview.tsx` - Kişi önizleme

### Services (Servisler)
- `services/database/data.ts` - Database işlemleri
- `services/database/schema.ts` - TypeScript tipleri
- `services/web3/wagmiConfig.tsx` - Web3 konfigürasyonu

## 🎯 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add some amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

Web3Turk - [@web3turk](https://twitter.com/web3turk)

Proje Linki: [https://github.com/username/web3turk](https://github.com/username/web3turk)
