import { initializeApp } from 'firebase/app';

// Optionally import the services that you want to use
import { getAuth,createUserWithEmailAndPassword } from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAF9MbNcEn51_ousOv1myNZPQO4BYsVEeE",
    authDomain: "omnilens-d5745.firebaseapp.com",
    projectId: "omnilens-d5745",
    databaseURL: 'https://project-id.firebaseio.com',
    storageBucket: "omnilens-d5745.appspot.com",
    messagingSenderId: "743604615483",
    appId: "1:743604615483:web:675196607f05ad4f3a1f1e",
    measurementId: "G-Y8SB232S1M"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
console.log(auth);

export default auth
