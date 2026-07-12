# İlaç Hatırlatıcı Mimarisi

Bu belge `feature/design-notifications-medication-reminders` dalında eklenen
hatırlatıcı sisteminin veri modelini, zamanlama yaklaşımını ve operasyon
gereksinimlerini özetler. Sistem **Firebase Spark (ücretsiz) planında**,
Cloud Functions olmadan çalışır: zamanlama GitHub Actions cron ile yapılır.

## Veri modeli

### `users/{userId}/medicationSchedules/{scheduleId}`
Opt-in hatırlatıcı planı; `scheduleId` = ilgili ilacın doküman kimliği
(ilaç başına tek plan). Mevcut ilaç belgelerine dokunulmaz, migration yoktur.

| Alan | Tip | Açıklama |
|---|---|---|
| `medicineId` | string ≤64 | İlgili ilaç dokümanı |
| `enabled` | bool | Ana açma/kapama (kapatınca hiçbir hatırlatma yapılmaz) |
| `timezone` | string ≤64 | IANA saat dilimi (ör. `Europe/Istanbul`) |
| `scheduleTimes` | list ≤12 × `HH:mm` | Günlük kullanım saatleri |
| `daysOfWeek` | list ≤7 × int 0-6 | Kullanım günleri (0=Pazar) |
| `dosePerIntake` | number 0.25–20 | Kullanım başına doz |
| `unitLabel` | string ≤20 | tablet / kapsül / ölçek… |
| `unitsPerPackage` | int 0–500 | Kutu başına birim |
| `remainingUnits` | number 0–5000 | Kalan birim (Aldım ile azalır) |
| `refillLeadDays` | int 0–30 | Bitmeden kaç gün önce uyarı |
| `refillReminderEnabled` | bool | Kutu bitiş uyarısı |
| `medicationReminderEnabled` | bool | Kullanım saati hatırlatması |
| `snoozeMinutes` | int 5–120 | Erteleme süresi |
| `quietHours` | map/null | `{start,end}` `HH:mm`; gece yarısını aşabilir |
| `notificationPrivacyMode` | `generic`\|`named` | Varsayılan `generic` |
| `displayLabel` | string ≤40 | YALNIZCA named modda; kullanıcı yazar, düz metin saklanır |
| `caregiverEscalationEnabled` | bool | v1'de yalnız veri temeli — teslimat mantığı yok |
| `createdAt` / `updatedAt` | ISO string | |

> **Gizlilik:** İlaç adı Firestore'da AES-GCM ile şifrelidir (`enc:` öneki) ve
> sunucu bunu ÇÖZEMEZ. Bu yüzden push metinlerinde ya genel metin ya da
> kullanıcının açık onayla yazdığı `displayLabel` kullanılır. Sanitizer
> `enc:` ile başlayan her değeri reddeder (çift emniyet).

### `users/{userId}/reminderDeliveries/{slotId}`
İdempotency/teslimat kaydı. `slotId = {scheduleId}_{YYYY-MM-DD}T{HHmm}` veya
`refill_{scheduleId}_{YYYY-MM-DD}`. Alanlar: `scheduleId`, `slot`, `status`
(`pending|sent|failed|no-subscription`), `createdAt`, `sentAt`, `expireAt`
(timestamp, +7 gün). **İstemci yazamaz** (rules `write: if false`); yalnızca
Actions service account yazar. Script `currentDocument.exists=false`
önkoşuluyla oluşturur: önce-yaz-sonra-gönder → çakışmada asla çift bildirim.

### `users/{userId}/notifications/{notifId}`
Uygulama içi bildirim merkezi. Alanlar: `type` (`intake|refill|expiry|system`),
`title` ≤80, `body` ≤240, `medicineId?`, `scheduleId?`, `read`, `createdAt`.
İstemci güncellemesi yalnızca `read` alanıyla sınırlıdır. Saklama: istemci
açılışta 30 günden eski / 100'ü aşan kayıtları budar.

## Zamanlama ve alarm katmanları

1. **Uygulama açıkken:** `useInAppReminders` 30 sn'de bir yerel duvar saatiyle
   slot kontrolü yapar → tam ekran `AlarmOverlay` (Aldım / N dk Ertele / Atla).
2. **Uygulama kapalıyken:** `.github/workflows/send-reminders.yml` her 15 dk
   `scripts/send-reminders.js` çalıştırır; 40 dk tolerans penceresi GitHub
   cron gecikmesini karşılar. **Tam saat garantisi yoktur.**
3. Desteklenen platformlarda bildirim aksiyonları (Aldım/Ertele) + titreşim;
   desteklenmeyenlerde bildirim uygulamayı açar, işlemler uygulama içinde.
4. Bildirim izni yoksa in-app alarm + bildirim merkezi tek başına çalışır.

DST: karşılaştırmalar Intl ile yerel duvar saatinde yapılır; ileri alınan
saatte atlanan slot o gün hiç tetiklenmez, geri alınan tekrarlanan saat
idempotency anahtarıyla tek gönderime kilitlenir.

## Operasyon / manuel adımlar

- **Index deploy (zorunlu):** collection-group sorgusu için
  `firebase deploy --only firestore:indexes`
- **Rules deploy:** `firebase deploy --only firestore:rules`
- **Firestore TTL (önerilir):** Console → Firestore → TTL → koleksiyon grubu
  `reminderDeliveries`, alan `expireAt`. (Yoksa günlük script 7 günden eski
  kayıtları siler.)
- **Secrets (mevcut, değişmedi):** `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`,
  `FIREBASE_PROJECT_ID`, `FIREBASE_SERVICE_ACCOUNT`.
- **Service account en az yetki:** yalnızca `roles/datastore.user` yeterlidir
  (Firestore okuma/yazma). Editor/Owner rolü gerekmez ve önerilmez.

## Test

- `npm run test:unit` — decoder, sanitizer, pushId, slot/DST, kutu bitiş
  matematiği (emülatör gerekmez).
- `npm run test:rules` — Firestore emülatörü ister (**Java 21+**).
- Workflow'lar `workflow_dispatch` + `dry_run` girdisiyle elle ve güvenle
  denenebilir.
