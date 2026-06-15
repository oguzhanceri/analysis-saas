# AetherAnalytics

AetherAnalytics, web siteleri için AI destekli analiz, performans raporlama ve denetim geçmişi sunan bir Next.js uygulamasıdır.

Kullanıcı bir URL girer, sistem analiz sürecini başlatır, loading ekranında ilerleme ve logları gösterir, ardından rapor sayfasında skorları ve bulguları listeler. Dashboard ekranında ise geçmiş analizler görüntülenir.

## Özellikler

* URL bazlı analiz başlatma
* Loading ekranında canlı progress ve terminal logları
* Rapor ekranında skorlar, bulgular ve Web Vitals tablosu
* Dashboard üzerinde analiz geçmişi
* Prisma + SQLite ile kalıcı analiz kayıtları
* PageSpeed Insights API entegrasyonu
* API kotası dolarsa fallback rapor üretimi
* Next.js App Router API route yapısı

## Kullanılan Teknolojiler

* Next.js
* TypeScript
* Tailwind CSS
* Prisma
* SQLite
* PageSpeed Insights API

## Kurulum

Projeyi klonladıktan sonra bağımlılıkları yükleyin:

```bash
npm install
```

`.env.example` dosyasını `.env` olarak kopyalayın:

```bash
cp .env.example .env
```

`.env` dosyası şu değerleri içermelidir:

```env
DATABASE_URL="file:./dev.db"
PAGESPEED_API_KEY=""
```

`PAGESPEED_API_KEY` opsiyoneldir. Boş bırakılırsa PageSpeed API anonim isteklerle çalışmayı dener. Kota dolarsa sistem otomatik olarak fallback rapor üretir.

## Database Kurulumu

Prisma migration çalıştırın:

```bash
npx prisma migrate dev
```

Prisma Client oluşturun:

```bash
npx prisma generate
```

## Geliştirme Sunucusu

Projeyi lokal olarak çalıştırın:

```bash
npm run dev
```

Tarayıcıda açın:

```txt
http://localhost:3000
```

## Sayfalar

```txt
/          → Landing page
/scanner   → URL analiz başlatma ekranı
/loading   → Analiz progress/log ekranı
/report    → Analiz raporu ekranı
/dashboard → Analiz geçmişi ve özet ekranı
```

## API Endpointleri

Yeni analiz başlatır:

```txt
POST /api/analyze
```

Örnek:

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

Analiz geçmişini listeler:

```txt
GET /api/analyze
```

Analiz durumunu döndürür:

```txt
GET /api/analyze/:id/status
```

Rapor datasını döndürür:

```txt
GET /api/report/:id
```

## PageSpeed Insights

Sistem PageSpeed Insights API üzerinden gerçek Lighthouse verilerini almaya çalışır.

Alınan verilerden şu skorlar üretilir:

```txt
performance
accessibility
seo
best-practices → security olarak kullanılır
ux → performance + accessibility ortalaması
overallScore → tüm skorların ortalaması
```

API kotası dolarsa veya PageSpeed isteği başarısız olursa analiz `failed` olmaz. Sistem fallback rapor üretir ve akış devam eder.

## Build

Production build almak için:

```bash
npm run build
```

Build başarılıysa proje deploy veya push için hazırdır.

## Git Notları

GitHub'a gönderilmemesi gereken dosyalar:

```txt
.env
prisma/dev.db
node_modules
.next
```

GitHub'a gönderilmesi gereken önemli dosyalar:

```txt
.env.example
prisma/schema.prisma
prisma/migrations
src/lib/prisma.ts
src/lib/analyze-store.ts
src/lib/pagespeed.ts
src/app/api
```

## Durum

Bu proje şu anda frontend, API route, Prisma SQLite database, PageSpeed entegrasyonu ve fallback rapor sistemiyle çalışan demo seviyesindedir.
