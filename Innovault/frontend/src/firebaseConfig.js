
import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey: "AIzaSyCpqQgCgHU6uf-OZhqZtFQA_eW1z4rXYI8",
  authDomain: "real-time-monitoring-92f83.firebaseapp.com",
  databaseURL: "https://real-time-monitoring-92f83-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "real-time-monitoring-92f83",
  storageBucket: "real-time-monitoring-92f83.firebasestorage.app",
  messagingSenderId: "36258284979",
  appId: "1:36258284979:web:01eaff3e9725e7399037c6"
};


const app = initializeApp(firebaseConfig);

export default app;