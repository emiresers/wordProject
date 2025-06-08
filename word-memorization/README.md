# Kelime Ezberleme Sistemi

Bilimsel olarak desteklenen aralıklı tekrar algoritması ile kullanıcıların kelime öğrenmesini ve kalıcı olarak hatırlamasını sağlayan kapsamlı bir kelime ezberleme sistemi.

## Özellikler

- Kullanıcı kimlik doğrulama ve yönetimi
- Görseller ve örneklerle kelime yönetimi
- Aralıklı tekrar ile akıllı quiz sistemi
- Performans analitiği ve raporlama
- Kişiselleştirilebilir öğrenme ayarları

## Teknik Yığın

- Frontend: React ve TypeScript
- Backend: Node.js ve Express
- Veritabanı: PostgreSQL
- Kimlik Doğrulama: JWT
- Dosya Depolama: Görseller için yerel depolama

## Proje Yapısı

```
word-memorization/
├── client/                 # Frontend React uygulaması
├── server/                 # Backend Node.js uygulaması
├── database/               # Veritabanı migrasyonları ve seed dosyaları
└── docs/                   # Proje dokümantasyonu
```

## Kurulum Talimatları

1. Repoyu klonlayın
2. Bağımlılıkları yükleyin:
   ```bash
   # Backend bağımlılıklarını yükle
   cd server
   npm install

   # Frontend bağımlılıklarını yükle
   cd ../client
   npm install
   ```
3. Ortam değişkenlerini ayarlayın
4. Geliştirme sunucularını başlatın:
   ```bash
   # Backend'i başlat
   cd server
   npm run dev

   # Frontend'i başlat
   cd ../client
   npm start
   ```

## Geliştirme Kuralları

- TypeScript en iyi uygulamalarına uyun
- Kritik fonksiyonlar için birim testleri yazın
- Sürüm kontrolü için Git akışını kullanın
- Proje yönetiminde Scrum metodolojisini takip edin

## Lisans

MIT 