import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDUanmeOGH48FBNhrevAhpm8q8GY-adceo",
  authDomain: "tutorflow-a3cfd.firebaseapp.com",
  projectId: "tutorflow-a3cfd",
  storageBucket: "tutorflow-a3cfd.firebasestorage.app",
  messagingSenderId: "749654411780",
  appId: "1:749654411780:web:a836a257a55d3b5a808351"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Configure providers
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

// Configure additional scopes for Google
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Configure additional scopes for Facebook
facebookProvider.addScope('email');
facebookProvider.addScope('public_profile');

export default app;