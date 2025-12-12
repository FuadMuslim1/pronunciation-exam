import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBwShyAwMUoenFw5MUebCX_nxGd9Z926BQ",
    authDomain: "the-examination.firebaseapp.com",
    projectId: "the-examination",
    storageBucket: "the-examination.firebasestorage.app",
    messagingSenderId: "614990640750",
    appId: "1:614990640750:web:e5420a4beb25e9447d987f",
    measurementId: "G-H6YH9SXD59"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Inisialisasi dan dapatkan instance Firestore
const db = getFirestore(app);

// Ekspor instance database dan fungsi-fungsi Firestore yang relevan
export { db, collection, doc, getDoc };