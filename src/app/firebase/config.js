import { initializeApp } from "firebase/app";
import {getDatabase} from "firebase/database"
import { getAuth,connectAuthEmulator} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDhO6FOBxw6wdIEK8r8ZaO-3P2PL4Lq3C4",
  authDomain: "appshareoldproduct.firebaseapp.com",
  projectId: "appshareoldproduct",
  storageBucket: "appshareoldproduct.appspot.com",
  messagingSenderId: "122606372840",
  appId: "1:122606372840:web:3ba358379a83859f78c65d",
  measurementId: "G-2Z44EVYL61"
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth();
//connectAuthEmulator(auth, "http://localhost:9099");

const db = getDatabase();
//connectFirestoreEmulator(db, 'localhost', 8080);

export {auth,db};
export default firebaseApp;