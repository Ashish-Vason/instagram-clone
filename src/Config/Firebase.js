
import firebase from "firebase"

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyA1DNkpYrCaFjzDlALFhs0KR--B5gqnnYQ",
    authDomain: "instagram-clone-c30db.firebaseapp.com",
    projectId: "instagram-clone-c30db",
    storageBucket: "instagram-clone-c30db.appspot.com",
    messagingSenderId: "360746281795",
    appId: "1:360746281795:web:005d17c1a38f6c7ed85df6",
    measurementId: "G-ZFJ6BNFNQ9"
  });

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export {db, auth, storage};

  