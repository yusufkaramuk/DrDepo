/**
 * ShareLinkCrypto: Token'dan AES-GCM anahtarı türetir ve
 * paylaşım verilerini şifreler / çözer.
 *
 * Güvenlik modeli:
 *  - Token (32 hex karakter = 16 byte) → HKDF ile AES-256-GCM anahtarı türetilir
 *  - IV rastgele 12 byte, şifreli veri ile birleştirilir
 *  - Firestore'da yalnızca şifreli veri bulunur; anahtar asla sunucuya gitmez
 *  - Anahtar URL'nin #fragment kısmında taşınır (sunucu loglarına düşmez)
 */

const SALT = new TextEncoder().encode('ilac-takip-share-v1');

/**
 * Token (hex string) → CryptoKey (AES-256-GCM)
 */
export async function deriveKeyFromToken(token) {
  const tokenBytes = Uint8Array.from(
    token.match(/.{2}/g).map(h => parseInt(h, 16))
  );
  const baseKey = await crypto.subtle.importKey(
    'raw', tokenBytes, 'HKDF', false, ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'HKDF', hash: 'SHA-256', salt: SALT, info: new Uint8Array() },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * JSON-serileştirilebilir veriyi şifrele → Base64 string
 */
export async function encryptShareData(data, key) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(data));
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
  const combined = new Uint8Array(12 + cipher.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(cipher), 12);
  return btoa(String.fromCharCode(...combined));
}
/**
 * Base64 şifreli string → orijinal nesne
 */
export async function decryptShareData(b64, key) {
  const combined = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  const iv = combined.slice(0, 12);
  const cipher = combined.slice(12);
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipher);
  return JSON.parse(new TextDecoder().decode(plain));
}
