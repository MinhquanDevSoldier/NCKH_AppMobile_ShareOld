import { initializeApp } from "firebase/app";
import {getDatabase} from "firebase/database"
import {getStorage} from "firebase/storage";
import { getAuth} from "firebase/auth";

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
const auth = getAuth(firebaseApp);
const db = getDatabase(firebaseApp);
const storage = getStorage(firebaseApp);

export {auth,db,storage};
export default firebaseApp;