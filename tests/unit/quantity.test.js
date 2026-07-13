import { describe, it, expect } from 'vitest';
import { normalizeStockCount, calculateTotalBoxes, formatBoxes } from '../../src/utils/quantity.js';

describe('normalizeStockCount', () => {
  it('eksik alan (undefined/null/boş) → 1 kutu (eski kayıt varsayılanı)', () => {
    expect(normalizeStockCount(undefined)).toBe(1);
    expect(normalizeStockCount(null)).toBe(1);
    expect(normalizeStockCount('')).toBe(1);
  });
  it('geçerli 0 korunur (1e çevrilmez)', () => {
    expect(normalizeStockCount(0)).toBe(0);
  });
  it("string sayı '2' → 2", () => {
    expect(normalizeStockCount('2')).toBe(2);
  });
  it('geçerli pozitif sayı korunur', () => {
    expect(normalizeStockCount(3)).toBe(3);
  });
  it('geçersiz/NaN/negatif → 1 fallback', () => {
    expect(normalizeStockCount('abc')).toBe(1);
    expect(normalizeStockCount(-4)).toBe(1);
    expect(normalizeStockCount(NaN)).toBe(1);
  });
});

describe('calculateTotalBoxes', () => {
  it('iki ayrı stockCount=1 kayıt → 2 kutu', () => {
    expect(calculateTotalBoxes([{ stockCount: 1 }, { stockCount: 1 }])).toBe(2);
  });
  it('tek stockCount=2 kayıt → 2 kutu', () => {
    expect(calculateTotalBoxes([{ stockCount: 2 }])).toBe(2);
  });
  it('stockCount=2 ve stockCount=3 → 5 kutu', () => {
    expect(calculateTotalBoxes([{ stockCount: 2 }, { stockCount: 3 }])).toBe(5);
  });
  it('eksik stockCount içeren kayıtlar → her biri 1 kutu', () => {
    expect(calculateTotalBoxes([{}, { stockCount: 2 }])).toBe(3);
  });
  it("string '2' + sayı 1 → 3", () => {
    expect(calculateTotalBoxes([{ stockCount: '2' }, { stockCount: 1 }])).toBe(3);
  });
  it('boş/geçersiz dizi → 0', () => {
    expect(calculateTotalBoxes([])).toBe(0);
    expect(calculateTotalBoxes(null)).toBe(0);
  });
  it('stockCount=0 olan kayıt toplama 0 katar', () => {
    expect(calculateTotalBoxes([{ stockCount: 0 }, { stockCount: 2 }])).toBe(2);
  });
});

describe('formatBoxes', () => {
  it('"N kutu" biçimi', () => {
    expect(formatBoxes(1)).toBe('1 kutu');
    expect(formatBoxes(2)).toBe('2 kutu');
    expect(formatBoxes(3)).toBe('3 kutu');
    expect(formatBoxes(0)).toBe('0 kutu');
  });
});
