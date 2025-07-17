# Web3 Türkiye Topluluğu

Türkiye'deki Web3 girişimlerini ve topluluk üyelerini tanıtan platform.

## 🚀 Vercel Deployment

Bu proje Vercel'de deploy edilmek üzere hazırlanmıştır.

### Vercel Ayarları

**Root Directory:** `packages/nextjs`
**Framework Preset:** Next.js
**Build Command:** `npm run build`
**Output Directory:** `.next`
**Install Command:** `npm install`

### Environment Variables

Vercel'de aşağıdaki environment variable'ları ekleyin:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Deployment Adımları

1. Vercel Dashboard'a gidin
2. "New Project" seçin
3. GitHub repo'nuzu bağlayın: `gokmency/web3turkiyetoplulugu`
4. **Root Directory** olarak `packages/nextjs` seçin
5. Environment variables'ları ekleyin
6. Deploy edin

## 🛠️ Local Development

```bash
cd packages/nextjs
npm install
npm run dev
```

## 📦 Build

```bash
npm run build
```

## 🌟 Özellikler

- ✅ Türkçe Web3 girişimleri listesi
- ✅ Topluluk üyeleri profilleri
- ✅ Avatar upload sistemi
- ✅ Arama ve filtreleme
- ✅ Responsive tasarım
- ✅ Supabase entegrasyonu 