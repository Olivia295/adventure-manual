import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAm2Pkg0MKvQaAHLA3IaSYBMe8xrQqEoWM",
    authDomain: "adventuremanual-66806.firebaseapp.com",
    projectId: "adventuremanual-66806",
    storageBucket: "adventuremanual-66806.appspot.com",
    messagingSenderId: "432327513144",
    appId: "1:432327513144:web:e3f9b2fe0127b73adac2cd",
    measurementId: "G-KE8BM5H7QD"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

db.settings({
    timestampsInSnapshots: true
})

export default db; 