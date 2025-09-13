// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  "projectId": "studio-4089759599-17905",
  "appId": "1:426991145991:web:17852f3d210b6dd7ab46a2",
  "storageBucket": "studio-4089759599-17905.firebasestorage.app",
  "apiKey": "AIzaSyAzoHggsBBZZij-S5LaS5yeXPafb37h6CA",
  "authDomain": "studio-4089759599-17905.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "426991145991"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
