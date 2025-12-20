# İlaç Stok Takip Sistemi 💊

Modern, kullanıcı dostu bir web uygulaması. Evinizdeki ilaçları dijital ortamda takip edin, son kullanma tarihlerini kontrol edin ve stok yönetiminizi kolaylaştırın.

## ✨ Özellikler

- 📝 **İlaç Yönetimi**: Ekleme, düzenleme, silme ve arama
- ⏰ **Son Kullanma Takibi**: Otomatik uyarılar (geçmiş/yakında bitecek)
- 📦 **Toplu Ekleme**: Birden fazla ilacı tek seferde ekleyin
- ☁️ **Bulut Senkronizasyonu**: Firebase ile gerçek zamanlı veri senkronizasyonu
- 💾 **Yerel Yedekleme**: LocalStorage + JSON export/import
- 📱 **Responsive Tasarım**: Mobil ve masaüstü uyumlu
- 🎨 **Modern Arayüz**: Tailwind CSS ile şık ve kullanışlı tasarım

## 🚀 Kurulum

### 1. Projeyi Klonlayın

```bash
git clone https://github.com/KULLANICI_ADI/ilacStokTakipSistemi.git
cd ilacStokTakipSistemi
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. Firebase Yapılandırması

1. [Firebase Console](https://console.firebase.google.com/) üzerinden yeni bir proje oluşturun
2. Firestore Database'i aktif edin (Test mode)
3. Web uygulaması ekleyin ve config bilgilerini alın
4. `.env.example` dosyasını `.env` olarak kopyalayın:

```bash
cp .env.example .env
```

5. `.env` dosyasını Firebase bilgilerinizle doldurun:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Firestore Security Rules

Firebase Console → Firestore Database → Rules sekmesine gidin ve şu kuralları ekleyin:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**Not:** Bu kurallar test amaçlıdır. Production için daha güvenli kurallar kullanın.

### 5. Uygulamayı Başlatın

```bash
npm run dev
```

Tarayıcınızda `http://localhost:5173` adresini açın.

## 🌐 Ağ Erişimi (Aynı WiFi)

Aynı ağdaki diğer cihazlardan erişmek için:

1. Sunucuyu başlatın (`npm run dev`)
2. Terminalde gösterilen Network URL'yi kullanın (örn: `http://192.168.0.174:5173`)
3. Diğer cihazların tarayıcısından bu URL'yi açın

## 📦 Production Build

```bash
npm run build
npm run preview
```

Build dosyaları `dist/` klasöründe oluşturulur.

## 🛠️ Teknolojiler

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Firebase Firestore
- **State Management**: React Hooks

## 📂 Proje Yapısı

```
ilacStokTakipSistemi/
├── src/
│   ├── components/          # React bileşenleri
│   │   ├── ui/              # Temel UI bileşenleri
│   │   ├── AddMedicineModal.jsx
│   │   ├── BulkAddModal.jsx
│   │   └── MedicineCard.jsx
│   ├── config/              # Yapılandırma dosyaları
│   │   └── firebase.js
│   ├── models/              # Veri modelleri
│   │   └── Medicine.js
│   ├── services/            # API servisleri
│   │   ├── FirebaseService.js
│   │   └── StorageManager.js
│   ├── App.jsx              # Ana uygulama
│   ├── main.jsx             # Giriş noktası
│   └── index.css            # Global stiller
├── .env.example             # Ortam değişkenleri şablonu
├── .gitignore               # Git ignore kuralları
├── index.html               # HTML şablonu
├── package.json             # Proje bağımlılıkları
├── tailwind.config.js       # Tailwind yapılandırması
└── vite.config.js           # Vite yapılandırması
```

## 🔒 Güvenlik Notları

- `.env` dosyası **asla** GitHub'a yüklenmemelidir (`.gitignore`'da tanımlı)
- Firebase API anahtarları frontend'de görünür olduğu için Firestore Security Rules ile koruma sağlanmalıdır
- Production'da daha katı güvenlik kuralları kullanın

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📧 İletişim

Sorularınız için issue açabilirsiniz.

---

**Not:** Bu proje ev kullanımı için geliştirilmiştir. Ticari kullanım için ek güvenlik önlemleri almanız önerilir.
