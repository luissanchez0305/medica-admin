// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANVrLz4z5Wy5j1TNsZYDoQSSznqJ4yIHc",
  authDomain: "medica-90383.firebaseapp.com",
  projectId: "medica-90383",
  storageBucket: "medica-90383.appspot.com",
  messagingSenderId: "847592309716",
  appId: "1:847592309716:web:445d1c71a8a3f4d7e9cc41",
  measurementId: "G-P7GWC55QKG",
};
// Initialize Firebase

const app = initializeApp(firebaseConfig);
// Export firestore database
// It will be imported into your react app whenever it is needed
const db = getFirestore(app);
export default db;
