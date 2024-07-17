// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9B9Dap940QV0iW1Tza7SzC4xqOD6dyaw",
  authDomain: "sport-lessor.firebaseapp.com",
  projectId: "sport-lessor",
  storageBucket: "sport-lessor.appspot.com",
  messagingSenderId: "260870240777",
  appId: "1:260870240777:web:3ddd81982d5c7dd61696d8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
