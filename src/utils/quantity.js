// İlaç miktarı (kutu) gösterimi için tek ortak formatter.
// Uygulamada iki ayrı kavram vardı ve ayrı biçimlerde gösteriliyordu:
//   - count      : aynı ilacın gruplanan yinelenen doküman sayısı ("×2 adet")
//   - stockCount : tek dokümandaki kutu sayısı ("2 kutu")
// Kullanıcı her yerde "N kutu" biçimini istedi. Toplam kutu = gruptaki
// tüm kaynak kayıtların stockCount toplamı. Bu modül tek doğru kaynaktır.

/**
 * Bir kaydın stockCount değerini güvenli biçimde normalleştirir.
 * - Eksik alan (undefined/null/''): 1 kutu. Gerekçe: stockCount validation/
 *   kurallarda 1-999 arası yazılır (MedicineValidation Math.max(1,…)); alanı
 *   hiç olmayan ESKİ kayıt, tarihsel varsayılan olan 1 kutu demektir.
 * - Geçerli sayı (0 dahil): olduğu gibi korunur. ('0'ı 1'e çevirmeyiz.)
 * - NaN / negatif / geçersiz: 1 kutu (güvenli fallback).
 */
export function normalizeStockCount(value) {
  if (value === undefined || value === null || value === '') return 1;
  const n = typeof value === 'number' ? value : parseInt(value, 10);
  if (!Number.isFinite(n) || n < 0) return 1;
  return n;
}

/**
 * Kaynak ilaç kayıtları dizisinden toplam kutu sayısını hesaplar.
 * NOT: Yalnız ID listesi (allIds) değil, gerçek kayıt nesneleri verilmeli;
 * toplam her kaydın stockCount'undan gelir.
 */
export function calculateTotalBoxes(items) {
  if (!Array.isArray(items) || items.length === 0) return 0;
  return items.reduce((sum, m) => sum + normalizeStockCount(m && m.stockCount), 0);
}

/** "N kutu" biçimli miktar etiketi. */
export function formatBoxes(count) {
  const n = Number.isFinite(count) ? count : 0;
  return `${n} kutu`;
}
