import React, { useState } from 'react';
import { Lock, Shield, KeyRound, AlertCircle } from 'lucide-react';
import { resolvePassphraseRequest, rejectPassphraseRequest } from '../services/EncryptionService';

export function PassphraseModal({ isNew, isRetry, onClose }) {
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState(isRetry ? 'Girdiğiniz şifre hatalı, lütfen tekrar deneyin.' : '');

  const validatePassphrase = (pwd) => {
    if (pwd.length < 8) return 'Şifre en az 8 karakter olmalıdır.';
    if (!/[A-Z]/.test(pwd)) return 'Şifrede en az 1 büyük harf bulunmalıdır.';
    if (!/[0-9]/.test(pwd)) return 'Şifrede en az 1 rakam bulunmalıdır.';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) return 'Şifrede en az 1 özel karakter (sembol) bulunmalıdır.';
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmed = passphrase.trim();
    if (!trimmed) {
      setError('Şifre boş bırakılamaz.');
      return;
    }

    if (isNew) {
      const validationError = validatePassphrase(trimmed);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    resolvePassphraseRequest(trimmed);
    onClose();
  };

  const handleCancel = () => {
    rejectPassphraseRequest('CANCELLED');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-8 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col relative overflow-hidden animate-[slideUp_0.3s_ease-out]">
        
        {/* Decorative background blur */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-6 mx-auto">
          {isNew ? <Shield size={32} /> : <KeyRound size={32} />}
        </div>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 text-center mb-2 tracking-tight">
          {isNew ? 'Güvenlik Şifrenizi Belirleyin' : 'Güvenlik Şifrenizi Girin'}
        </h2>
        
        <p className="text-center text-[14px] text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          {isNew 
            ? 'Sistemimiz, bilgilerinizi sadece sizin görebileceğiniz şekilde kilitler. Bu yüzden, size özel bir kilit şifresi belirlemeniz gerekiyor.' 
            : 'Bilgileriniz sadece size özel kilitlendiği için, onlara erişebilmemiz adına kilit şifrenizi girmeniz gerekiyor.'}
        </p>

        {error && (
          <div className="mb-5 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl flex items-start gap-2">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span className="text-[13.5px] font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Lock size={18} />
            </div>
            <input 
              type="password" 
              autoFocus
              placeholder="••••••••" 
              value={passphrase}
              onChange={(e) => {
                setPassphrase(e.target.value);
                if (error) setError('');
              }}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:focus:ring-emerald-500/20 outline-none text-[15px] text-slate-900 dark:text-slate-100 transition-all font-medium"
            />
          </div>

          {isNew && (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-[12px] text-slate-500 dark:text-slate-400 space-y-1.5 border border-slate-100 dark:border-slate-800">
              <div className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Şifre Kuralları:</div>
              <div className={`flex items-center gap-2 ${passphrase.length >= 8 ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${passphrase.length >= 8 ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                En az 8 karakter
              </div>
              <div className={`flex items-center gap-2 ${/[A-Z]/.test(passphrase) ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(passphrase) ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                En az 1 büyük harf
              </div>
              <div className={`flex items-center gap-2 ${/[0-9]/.test(passphrase) ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(passphrase) ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                En az 1 rakam
              </div>
              <div className={`flex items-center gap-2 ${/[!@#$%^&*(),.?":{}|<>]/.test(passphrase) ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${/[!@#$%^&*(),.?":{}|<>]/.test(passphrase) ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                En az 1 sembol (!@#$ vb.)
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-2">
            <button 
              type="button" 
              onClick={handleCancel}
              className="px-5 py-3.5 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              İptal Et
            </button>
            <button 
              type="submit" 
              className="flex-1 px-5 py-3.5 rounded-xl font-semibold text-white bg-emerald-500 hover:bg-emerald-600 shadow-[0_8px_20px_-8px_rgba(16,185,129,0.5)] transition-all"
            >
              Onayla ve Devam Et
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
