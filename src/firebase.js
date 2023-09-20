import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "lecoreco-50590.firebaseapp.com",
    projectId: "lecoreco-50590",
    storageBucket: "lecoreco-50590.appspot.com",
    messagingSenderId: "21542480693",
    appId: "1:21542480693:web:a8dc7f2aad3d3571bb7a7c"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore();
export default app;