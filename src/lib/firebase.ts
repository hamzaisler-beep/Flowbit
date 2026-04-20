import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCPQwBnt9tYbBzVIQBlzFB-PQhUdGCmFJ8",
  authDomain: "flowbit-5ae8e.firebaseapp.com",
  projectId: "flowbit-5ae8e",
  storageBucket: "flowbit-5ae8e.firebasestorage.app",
  messagingSenderId: "590436551167",
  appId: "1:590436551167:web:d3ce67dc8e527f7217ffca",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
