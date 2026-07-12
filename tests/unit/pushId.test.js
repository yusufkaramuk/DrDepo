import { describe, it, expect } from 'vitest';
import { subscriptionIdFor, legacySubscriptionIdFor } from '../../src/utils/pushId.js';

describe('subscriptionIdFor', () => {
  const endpoint = 'https://fcm.googleapis.com/fcm/send/abc123:APA91b_uzun_token_ornegi';

  it('deterministik base64url kimlik üretir', async () => {
    const a = await subscriptionIdFor(endpoint);
    const b = await subscriptionIdFor(endpoint);
    expect(a).toBe(b);
    expect(a).toMatch(/^[\w-]{43}$/); // SHA-256 → 43 karakter base64url, padding yok
  });

  it("Firestore doküman kimliği için güvenli karakter seti ('/', '+', '=' yok)", async () => {
    const id = await subscriptionIdFor(endpoint);
    expect(id).not.toMatch(/[/+=]/);
  });

  it('farklı endpointler farklı kimlik üretir (eski slice çakışması regresyonu)', async () => {
    // Eski yöntemde ilk 60 base64 karakteri aynı olan iki endpoint çakışırdı
    const shared = 'https://fcm.googleapis.com/fcm/send/' + 'A'.repeat(80);
    const e1 = shared + 'X';
    const e2 = shared + 'Y';
    expect(legacySubscriptionIdFor(e1)).toBe(legacySubscriptionIdFor(e2)); // eski: çakışma
    expect(await subscriptionIdFor(e1)).not.toBe(await subscriptionIdFor(e2)); // yeni: benzersiz
  });

  it('geçersiz endpoint için fırlatır', async () => {
    await expect(subscriptionIdFor('')).rejects.toThrow();
    await expect(subscriptionIdFor(null)).rejects.toThrow();
  });
});

describe('legacySubscriptionIdFor', () => {
  it('eski format kimliği üretir (geriye dönük temizlik için)', () => {
    const id = legacySubscriptionIdFor('https://example.com/push/x');
    expect(id).toBe(btoa('https://example.com/push/x').slice(0, 60));
  });

  it('btoa fırlatırsa null döner', () => {
    expect(legacySubscriptionIdFor('İüş😀')).toBeNull();
  });
});
