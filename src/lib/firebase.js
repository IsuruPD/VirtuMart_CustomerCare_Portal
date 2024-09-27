import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  //import.meta.env.VITE_API_KEY
  apiKey: "AIzaSyB7vDwuROMdAmbkn_adj_LbvjhUVfj88Qg",
  authDomain: "virtumart-d6965.firebaseapp.com",
  projectId: "virtumart-d6965",
  storageBucket: "virtumart-d6965.appspot.com",
  messagingSenderId: "624151482397",
  appId: "1:624151482397:web:f520a9b3792c35e8a936f4",
  measurementId: "G-V9B5T652BE"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth()
const db = getFirestore()
const storage = getStorage()

export { auth, db, storage, collection };