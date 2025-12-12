import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAeEVBmJGaW6jBiQxXFeRLM38DYvlYcwuM",
  authDomain: "pronunciation-exam-pro.firebaseapp.com",
  projectId: "pronunciation-exam-pro",
  storageBucket: "pronunciation-exam-pro.firebasestorage.app",
  messagingSenderId: "945368789678",
  appId: "1:945368789678:web:f2abc4395a40776d7e733f",
  measurementId: "G-0QLP2XWSCT"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Inisialisasi dan dapatkan instance Firestore
const db = getFirestore(app);

// Ekspor instance database dan fungsi-fungsi Firestore yang relevan
export { db, collection, doc, getDoc };