// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB-gss4J49R_6fGrPzoNw9ElnSJfvr1tfc",
    authDomain: "pantry-tracker-ff841.firebaseapp.com",
    projectId: "pantry-tracker-ff841",
    storageBucket: "pantry-tracker-ff841.appspot.com",
    messagingSenderId: "305077232177",
    appId: "1:305077232177:web:d5796c28a9af3d5b17eb10",
    measurementId: "G-QS0WC0DKL0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
export {
    app,
    firestore
}
// const analytics = getAnalytics(app);