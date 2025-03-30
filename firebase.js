// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // added
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  
  authDomain: "cognisense-react.firebaseapp.com",
  projectId: "cognisense-react",
  storageBucket: "cognisense-react.firebasestorage.app",
  messagingSenderId: "342377097864",
  appId: "1:342377097864:web:2c2f48a99cc00adbabcd3d",
  measurementId: "G-FSTFG49CCD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Initialize Firestore if needed
const auth = getAuth(app); // initialize Firebase Auth

// Export the initialized services to use in other parts of your project
export { app, analytics, db, auth };