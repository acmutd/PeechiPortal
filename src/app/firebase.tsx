import firebase from "firebase/compat/app";
import "firebase/auth";
import "firebase/firestore";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD1BDGDKkCpueNyOkfyB_Nz1w2HhWqZUa0",
  authDomain: "acm-games-s25.firebaseapp.com",
  projectId: "acm-games-s25",
  storageBucket: "acm-games-s25.firebasestorage.app",
  messagingSenderId: "100444878245",
  appId: "1:100444878245:web:a4cd4055bb688350eca44c"
};
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
//Dummy comment
export { app, auth, db };