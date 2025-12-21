import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    updateProfile
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../config/firebase';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const AuthService = {
    // Sign up new user
    signUp: async (email, password, displayName) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Update profile with display name
            if (displayName) {
                await updateProfile(userCredential.user, { displayName });
            }

            console.log('[Auth] User signed up:', userCredential.user.uid);
            return userCredential.user;
        } catch (error) {
            console.error('[Auth] Sign up error:', error);
            throw new Error(getErrorMessage(error.code));
        }
    },

    // Sign in existing user
    signIn: async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('[Auth] User signed in:', userCredential.user.uid);
            return userCredential.user;
        } catch (error) {
            console.error('[Auth] Sign in error:', error);
            throw new Error(getErrorMessage(error.code));
        }
    },

    // Sign out
    signOut: async () => {
        try {
            await signOut(auth);
            console.log('[Auth] User signed out');
        } catch (error) {
            console.error('[Auth] Sign out error:', error);
            throw new Error('Çıkış yapılırken hata oluştu');
        }
    },

    // Reset password
    resetPassword: async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            console.log('[Auth] Password reset email sent to:', email);
        } catch (error) {
            console.error('[Auth] Password reset error:', error);
            throw new Error(getErrorMessage(error.code));
        }
    },

    // Listen to auth state changes
    onAuthStateChanged: (callback) => {
        return onAuthStateChanged(auth, callback);
    },

    // Get current user
    getCurrentUser: () => {
        return auth.currentUser;
    }
};

// Helper function to get user-friendly error messages
const getErrorMessage = (errorCode) => {
    switch (errorCode) {
        case 'auth/email-already-in-use':
            return 'Bu e-posta adresi zaten kullanımda';
        case 'auth/invalid-email':
            return 'Geçersiz e-posta adresi';
        case 'auth/operation-not-allowed':
            return 'Bu işlem şu an kullanılamıyor';
        case 'auth/weak-password':
            return 'Şifre çok zayıf (en az 6 karakter)';
        case 'auth/user-disabled':
            return 'Bu hesap devre dışı bırakılmış';
        case 'auth/user-not-found':
            return 'Kullanıcı bulunamadı';
        case 'auth/wrong-password':
            return 'Hatalı şifre';
        case 'auth/invalid-credential':
            return 'Geçersiz kimlik bilgileri';
        case 'auth/too-many-requests':
            return 'Çok fazla deneme. Lütfen daha sonra tekrar deneyin';
        default:
            return 'Bir hata oluştu: ' + errorCode;
    }
};
