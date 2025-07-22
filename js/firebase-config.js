import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCzHmIimieea8H9KzYFDSqD0lGOCZjxHYw",
  authDomain: "myapp-ee226.firebaseapp.com",
  databaseURL: "https://myapp-ee226-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "myapp-ee226",
  storageBucket: "myapp-ee226.appspot.com",
  messagingSenderId: "272405753135",
  appId: "1:272405753135:web:598ec27c28bcf6b04105da",
  measurementId: "G-D5KYTMJ5WK"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

export { auth, db, storage };
