// public/js/firebase-init.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
// CORRECTED: Added addDoc to the import list for Firestore
import { enableIndexedDbPersistence, getFirestore, doc, setDoc, deleteDoc, onSnapshot, collection, getDoc,getDocs, addDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-analytics.js";

// --- Firebase Configuration (YOURS!) ---
const firebaseConfig = {
    apiKey: "AIzaSyCmzYS-OnZYxtpDgmM8v5ozVrSPhs3Pwe0",
    authDomain: "nothingimport.firebaseapp.com",
    projectId: "nothingimport",
    storageBucket: "nothingimport.firebasestorage.app",
    messagingSenderId: "885578844902",
    appId: "1:885578844902:web:db57e1b17fe885fdb0c927",
    measurementId: "G-Z6SZEZE9HBCG"
};

let app;
let db;
let auth;
let analytics;

// Shared global state variables (initialized here, updated by auth state in index.html)
export let userId = null;
export let userEmail = null;
export let userFavorites = new Set(); // Stores titles of favorited items

// --- University Structure Data (Owner Defined) ---
export const universityStructure = {
    "كلية الحاسبات": {
        "برمجة 2": ["CPCS203"],
        "تراكيب متقطعة": ["CPCS222"],
        "برمجة 1": ["CPCS202"],
        "تراكيب بيانات 1": ["CPCS204"],
	"تصميم المنطق الرقمي": ["CPCS211"],
	"تراكيب تطبيقية للحوسبة 1": ["CPCS212"],
    },
    "كلية الاقتصاد والإدارة": {
        "don't know the courses": ["MATH101", "MATH202"],
        "don't know the courses": ["MATH303", "MATH404"]
    },
    "كلية الآداب والعلوم الإنسانية": {
        "don't know the courses": ["ENGL101", "ENGL201"],
        "don't know the courses": ["ENGL301", "ENGL401"]
    },
    "كلية العلوم": {
        "don't know the courses": ["BAD101", "BAD201"],
        "don't know the courses": ["MKTG301", "MKTG401"]
    }
};

export async function initializeFirebase() {
    if (app) return; // Already initialized

    try {
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);
        analytics = getAnalytics(app);

        try {
            await enableIndexedDbPersistence(db, { experimentalForceLongPolling: true });
            console.log("Firestore offline persistence enabled.");
        } catch (err) {
            if (err.code === 'failed-precondition') {
                console.warn("Firestore persistence could not be enabled: Multiple tabs open. Data will not be persisted offline.");
            } else if (err.code === 'unimplemented') {
                console.warn("Firestore persistence could not be enabled: Browser does not support it.");
            } else {
                console.error("Error enabling Firestore persistence:", err);
            }
        }
        console.log("Firebase initialized successfully.");

        // Export the Firebase instances (these are handled by the global exports below for modules)
        // return { app, db, auth, analytics };

    } catch (error) {
        console.error("Error initializing Firebase:", error);
        alert("Failed to initialize Firebase. Please check your configuration and network connection.");
    }
}

// Export individual Firebase instances and functions
export {
    app, db, auth, analytics,
    onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, sendEmailVerification,
    doc, setDoc, deleteDoc, onSnapshot, collection, getDoc,getDocs, addDoc // <-- addDoc is now correctly included in the export list
};

// Function to update userId and userEmail (called from index.html on auth state change)
export function updateGlobalUser(id, email) {
    userId = id;
    userEmail = email;
    console.log("Global user updated:", userId, userEmail);
}

export function updateGlobalFavorites(favoritesSet) {
    userFavorites = favoritesSet;
    console.log("Global favorites updated:", userFavorites);
}