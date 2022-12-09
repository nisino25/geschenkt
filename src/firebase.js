import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


const firebaseConfig = {
  apiKey: "AIzaSyDWuDRDGwWZSnLyrCLuzghhcRyMtknGRjg",
  authDomain: "geschenkt-63926.firebaseapp.com",
  projectId: "geschenkt-63926",
  storageBucket: "geschenkt-63926.appspot.com",
  messagingSenderId: "36156191133",
  appId: "1:36156191133:web:bfc7205029809f65007f74",
  measurementId: "G-H5FXFKWCRT"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
export default db;