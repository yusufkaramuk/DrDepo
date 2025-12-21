# İlaç Stok Takip Sistemi 💊

Modern, kullanıcı dostu ve güvenli bir web uygulaması. Evinizdeki ilaçları dijital ortamda takip edin, son kullanma tarihlerini kontrol edin ve stok yönetiminizi kolaylaştırın.

**🌐 Canlı Demo:** [https://ilac-stok-takip.web.app](https://ilac-stok-takip.web.app)

## ✨ Özellikler

### 🔐 Güvenli Kullanıcı Yönetimi
- **Firebase Authentication**: E-posta/şifre ile güvenli giriş
- **Kullanıcı İzolasyonu**: Her kullanıcı sadece kendi verilerini görür
- **Şifre Sıfırlama**: E-posta ile şifre kurtarma
- **Oturum Yönetimi**: Güvenli giriş/çıkış

### 📝 İlaç Yönetimi
- **CRUD İşlemleri**: İlaç ekleme, düzenleme, silme ve listeleme
- **Etken Madde Takibi**: Her ilaç için 3 farklı etken madde kaydı
- **Akıllı Gruplama**: Aynı bilgilere sahip ilaçlar otomatik gruplanır (x2, x3 gösterimi)
- **Toplu Ekleme**: Birden fazla ilacı tek seferde ekleyin
- **Gelişmiş Silme**: Grup ilaçlarından istediğiniz kadarını silin

### 🔍 Akıllı Arama ve Sıralama
- **Fuzzy Search**: Yanlış yazımlara toleranslı arama (Levenshtein algoritması)
- **Çoklu Alan Araması**: İlaç adı ve tüm etken maddelerde arama
- **Gelişmiş Sıralama**: 8 farklı sıralama seçeneği
  - 🕐 Tarih bazlı (En yeni/eski)
  - 🔤 Alfabetik (A-Z, Z-A)
  - 📅 Son kullanma tarihi (Yakında bitecek/uzun süreliler)
  - 📦 Kopya sayısı (Çok/az olanlar)
- **Gerçek Zamanlı Filtreleme**: Yazdıkça sonuçları görün

### ⏰ Son Kullanma Takibi
- **Otomatik Uyarılar**: 
  - 🔴 Geçmiş ilaçlar (kırmızı)
  - 🟠 30 gün içinde bitecekler (turuncu)
  - 🟢 İyi durumda olanlar (yeşil)
- **Ay/Yıl Formatı**: Pratik tarih girişi
- **Gün Sayacı**: Yakında bitecek ilaçlar için kalan gün gösterimi
- **Türkçe Tarih**: "Aralık 2025" formatında gösterim

### ☁️ Bulut Senkronizasyonu
- **Firebase Firestore**: Gerçek zamanlı veri senkronizasyonu
- **Çoklu Cihaz Desteği**: Telefon, tablet, bilgisayar - her yerden erişim
- **Kullanıcı Bazlı Veri**: Her kullanıcının verileri izole
- **LocalStorage Yedekleme**: Offline çalışma desteği
- **Otomatik Geçiş**: Bulut/Yerel mod arası kolay geçiş

### 💾 Veri Yönetimi
- **JSON Export**: Verilerinizi yedekleyin
- **JSON Import**: Önceki yedeklerden geri yükleyin
- **Firebase Import**: JSON'dan Firebase'e toplu aktarım
- **Otomatik Kaydetme**: Her değişiklik anında kaydedilir

### 📱 Progressive Web App (PWA)
- **Ana Ekrana Ekleme**: Telefonda uygulama gibi çalışır
- **Offline Çalışma**: İnternet olmadan kullanılabilir
- **Network-First Caching**: Her zaman güncel versiyon
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu
- **Install Prompt**: Kolay kurulum

### 🎨 Modern Arayüz
- **Mor Gradient Tema**: Şık ve profesyonel tasarım
- **Pill Badge'ler**: Etken maddeleri görsel gösterim
- **Smooth Animasyonlar**: Akıcı geçişler ve efektler
- **Accessibility**: Erişilebilir tasarım
- **Türkçe UI**: Tam Türkçe arayüz

## 🚀 Hızlı Başlangıç

### Ön Gereksinimler
- Node.js 18+ ve npm
- Firebase hesabı (ücretsiz)

### Kurulum

1. **Projeyi Klonlayın**
```bash
git clone https://github.com/yusufkaramuk/ilacStokTakipSistemi.git
cd ilacStokTakipSistemi
```

2. **Bağımlılıkları Yükleyin**
```bash
npm install
```

3. **Firebase Yapılandırması**

`.env.example` dosyasını `.env` olarak kopyalayın:
```bash
cp .env.example .env
```

Firebase bilgilerinizi `.env` dosyasına girin:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. **Firebase Kurulumu**

- [FIREBASE_SETUP.md](FIREBASE_SETUP.md) - Firebase proje kurulumu
- [AUTHENTICATION_SETUP.md](AUTHENTICATION_SETUP.md) - Authentication aktifleştirme

5. **Uygulamayı Başlatın**
```bash
npm run dev
```

Tarayıcınızda `http://localhost:5173` adresini açın.

## 📱 Deployment

### Firebase Hosting (Önerilen)

```bash
# Build
npm run build

# Deploy
firebase deploy
```

Detaylı talimatlar: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

## 🛠️ Teknolojiler

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first CSS

### Backend & Database
- **Firebase Authentication** - Kullanıcı yönetimi
- **Firebase Firestore** - NoSQL cloud database
- **Firebase Hosting** - Static web hosting

### Algorithms & Libraries
- **Lucide React** - İkonlar
- **Levenshtein Distance** - Fuzzy search algoritması
- **LocalStorage API** - Offline storage

### PWA
- **Service Workers** - Network-first caching
- **Web App Manifest** - App-like experience

## 📂 Proje Yapısı

```
ilacStokTakipSistemi/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service Worker (network-first)
│   ├── icon-192.png           # App icon
│   └── icon-512.png           # App icon
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   └── BaseComponents.jsx   # Button, Input, Badge, Card
│   │   ├── AddMedicineModal.jsx     # Tek ilaç ekleme
│   │   ├── AuthModal.jsx            # Giriş/Kayıt modal
│   │   ├── BulkAddModal.jsx         # Toplu ilaç ekleme
│   │   ├── DeleteModal.jsx          # Silme onay modal
│   │   └── MedicineCard.jsx         # İlaç kartı
│   ├── config/
│   │   └── firebase.js              # Firebase config
│   ├── models/
│   │   └── Medicine.js              # İlaç modeli
│   ├── services/
│   │   ├── AuthService.js           # Firebase Auth
│   │   ├── FirebaseService.js       # Firestore CRUD
│   │   ├── FuzzySearch.js           # Arama algoritması
│   │   └── StorageManager.js        # LocalStorage
│   ├── App.jsx                      # Ana uygulama
│   ├── main.jsx                     # Entry point
│   └── index.css                    # Global styles
├── .env                             # Ortam değişkenleri (GİZLİ)
├── .env.example                     # Şablon
├── .gitignore                       # Git ignore
├── firebase.json                    # Firebase config
├── firestore.rules                  # Güvenlik kuralları
├── index.html                       # HTML şablonu
├── package.json                     # Bağımlılıklar
├── AUTHENTICATION_SETUP.md          # Auth kurulum
├── DEPLOYMENT_GUIDE.md              # Deployment talimatları
├── FIREBASE_SETUP.md                # Firebase kurulum
└── README.md                        # Bu dosya
```

## 🎯 Kullanım

### İlaç Ekleme
1. **"Tek İlaç Ekle"** veya **"Toplu Ekle"** butonuna tıklayın
2. Form alanlarını doldurun:
   - İlaç Adı (zorunlu)
   - Etken Madde 1, 2, 3 (opsiyonel)
   - Miktar (örn: 500mg, 1 kutu)
   - Son Kullanma (Ay/Yıl)
   - Notlar
3. **"Kaydet"**

### Sıralama
Dropdown'dan seçim yapın:
- 🕐 Tarih bazlı
- 🔤 Alfabetik
- 📅 Son kullanma tarihi
- 📦 Kopya sayısı

### Arama
```
"parol"      → Parol bulunur
"paral"      → Parol bulunur (fuzzy match)
"parasetamol" → Parasetamol içeren tüm ilaçlar
```

### Silme
1. İlaç kartındaki çöp kutusu ikonuna tıklayın
2. **Tek ilaç**: "Silmek için Onayla"
3. **Birden fazla**: Kaç tane silmek istediğinizi girin veya "Tümünü Sil"

## 🔒 Güvenlik

### Geliştirme
- `.env` dosyası **asla** GitHub'a yüklenmez
- `.gitignore` ile korunur
- Her geliştirici kendi Firebase credentials'ını kullanır

### Production
- **Firestore Security Rules**: User-based data isolation
- **HTTPS**: Firebase Hosting otomatik
- **Authentication**: Email/password güvenli hash
- **API Key Restrictions**: Firebase Console'da ayarlanabilir

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/medicines/{medicineId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

## 🌐 Browser Desteği

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Android)

## 📊 Performans

- ⚡ **Lighthouse Score**: 95+
- 🚀 **First Contentful Paint**: < 1s
- 📦 **Bundle Size**: ~520KB (gzipped: ~160KB)
- 💾 **Network-First**: Her zaman güncel

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📝 Changelog

### v2.1.0 (2025-12-21) 🆕
- ✨ **Gelişmiş Sıralama**: 8 farklı sıralama seçeneği
- ✨ **Firebase Authentication**: Güvenli kullanıcı yönetimi
- ✨ **User-Based Data**: Veri izolasyonu
- ✨ **Gelişmiş Silme Modal**: Esnek silme seçenekleri
- 🔧 **Service Worker**: Network-first caching
- 🎨 **UI İyileştirmeleri**: Header göstergeleri

### v2.0.1 (2025-12-21)
- 🐛 **Bug Fixes**: Firebase import hatası düzeltildi
- 🔧 **Performance**: Build optimizasyonları
- 📱 **PWA**: Service worker cache iyileştirmeleri

### v2.0.0 (2025-12-21)
- ✨ **PWA Desteği**: Progressive Web App özellikleri
- ✨ **Fuzzy Search**: Yanlış yazımlara toleranslı arama
- ✨ **Etken Madde Alanları**: 3 etken madde kaydı
- ✨ **Toplu Ekleme**: Birden fazla ilaç ekleme
- ✨ **Akıllı Gruplama**: Aynı ilaçları gruplama (x2, x3)
- 🔧 **Firebase Entegrasyonu**: Bulut senkronizasyonu

### v1.3.0 (2025-12-21)
- ✨ **Ay/Yıl Formatı**: Son kullanma tarihi basitleştirildi
- ✨ **Türkçe Tarih**: "Aralık 2025" formatı
- 🎨 **UI İyileştirmeleri**: Tarih gösterimi ve badge'ler
- 🔧 **Export/Import**: JSON veri aktarımı

### v1.2.0 (2025-12-21)
- ✨ **Firebase Cloud**: Gerçek zamanlı senkronizasyon
- ✨ **Bulut/Yerel Mod**: Kolay geçiş sistemi
- 🔧 **LocalStorage**: Offline yedekleme
- 🎨 **Status Badge**: Bulut/Yerel göstergesi

### v1.1.2 (2025-12-21)
- 🐛 **Bug Fixes**: LocalStorage hataları düzeltildi
- 🔧 **Performance**: Liste render optimizasyonu
- 📱 **Mobile**: Responsive tasarım iyileştirmeleri

### v1.1.1 (2025-12-21)
- 🐛 **Bug Fixes**: Son kullanma tarihi hesaplama hatası
- 🎨 **UI Polish**: Renk şeması iyileştirmeleri
- 🔧 **Code Cleanup**: Kod optimizasyonları

### v1.0.1 (2025-12-21)
- 🐛 **Bug Fixes**: İlk kullanım hataları
- 📝 **Documentation**: README ve kurulum rehberi
- 🔧 **Dependencies**: Bağımlılık güncellemeleri

### v1.0.0 (2025-12-21) 🎉
- 🎉 **İlk Sürüm**
- ✅ **CRUD İşlemleri**: Temel ilaç yönetimi
- ✅ **LocalStorage**: Yerel veri saklama
- ✅ **Son Kullanma Takibi**: Otomatik uyarılar
- ✅ **Arama**: Basit filtreleme
- ✅ **Tailwind CSS**: Modern tasarım

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📧 İletişim

- **Geliştirici**: Yusuf Karamuk
- **Email**: yusufkaramuk10@gmail.com
- **GitHub**: [@yusufkaramuk](https://github.com/yusufkaramuk)

## 🙏 Teşekkürler

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase](https://firebase.google.com/)
- [Lucide Icons](https://lucide.dev/)

---

**Not:** Bu proje ev kullanımı ve eğitim amaçlıdır. Ticari kullanım veya hassas sağlık verileri için ek güvenlik önlemleri almanız önerilir.

⭐ Projeyi beğendiyseniz yıldız vermeyi unutmayın!

**🌐 Demo:** [https://ilac-stok-takip.web.app](https://ilac-stok-takip.web.app)
