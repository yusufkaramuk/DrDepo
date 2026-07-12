import { describe, it, expect } from 'vitest';
import { decodeValue, decodeFields, getField, docId } from '../../scripts/lib/firestore-values.js';

describe('decodeValue', () => {
  it('stringValue döndürür', () => {
    expect(decodeValue({ stringValue: 'Parol 500 mg' })).toBe('Parol 500 mg');
  });

  it('Türkçe karakterleri bozmadan korur', () => {
    const s = 'İıŞşĞğÜüÖöÇç — ağrı kesici';
    expect(decodeValue({ stringValue: s })).toBe(s);
  });

  it('integerValue string gelir, number döner (kök neden regresyonu)', () => {
    expect(decodeValue({ integerValue: '5' })).toBe(5);
    expect(decodeValue({ integerValue: '-12' })).toBe(-12);
  });

  it('doubleValue number döner', () => {
    expect(decodeValue({ doubleValue: 2.5 })).toBe(2.5);
    expect(decodeValue({ doubleValue: '3.25' })).toBe(3.25);
  });

  it('booleanValue boolean döner', () => {
    expect(decodeValue({ booleanValue: true })).toBe(true);
    expect(decodeValue({ booleanValue: false })).toBe(false);
  });

  it('timestampValue ISO string döner', () => {
    expect(decodeValue({ timestampValue: '2026-07-12T09:00:00Z' })).toBe('2026-07-12T09:00:00Z');
  });

  it('nullValue null döner', () => {
    expect(decodeValue({ nullValue: null })).toBeNull();
  });

  it('arrayValue recursive çözülür — asla ham obje sızmaz ([object Object] regresyonu)', () => {
    const raw = { arrayValue: { values: [{ stringValue: 'a' }, { integerValue: '2' }] } };
    const decoded = decodeValue(raw);
    expect(decoded).toEqual(['a', 2]);
    // String'e dönüştürüldüğünde "[object Object]" içermemeli
    expect(String(decoded)).not.toContain('[object Object]');
  });

  it('boş arrayValue boş dizi döner', () => {
    expect(decodeValue({ arrayValue: {} })).toEqual([]);
  });

  it('mapValue recursive çözülür', () => {
    const raw = {
      mapValue: {
        fields: {
          p256dh: { stringValue: 'key1' },
          nested: { mapValue: { fields: { x: { integerValue: '1' } } } },
        },
      },
    };
    expect(decodeValue(raw)).toEqual({ p256dh: 'key1', nested: { x: 1 } });
  });

  it('iç içe array+map kombinasyonunu çözer', () => {
    const raw = {
      arrayValue: {
        values: [{ mapValue: { fields: { t: { stringValue: '08:00' } } } }],
      },
    };
    expect(decodeValue(raw)).toEqual([{ t: '08:00' }]);
  });

  it('bilinmeyen tip ve bozuk girdide null döner', () => {
    expect(decodeValue({ weirdValue: 1 })).toBeNull();
    expect(decodeValue(null)).toBeNull();
    expect(decodeValue(undefined)).toBeNull();
    expect(decodeValue('düz string')).toBeNull();
    expect(decodeValue({ integerValue: 'abc' })).toBeNull();
  });
});

describe('decodeFields / getField / docId', () => {
  const doc = {
    name: 'projects/p/databases/(default)/documents/users/abc123',
    fields: {
      name: { stringValue: 'enc:AbCd==' },
      stockCount: { integerValue: '3' },
      tags: { arrayValue: { values: [{ stringValue: 'ağrı' }] } },
      isPrivate: { booleanValue: false },
    },
  };

  it('tüm alanları düz objeye çözer', () => {
    expect(decodeFields(doc)).toEqual({
      name: 'enc:AbCd==',
      stockCount: 3,
      tags: ['ağrı'],
      isPrivate: false,
    });
  });

  it('getField tek alanı çözer, olmayan alan null', () => {
    expect(getField(doc, 'stockCount')).toBe(3);
    expect(getField(doc, 'yok')).toBeNull();
    expect(getField(null, 'name')).toBeNull();
  });

  it('docId son segmenti döndürür', () => {
    expect(docId(doc)).toBe('abc123');
    expect(docId({})).toBeNull();
  });

  it('fields eksikse boş obje', () => {
    expect(decodeFields({})).toEqual({});
    expect(decodeFields(null)).toEqual({});
  });
});
