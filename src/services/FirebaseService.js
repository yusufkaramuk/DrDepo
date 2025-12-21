import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { firebaseConfig } from '../config/firebase';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const COLLECTION_NAME = 'medicines';

// Helper to get user-specific collection path
const getUserCollection = (userId) => {
    if (!userId) throw new Error('User not authenticated');
    return collection(db, `users/${userId}/${COLLECTION_NAME}`);
};

export const FirebaseService = {
    // Get all medicines for a specific user
    getAllMedicines: async (userId) => {
        try {
            const userCollection = getUserCollection(userId);
            const querySnapshot = await getDocs(userCollection);
            const medicines = [];
            querySnapshot.forEach((doc) => {
                medicines.push({ id: doc.id, ...doc.data() });
            });
            console.log(`[Firebase] Loaded ${medicines.length} medicines for user ${userId}`);
            return medicines;
        } catch (error) {
            console.error('[Firebase] Error getting medicines:', error);
            throw error;
        }
    },

    // Add a medicine for a specific user
    addMedicine: async (userId, medicine) => {
        try {
            const userCollection = getUserCollection(userId);
            const medicineData = {
                name: medicine.name || '',
                quantity: medicine.quantity || '',
                expiryDate: medicine.expiryDate || '',
                activeIngredient1: medicine.activeIngredient1 || '',
                activeIngredient2: medicine.activeIngredient2 || '',
                activeIngredient3: medicine.activeIngredient3 || '',
                notes: medicine.notes || '',
                createdAt: medicine.createdAt || new Date().toISOString()
            };

            console.log('[Firebase] Adding medicine for user:', userId);
            const docRef = await addDoc(userCollection, medicineData);
            console.log('[Firebase] Medicine added with ID:', docRef.id);
            return { id: docRef.id, ...medicineData };
        } catch (error) {
            console.error('[Firebase] Error adding medicine:', error);
            throw error;
        }
    },

    // Update a medicine
    updateMedicine: async (userId, id, updatedData) => {
        try {
            const cleanData = {
                name: updatedData.name || '',
                quantity: updatedData.quantity || '',
                expiryDate: updatedData.expiryDate || '',
                activeIngredient1: updatedData.activeIngredient1 || '',
                activeIngredient2: updatedData.activeIngredient2 || '',
                activeIngredient3: updatedData.activeIngredient3 || '',
                notes: updatedData.notes || ''
            };

            const medicineRef = doc(db, `users/${userId}/${COLLECTION_NAME}`, id);
            await updateDoc(medicineRef, cleanData);
            console.log('[Firebase] Medicine updated:', id);
        } catch (error) {
            console.error('[Firebase] Error updating medicine:', error);
            throw error;
        }
    },

    // Delete a medicine
    deleteMedicine: async (userId, id) => {
        try {
            await deleteDoc(doc(db, `users/${userId}/${COLLECTION_NAME}`, id));
            console.log('[Firebase] Medicine deleted:', id);
        } catch (error) {
            console.error('[Firebase] Error deleting medicine:', error);
            throw error;
        }
    },

    // Real-time listener for changes
    subscribeMedicines: (userId, callback) => {
        const userCollection = getUserCollection(userId);
        const unsubscribe = onSnapshot(userCollection, (snapshot) => {
            const medicines = [];
            snapshot.forEach((doc) => {
                medicines.push({ id: doc.id, ...doc.data() });
            });
            console.log('[Firebase] Real-time update:', medicines.length, 'medicines');
            callback(medicines);
        });
        return unsubscribe;
    }
};
