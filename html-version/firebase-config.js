// Firebase Module Configuration with Auth and Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut, 
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  deleteDoc,
  addDoc,
  collection, 
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCM-5poCiU09Gvw8YHacVkHbbJhs2a3zmY",
  authDomain: "hackathon-5f7f8.firebaseapp.com",
  projectId: "hackathon-5f7f8",
  storageBucket: "hackathon-5f7f8.firebasestorage.app",
  messagingSenderId: "935677657257",
  appId: "1:935677657257:web:141da5a9d3bef2c421a9b8",
  measurementId: "G-XH6R5L5LJH"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Ensures user is authenticated (anonymously if not logged in) to pass Firebase Auth Security Rules
export async function ensureFirebaseAuth() {
  if (!auth.currentUser) {
    try {
      await signInAnonymously(auth);
      console.log("Authenticated with Firebase Anonymously:", auth.currentUser?.uid);
    } catch (e) {
      console.warn("Anonymous auth notice:", e);
    }
  }
  return auth.currentUser;
}

export { 
  app, 
  auth, 
  db,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut, 
  onAuthStateChanged,
  updateProfile,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  addDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp
};
