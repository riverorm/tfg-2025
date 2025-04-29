import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAcKXYCsN4BNy5xlxjPLK65Bj_xBmSMHSg",
  authDomain: "tfg-2025-7ba2a.firebaseapp.com",
  projectId: "tfg-2025-7ba2a",
  storageBucket: "tfg-2025-7ba2a.firebasestorage.app",
  messagingSenderId: "392949634182",
  appId: "1:392949634182:web:8ca4f767a7f43bc4036d07",
  measurementId: "G-G7EN7T0JL6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };