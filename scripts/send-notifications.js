#!/usr/bin/env node
// Günlük SKT yaklaşan ilaç bildirimi gönderme scripti
// GitHub Actions'da çalışır, Firestore REST API ile veri okur, web-push ile bildirim gönderir

import webpush from 'web-push';

const {
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY,
  VAPID_SUBJECT,
  FIREBASE_PROJECT_ID,
  FIREBASE_SERVICE_ACCOUNT,
} = process.env;

if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY || !FIREBASE_PROJECT_ID || !FIREBASE_SERVICE_ACCOUNT) {
  console.error('[Bildirim] Eksik environment variables. GitHub Secrets kontrol edin.');
  process.exit(1);
}

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

// Firebase Admin SDK ile Firestore'dan veri çek
async function getFirestoreToken(serviceAccount) {
  const { private_key, client_email } = serviceAccount;
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    iss: client_email,
    sub: client_email,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
    scope: 'https://www.googleapis.com/auth/datastore',
  })).toString('base64url');

  const { createSign } = await import('crypto');
  const sign = createSign('RSA-SHA256');
  sign.update(`${header}.${payload}`);
  const sig = sign.sign(private_key, 'base64url');
  const jwt = `${header}.${payload}.${sig}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });
  const { access_token } = await res.json();
  return access_token;
}

async function firestoreList(token, path) {
  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/${path}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  return data.documents || [];
}

function getFieldValue(doc, field) {
  const f = doc.fields?.[field];
  return f?.stringValue ?? f?.integerValue ?? f?.arrayValue ?? null;
}

function statusOf(expiryDate) {
  if (!expiryDate) return null;
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const [y, m] = expiryDate.split('-').map(Number);
  const exp = new Date(y, m, 0); exp.setHours(23, 59, 59, 999);
  return Math.ceil((exp - now) / 86400000);
}

async function main() {
  let serviceAccount;
  try {
    serviceAccount = JSON.parse(FIREBASE_SERVICE_ACCOUNT);
  } catch {
    console.error('[Bildirim] FIREBASE_SERVICE_ACCOUNT geçersiz JSON');
    process.exit(1);
  }

  const token = await getFirestoreToken(serviceAccount);
  const users = await firestoreList(token, 'users');
  console.log(`[Bildirim] ${users.length} kullanıcı bulundu`);

  let totalSent = 0;

  for (const userDoc of users) {
    const userId = userDoc.name.split('/').pop();

    // Kullanıcının ilaçlarını çek
    const medicines = await firestoreList(token, `users/${userId}/medicines`);
    const expiring = medicines.filter(m => {
      const d = statusOf(getFieldValue(m, 'expiryDate'));
      return d !== null && d >= 0 && d <= 30;
    });

    if (expiring.length === 0) continue;

    // Kullanıcının push subscription'larını çek
    const subs = await firestoreList(token, `users/${userId}/pushSubscriptions`);
    if (subs.length === 0) continue;

    const medicineNames = expiring.slice(0, 3).map(m => getFieldValue(m, 'name')).filter(Boolean);
    const title = `${expiring.length} ilacınızın son kullanma tarihi yaklaşıyor`;
    const body = medicineNames.join(', ') + (expiring.length > 3 ? ` ve ${expiring.length - 3} daha…` : '');

    for (const subDoc of subs) {
      const endpoint = getFieldValue(subDoc, 'endpoint');
      const keysField = subDoc.fields?.keys?.mapValue?.fields;
      if (!endpoint || !keysField) continue;

      const subscription = {
        endpoint,
        keys: {
          p256dh: keysField.p256dh?.stringValue,
          auth: keysField.auth?.stringValue,
        },
      };

      try {
        await webpush.sendNotification(subscription, JSON.stringify({ title, body, tag: 'skt-uyari' }));
        totalSent++;
      } catch (err) {
        // 410 Gone = subscription geçersiz, silmek gerekebilir (sessizce geç)
        if (err.statusCode !== 410) console.warn('[Bildirim] Gönderim hatası:', err.statusCode);
      }
    }
  }

  console.log(`[Bildirim] Tamamlandı — ${totalSent} bildirim gönderildi`);
}

main().catch(err => { console.error(err); process.exit(1); });
