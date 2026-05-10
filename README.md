# İlaç Stok Takip Sistemi

Modern, güvenli ve kullanıcı dostu bir web uygulaması. Evinizdeki ilaçları dijital ortamda takip edin, son kullanma tarihlerini kontrol edin ve aile üyeleriyle paylaşın.

**Canlı Demo:** [https://ilac-stok-takip.web.app](https://ilac-stok-takip.web.app)

---

## Özellikler

### Kullanıcı Yönetimi
- Firebase Authentication ile e-posta/şifre ve Google girişi
- Kullanıcı izolasyonu — her kullanıcı yalnızca kendi verilerine erişir
- E-posta doğrulama ve şifre sıfırlama
- Firebase App Check + reCAPTCHA v3 ile bot koruması

### İlaç Yönetimi
- İlaç ekleme, düzenleme, silme ve listeleme (CRUD)
- Her ilaç için 3 farklı etken madde kaydı
- Akıllı gruplama: aynı bilgilere sahip ilaçlar otomatik gruplanır (×2, ×3 gösterimi)
- Toplu ekleme: birden fazla ilacı tek seferde JSON ile içe aktarın
- Gelişmiş silme: gruptan istediğiniz kadar ilacı seçerek silin
- Etiket sistemi: ilaçlara özel etiket ekleyin ve etiketle filtreleyin

### Barkod Tarama & TİTCK Entegrasyonu
- Kamera ile barkod okuma
- 22.000+ ilaç kaydı içeren TİTCK veritabanı ile otomatik eşleştirme
- Barkod okunduğunda ticari ad, doz, form ve etken maddeler otomatik doldurulur
- Veriler IndexedDB'de önbelleğe alınır — offline çalışır

### Aile Modu
- E-posta ile aile üyesi daveti (7 günlük geçerlilik)
- Aile üyeleri birbirinin ilaç stoğunu görebilir
- **Özel İlaç** seçeneği — işaretlenen ilaçlar aile üyelerine gizlenir
- Admin/üye rol sistemi: sadece admin yeni üye davet edebilir

### Akıllı Arama ve Sıralama
- Fuzzy Search: yanlış yazımlara toleranslı arama (Levenshtein algoritması)
- İlaç adı ve tüm etken maddeler üzerinde anlık arama
- 8 farklı sıralama seçeneği (tarih, alfabetik, son kullanma, kopya sayısı)
- Durum filtresi: Tümü / Süresi Geçmiş / Yakında Bitiyor / Güvenli

### Son Kullanma Takibi
- Otomatik renk uyarıları: Kırmızı (geçmiş) · Turuncu (30 gün) · Yeşil (güvenli)
- Ay/Yıl formatında pratik tarih girişi
- Türkçe tarih gösterimi ve kalan gün sayacı

### Kullanım Geçmişi
- Her ilaç için kullanım kaydı: kullanıldı, bitti, eklendi, düzenlendi
- İsteğe bağlı not eklenebilir
- Tüm kullanıcı geçmişini tek ekranda görme

### Push Bildirimleri
- Son kullanma tarihi yaklaşan ilaçlar için otomatik bildirim
- Web Push (VAPID) ile tarayıcı bildirimi desteği
- GitHub Actions ile zamanlanmış günlük kontrol

### Salt Okunur Paylaşım Linki
- Seçili bir ilacı şifre gerektirmeden paylaşın
- 7 günlük geçerlilik süresi olan benzersiz token
- Paylaşılan ilaç verisi Firestore'da saklanır, okuyan kullanıcı hesabı gerektirmez

### Veri Yönetimi
- CSV ve JSON ile dışa aktarma
- JSON ile toplu içe aktarma (yedek geri yükleme)
- Her değişiklik anında otomatik kaydedilir

### Progressive Web App (PWA)
- Ana ekrana eklenebilir — telefonda uygulama gibi çalışır
- Offline çalışma desteği (IndexedDB + Service Worker)
- Responsive tasarım (mobil ve masaüstü)

### Arayüz
- Karanlık mod / Açık mod
- Liste ve grid görünümü
- Türkçe arayüz

---

## Hızlı Başlangıç

### Ön Gereksinimler
- Node.js 18+
- Firebase hesabı (ücretsiz)

### Kurulum

**1. Projeyi klonlayın**
```bash
git clone https://github.com/yusufkaramuk/ilacStokTakipSistemi.git
cd ilacStokTakipSistemi
```

**2. Bağımlılıkları yükleyin**
```bash
npm install
```

**3. Firebase yapılandırması**

`.env.example` dosyasını `.env` olarak kopyalayın:
```bash
cp .env.example .env
```

Firebase bilgilerinizi `.env` dosyasına girin:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Opsiyonel — Firebase App Check
VITE_RECAPTCHA_V3_SITE_KEY=your_recaptcha_key
VITE_ENABLE_APP_CHECK=true

# Opsiyonel — Web Push bildirimleri (VAPID)
VITE_VAPID_PUBLIC_KEY=your_vapid_public_key

# Opsiyonel — Firebase Emulators (yerel geliştirme)
VITE_USE_FIREBASE_EMULATORS=false
```

**4. Kurulum kılavuzları**
- [docs/FIREBASE_SETUP.md](docs/FIREBASE_SETUP.md) — Firebase proje kurulumu
- [docs/AUTHENTICATION_SETUP.md](docs/AUTHENTICATION_SETUP.md) — Authentication aktifleştirme
- [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) — Production deployment

**5. Uygulamayı başlatın**
```bash
npm run dev
```

Tarayıcınızda `http://localhost:5173` adresini açın.

---

## Deployment

```bash
npm run build
npx firebase deploy
```

TİTCK ilaç veritabanını güncellemek için:
```bash
node scripts/fetch-titck-data.js
```

---

## Teknolojiler

### Frontend
| Teknoloji | Versiyon | Amaç |
|-----------|----------|-------|
| React | 18 | UI framework |
| Vite | 7 | Build tool |
| Tailwind CSS | 3 | Styling |
| Lucide React | latest | İkonlar |

### Backend & Veritabanı
| Teknoloji | Amaç |
|-----------|-------|
| Firebase Authentication | Kullanıcı yönetimi |
| Firebase Firestore | NoSQL bulut veritabanı |
| Firebase Hosting | Statik web hosting |
| Firebase App Check | Bot ve kötüye kullanım koruması |

### PWA & Offline
| Teknoloji | Amaç |
|-----------|-------|
| Service Worker | Offline caching |
| IndexedDB | TİTCK ilaç veritabanı önbelleği |
| Web Push (VAPID) | Push bildirimleri |

### Algoritmalar
| Teknoloji | Amaç |
|-----------|-------|
| Levenshtein Distance | Fuzzy search |
| ExcelJS | TİTCK Excel ayrıştırma |

---

## Proje Yapısı

```
ilacStokTakipSistemi/
├── docs/                            # Kurulum ve deployment kılavuzları
├── public/
│   ├── manifest.json                # PWA manifest
│   └── sw.js                        # Service Worker
├── scripts/
│   ├── fetch-titck-data.js          # TİTCK Excel → medicines.json
│   └── send-notifications.js        # Push bildirim gönderici
├── src/
│   ├── components/
│   │   ├── AddMedicineModal.jsx     # İlaç ekleme/düzenleme
│   │   ├── AllHistoryModal.jsx      # Tüm kullanım geçmişi
│   │   ├── AuthModal.jsx            # Giriş/Kayıt
│   │   ├── BarcodeScanner.jsx       # Kamera barkod okuyucu
│   │   ├── BulkAddModal.jsx         # Toplu JSON import
│   │   ├── DeleteModal.jsx          # Silme onay
│   │   ├── FamilyModal.jsx          # Aile modu yönetimi
│   │   ├── MedicineCard.jsx         # İlaç kartı
│   │   ├── ShareView.jsx            # Paylaşım link görünümü
│   │   ├── UsageHistoryModal.jsx    # İlaç kullanım geçmişi
│   │   └── ui/
│   │       └── BaseComponents.jsx   # Ortak UI bileşenleri
│   ├── config/
│   │   └── firebase.js              # Firebase yapılandırması
│   ├── services/
│   │   ├── AuthService.js           # Firebase Auth işlemleri
│   │   ├── CsvExport.js             # CSV dışa aktarma
│   │   ├── FamilyService.js         # Aile modu işlemleri
│   │   ├── FirebaseClient.js        # Firebase başlatma & App Check
│   │   ├── FirebaseService.js       # Firestore CRUD
│   │   ├── FuzzySearch.js           # Levenshtein arama
│   │   ├── MedicineDatabase.js      # TİTCK IndexedDB yönetimi
│   │   ├── MedicineValidation.js    # Veri doğrulama & normalize
│   │   ├── NotificationService.js   # Web Push yönetimi
│   │   └── StorageManager.js        # LocalStorage yönetimi
│   ├── App.jsx                      # Ana uygulama bileşeni
│   ├── main.jsx                     # Entry point
│   └── index.css                    # Global stiller
├── tests/
│   └── firestore.rules.test.js      # Güvenlik kuralı testleri
├── .env.example
├── firebase.json
├── firestore.indexes.json
├── firestore.rules
├── index.html
└── package.json
```

---

## Güvenlik

- **Firestore Security Rules** — kullanıcı ve aile bazlı veri izolasyonu
- **Firebase App Check** — reCAPTCHA v3 ile bot koruması
- **HTTPS** — Firebase Hosting tarafından otomatik
- **Input Validation** — `MedicineValidation` servisi ile her yazma öncesi doğrulama
- `.env` dosyası `.gitignore` ile korunur

### Güvenlik Testleri
```bash
npm run test:rules     # Firestore kural testlerini çalıştır
npm run test:security  # Tam güvenlik kontrolü
```

---

## Changelog

### v2.3.0
- **Aile Modu**: e-posta daveti, aile üyesi ilaç görüntüleme, Özel İlaç gizleme
- **Barkod düzeltmeleri**: TİTCK 2026 URL dinamik keşif, mobil IndexedDB timeout çözümü
- **Firestore**: cross-user okuma kuralları, davet kabul izni, `persistentLocalCache` geçişi
- Proje dosya yapısı temizlendi (`docs/` klasörü, gereksiz dosyalar silindi)

### v2.2.0
- **Barkod Tarama**: kamera ile barkod okuma, TİTCK veritabanı entegrasyonu (22.000+ ilaç)
- **Kullanım Geçmişi**: ilaç bazlı kayıt (kullanıldı, bitti, eklendi, düzenlendi)
- **Push Bildirimleri**: Web Push VAPID ile son kullanma tarihi uyarıları
- **Paylaşım Linki**: salt okunur, 7 günlük token bazlı paylaşım
- Offline-First PWA: IndexedDB chunked yazma, Service Worker v5

### v2.1.1
- Firebase güvenlik tabanı sertleştirildi (App Check, gelişmiş Firestore kuralları)
- Güvenlik test altyapısı eklendi

### v2.1.0
- Firebase Authentication ile kullanıcı kayıt/giriş sistemi
- Google ile giriş
- Etiket sistemi ve gelişmiş filtreleme
- Karanlık mod
- CSV dışa aktarma
- 8 farklı sıralama seçeneği

### v2.0.0
- PWA desteği (Progressive Web App)
- Fuzzy Search (Levenshtein algoritması)
- Firebase Firestore entegrasyonu
- Toplu ilaç ekleme, akıllı gruplama

### v1.0.0
- İlk sürüm: temel CRUD, LocalStorage, son kullanma takibi

---

## Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/ozellik-adi`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Özellik açıklaması'`)
4. Branch'inizi push edin (`git push origin feature/ozellik-adi`)
5. Pull Request açın

---

## Lisans

MIT License — ayrıntılar için [LICENSE](LICENSE) dosyasına bakın.

---

## İletişim

- **Geliştirici**: Yusuf Karamuk
- **GitHub**: [@yusufkaramuk](https://github.com/yusufkaramuk)

---

> Bu proje ev kullanımı ve eğitim amaçlıdır.
