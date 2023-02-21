import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyAF9MbNcEn51_ousOv1myNZPQO4BYsVEeE',
  authDomain: 'omnilens-d5745.firebaseapp.com',
  projectId: 'omnilens-d5745',
  databaseURL: 'https://project-id.firebaseio.com',
  storageBucket: 'gs://omnilens-d5745.appspot.com',
  messagingSenderId: '743604615483',
  appId: '1:743604615483:web:675196607f05ad4f3a1f1e',
  measurementId: 'G-Y8SB232S1M',
};

// Use this to initialize the firebase App
const firebaseApp = firebase.initializeApp(firebaseConfig);
console.log('firebaseApp', firebaseApp);
// Use these for db & auth
const db = firebaseApp.firestore();
console.log('db', db);
const auth = firebaseApp.auth();
console.log('auth', auth);

const storage = firebaseApp.storage();
console.log('storage', storage);

export {auth, db, storage};
