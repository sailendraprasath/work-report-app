import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCcJD-gBKiXsEFfeBPbXvCQAE34-LpqEyo",
  authDomain: "work-report-app-264c2.firebaseapp.com",
  projectId: "work-report-app-264c2",
  storageBucket: "work-report-app-264c2.firebasestorage.app",
  messagingSenderId: "202399866378",
  appId: "1:202399866378:web:17fad4dff23de657d349f3",
  measurementId: "G-K73L7L6Z3Q",
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
