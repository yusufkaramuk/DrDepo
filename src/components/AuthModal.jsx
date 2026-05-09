import React, { useEffect, useState } from 'react';
import { X, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { Button, Input } from './ui/BaseComponents';

const AUTH_COOLDOWN_MS = 5000;

const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
        <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
);

export const AuthModal = ({ isOpen, onClose, onAuth }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        displayName: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');
    const [loading, setLoading] = useState(false);
    const [resetMode, setResetMode] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);
    const [cooldownUntil, setCooldownUntil] = useState(0);
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        if (now >= cooldownUntil) return undefined;
        const timer = window.setInterval(() => setNow(Date.now()), 500);
        return () => window.clearInterval(timer);
    }, [cooldownUntil, now]);

    const cooldownRemaining = Math.max(0, Math.ceil((cooldownUntil - now) / 1000));
    const isCooldownActive = cooldownRemaining > 0;

    const startCooldown = () => {
        const next = Date.now() + AUTH_COOLDOWN_MS;
        setNow(Date.now());
        setCooldownUntil(next);
    };

    const resetForm = () => {
        setFormData({ email: '', password: '', displayName: '', confirmPassword: '' });
        setError('');
        setInfo('');
    };

    const handleGoogleSignIn = async () => {
        setError('');
        setLoading(true);
        try {
            await onAuth('google', {});
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResendVerification = async () => {
        if (!formData.email || !formData.password) {
            setError('Dogrulama mailini tekrar gondermek icin e-posta ve sifrenizi girin');
            return;
        }
        setError('');
        setLoading(true);
        try {
            await onAuth('resend', { email: formData.email, password: formData.password });
            setInfo('Dogrulama maili tekrar gonderildi. Gelen kutunuzu kontrol edin.');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setInfo('');

        if ((resetMode || !isSignUp) && isCooldownActive) {
            setError(`Lutfen ${cooldownRemaining} saniye sonra tekrar deneyin`);
            return;
        }

        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Gecerli bir e-posta adresi girin');
            return;
        }

        if (resetMode) {
            try {
                setLoading(true);
                await onAuth('reset', { email: formData.email });
                setInfo('Eger bu e-posta kayitliysa sifre sifirlama baglantisi gonderilecektir.');
                setResetMode(false);
                resetForm();
            } catch (err) {
                setError(err.message);
            } finally {
                startCooldown();
                setLoading(false);
            }
            return;
        }

        if (!formData.password || formData.password.length < 6) {
            setError('Sifre en az 6 karakter olmalidir');
            return;
        }

        if (isSignUp) {
            if (!formData.displayName.trim()) {
                setError('Isim soyisim gereklidir');
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                setError('Sifreler eslesmiyor');
                return;
            }
        }

        try {
            setLoading(true);
            const result = await onAuth(isSignUp ? 'signup' : 'signin', formData);

            if (result?.needsVerification) {
                setVerificationSent(true);
            } else {
                onClose();
            }
        } catch (err) {
            setError(err.message);
        } finally {
            if (!isSignUp) startCooldown();
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        setError('');
        setInfo('');
        setResetMode(false);
        setVerificationSent(false);
    };

    const toggleResetMode = () => {
        setResetMode(!resetMode);
        setError('');
        setInfo('');
    };

    if (!isOpen) return null;

    // E-posta doğrulama bekliyor ekranı
    if (verificationSent) {
        return (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl w-full max-w-md shadow-xl p-8 flex flex-col items-center gap-4 text-center">
                    <CheckCircle size={48} className="text-green-500" />
                    <h2 className="text-xl font-bold text-gray-800">E-postanizi Dogrulayin</h2>
                    <p className="text-gray-600 text-sm">
                        <span className="font-medium">{formData.email}</span> adresine bir dogrulama maili gonderdik.
                        Linke tiklayin ve ardından giris yapin.
                    </p>
                    <p className="text-gray-400 text-xs">
                        Mail gelmediyse spam klasorunu kontrol edin.
                    </p>
                    <Button
                        onClick={() => { setVerificationSent(false); setIsSignUp(false); resetForm(); }}
                        className="w-full"
                    >
                        Giris Ekranina Don
                    </Button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-sm text-gray-400 hover:underline"
                    >
                        Kapat
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">
                        {resetMode ? 'Sifremi Unuttum' : isSignUp ? 'Kayit Ol' : 'Giris Yap'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex flex-col gap-2">
                            <div className="flex items-start gap-2">
                                <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{error}</span>
                            </div>
                            {error.includes('dogrulanmamis') && (
                                <button
                                    type="button"
                                    onClick={handleResendVerification}
                                    className="text-sm text-red-600 font-medium hover:underline text-left pl-6"
                                >
                                    Dogrulama mailini tekrar gonder
                                </button>
                            )}
                        </div>
                    )}

                    {info && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-2">
                            <CheckCircle size={18} className="mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{info}</span>
                        </div>
                    )}

                    {/* Google ile Giriş — sadece giriş/kayıt modunda göster */}
                    {!resetMode && (
                        <>
                            <button
                                type="button"
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 disabled:opacity-50"
                            >
                                <GoogleIcon />
                                Google ile {isSignUp ? 'Kayit Ol' : 'Giris Yap'}
                            </button>

                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-gray-200" />
                                <span className="text-xs text-gray-400">veya e-posta ile</span>
                                <div className="flex-1 h-px bg-gray-200" />
                            </div>
                        </>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {!resetMode && isSignUp && (
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <User size={16} /> Isim Soyisim
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Orn: Yusuf Karamuk"
                                    value={formData.displayName}
                                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                    required
                                />
                            </div>
                        )}

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Mail size={16} /> E-posta
                            </label>
                            <Input
                                type="email"
                                placeholder="ornek@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        {!resetMode && (
                            <>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Lock size={16} /> Sifre
                                    </label>
                                    <Input
                                        type="password"
                                        placeholder="En az 6 karakter"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>

                                {isSignUp && (
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <Lock size={16} /> Sifre Tekrar
                                        </label>
                                        <Input
                                            type="password"
                                            placeholder="Sifrenizi tekrar girin"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            required
                                        />
                                    </div>
                                )}
                            </>
                        )}

                        <Button type="submit" disabled={loading || isCooldownActive} className="w-full mt-1">
                            {loading
                                ? 'Lutfen bekleyin...'
                                : isCooldownActive
                                    ? `Tekrar dene (${cooldownRemaining})`
                                    : resetMode ? 'Sifirlama Baglantisi Gonder' : isSignUp ? 'Kayit Ol' : 'Giris Yap'}
                        </Button>

                        <div className="flex flex-col gap-2 text-sm text-center">
                            {!resetMode && (
                                <button
                                    type="button"
                                    onClick={toggleMode}
                                    className="text-purple-600 hover:underline"
                                >
                                    {isSignUp ? 'Zaten hesabim var, giris yap' : 'Hesabin yok mu? Kayit ol'}
                                </button>
                            )}

                            {!isSignUp && (
                                <button
                                    type="button"
                                    onClick={toggleResetMode}
                                    className="text-gray-600 hover:underline"
                                >
                                    {resetMode ? 'Giris ekranina don' : 'Sifremi unuttum'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
