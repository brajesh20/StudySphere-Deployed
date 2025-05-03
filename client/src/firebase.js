// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'notes-f11c9.firebaseapp.com',
  projectId: 'notes-f11c9',
  storageBucket: 'notes-f11c9.firebasestorage.app',
  messagingSenderId: '774253574119',
  appId: '1:774253574119:web:f1bb17819a7ccf3d522f42',
  measurementId: 'G-E26T79R1C3'
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

if (window.location.hostname === 'localhost') {
  auth.settings.appVerificationDisabledForTesting = true // Bypass domain checks (DEV ONLY)
}
