// MANUEL İÇE AKTARMA KOMUTU
// Tarayıcı console'una (F12) yapıştır ve çalıştır

// 1. LocalStorage'daki ilaçları al
const localMedicines = JSON.parse(localStorage.getItem('medicines') || '[]');
console.log('LocalStorage ilaçları:', localMedicines);
console.log('Toplam:', localMedicines.length, 'ilaç');

// 2. Firebase'e yükle
// NOT: Bu kodu kullanmadan önce giriş yapmış olman gerekiyor!

// Kopyala ve console'a yapıştır:
/*
(async () => {
  const { getAuth } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
  const { getFirestore, collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
  
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;
  
  if (!user) {
    console.error('Giriş yapmalısın!');
    return;
  }
  
  const localMedicines = JSON.parse(localStorage.getItem('medicines') || '[]');
  console.log(`${localMedicines.length} ilaç yüklenecek...`);
  
  let count = 0;
  for (const medicine of localMedicines) {
    await addDoc(collection(db, `users/${user.uid}/medicines`), {
      name: medicine.name || '',
      quantity: medicine.quantity || '',
      expiryDate: medicine.expiryDate || '',
      activeIngredient1: medicine.activeIngredient1 || '',
      activeIngredient2: medicine.activeIngredient2 || '',
      activeIngredient3: medicine.activeIngredient3 || '',
      notes: medicine.notes || '',
      createdAt: medicine.createdAt || new Date().toISOString()
    });
    count++;
    console.log(`${count}/${localMedicines.length} yüklendi...`);
  }
  
  console.log('✅ Tamamlandı!', count, 'ilaç Firebase\'e yüklendi!');
  alert(`✅ ${count} ilaç başarıyla yüklendi! Sayfayı yenileyin.`);
})();
*/
