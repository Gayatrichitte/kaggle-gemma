// Firebase Module Configuration with Auth and Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
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

export { 
  app, 
  auth, 
  db,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  doc,
  setDoc,
  getDoc,
  collection,
  serverTimestamp
};
