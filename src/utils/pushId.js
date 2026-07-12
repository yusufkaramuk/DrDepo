// Push aboneliği doküman kimliği üretimi.
// Eski yöntem btoa(endpoint).slice(0,60) idi: kesme (slice) benzersizlik
// kuyruğunu attığı için çakışma riski taşır ve '+'/'/' karakterleri içerir.
// Yeni yöntem: SHA-256(endpoint) → base64url (43 karakter, çakışma güvenli,
// Firestore doküman kimliği için güvenli karakter seti).

/** ArrayBuffer → base64url string. */
function bufferToBase64Url(buffer) {
  const bytes = new Uint8Array(buffer);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  const base64 = typeof btoa === 'function'
    ? btoa(bin)
    : Buffer.from(bytes).toString('base64');
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Yeni format abonelik doküman kimliği: SHA-256(endpoint) base64url. */
export async function subscriptionIdFor(endpoint) {
  if (typeof endpoint !== 'string' || !endpoint) {
    throw new Error('Geçersiz endpoint');
  }
  const data = new TextEncoder().encode(endpoint);
  const digest = await globalThis.crypto.subtle.digest('SHA-256', data);
  return bufferToBase64Url(digest);
}

/**
 * Eski (legacy) format kimlik — yalnızca geriye dönük temizlik için.
 * Not: btoa Unicode dışı karakterlerde fırlatabilir; null döner.
 */
export function legacySubscriptionIdFor(endpoint) {
  try {
    return btoa(endpoint).slice(0, 60);
  } catch {
    return null;
  }
}
