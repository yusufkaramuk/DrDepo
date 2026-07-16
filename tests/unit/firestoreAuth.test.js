import { describe, expect, it } from 'vitest';
import { resolveFirebaseProjectId } from '../../scripts/lib/firestore-auth.js';

describe('resolveFirebaseProjectId', () => {
  it('workflow ve service account ayni projeyi gosteriyorsa proje kimligini dondurur', () => {
    expect(resolveFirebaseProjectId(
      { project_id: 'drdepo-18481' },
      'drdepo-18481',
    )).toBe('drdepo-18481');
  });

  it('degerlerin basindaki ve sonundaki bosluklari temizler', () => {
    expect(resolveFirebaseProjectId(
      { project_id: '  drdepo-18481  ' },
      ' drdepo-18481 ',
    )).toBe('drdepo-18481');
  });

  it('eski projeye ait service account kullanilmasini engeller', () => {
    expect(() => resolveFirebaseProjectId(
      { project_id: 'medidepo' },
      'drdepo-18481',
    )).toThrow(/proje uyusmazligi/);
  });

  it('eksik proje alanlarini acik hatayla reddeder', () => {
    expect(() => resolveFirebaseProjectId({}, 'drdepo-18481'))
      .toThrow(/project_id alani eksik/);
    expect(() => resolveFirebaseProjectId({ project_id: 'drdepo-18481' }, ''))
      .toThrow(/FIREBASE_PROJECT_ID eksik/);
  });
});
