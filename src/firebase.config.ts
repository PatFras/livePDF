// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.firebase_api_key,
  authDomain: "livepdf-dd924.firebaseapp.com",
  projectId: "livepdf-dd924",
  storageBucket: "livepdf-dd924.appspot.com",
  messagingSenderId: "992255027009",
  appId: "1:992255027009:web:1e31e7e92bc2f351d4e3c0",
  measurementId: "G-PX2FWWZK15"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };