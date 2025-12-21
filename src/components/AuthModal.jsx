import React, { useState } from 'react';
import { X, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { Button, Input } from './ui/BaseComponents';

export const AuthModal = ({ isOpen, onClose, onAuth }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        displayName: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resetMode, setResetMode] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.email || !formData.email.includes('@')) {
            setError('Geçerli bir e-posta adresi girin');
            return;
        }

        if (resetMode) {
            // Password reset
            try {
                setLoading(true);
                await onAuth('reset', { email: formData.email });
                alert('Şifre sıfırlama bağlantısı e-postanıza gönderildi!');
                setResetMode(false);
                setFormData({ email: '', password: '', displayName: '', confirmPassword: '' });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
            return;
        }

        if (!formData.password || formData.password.length < 6) {
            setError('Şifre en az 6 karakter olmalıdır');
            return;
        }

        if (isSignUp) {
            if (!formData.displayName) {
                setError('İsim soyisim gereklidir');
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                setError('Şifreler eşleşmiyor');
                return;
            }
        }

        try {
            setLoading(true);
            await onAuth(isSignUp ? 'signup' : 'signin', formData);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        setError('');
        setResetMode(false);
    };

    const toggleResetMode = () => {
        setResetMode(!resetMode);
        setError('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">
                        {resetMode ? 'Şifremi Unuttum' : isSignUp ? 'Kayıt Ol' : 'Giriş Yap'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
                            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    {!resetMode && isSignUp && (
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <User size={16} /> İsim Soyisim
                            </label>
                            <Input
                                type="text"
                                placeholder="Örn: Yusuf Karamuk"
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
                                    <Lock size={16} /> Şifre
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
                                        <Lock size={16} /> Şifre Tekrar
                                    </label>
                                    <Input
                                        type="password"
                                        placeholder="Şifrenizi tekrar girin"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        required
                                    />
                                </div>
                            )}
                        </>
                    )}

                    <Button type="submit" disabled={loading} className="w-full mt-2">
                        {loading ? 'Lütfen bekleyin...' : resetMode ? 'Sıfırlama Bağlantısı Gönder' : isSignUp ? 'Kayıt Ol' : 'Giriş Yap'}
                    </Button>

                    <div className="flex flex-col gap-2 text-sm text-center">
                        {!resetMode && (
                            <button
                                type="button"
                                onClick={toggleMode}
                                className="text-purple-600 hover:underline"
                            >
                                {isSignUp ? 'Zaten hesabım var, giriş yap' : 'Hesabın yok mu? Kayıt ol'}
                            </button>
                        )}

                        {!isSignUp && (
                            <button
                                type="button"
                                onClick={toggleResetMode}
                                className="text-gray-600 hover:underline"
                            >
                                {resetMode ? 'Giriş ekranına dön' : 'Şifremi unuttum'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};
