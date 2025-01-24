// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toastify styles

import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOHVcD97sWcDVIGrJHRtY_aqY3rjJmiq0",
  authDomain: "chatapp-5c49b.firebaseapp.com",
  projectId: "chatapp-5c49b",
  storageBucket: "chatapp-5c49b.appspot.com",
  messagingSenderId: "624059726382",
  appId: "1:624059726382:web:9a9043e6807e598d4bfdbf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); 
 export const auth = getAuth(app);
 export const db = getFirestore(app);

// Signup Function
const signup = async (username, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    // Add user data to Firestore
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      username: username.toLowerCase(),
      email: email,
      name: " ",
      avatar: "",
      bio: "Hey, I am using ChatApp",
      lastSeen: Date.now(),
    });

    // Initialize user's chat data
    await setDoc(doc(db, "chats", user.uid), {
      chatdata: []
    });

    toast.success("Signup successful!");
  } catch (error) {
    console.error("Signup Error:", error);
    toast.error(error.message.split("/")[1]); // Display only the error message
  }
};

// Login Function
const login = async (email, password) => {
  try {
     await signInWithEmailAndPassword(auth, email, password);
    toast.success("Login successful!");
    //return res; // Return user info if needed
  } catch (error) {
    console.error("Login Error:", error);
    toast.error(error.message); // Display only the error message
  }
};
const logout= async()=>{
 //  await signOut(auth)
 try {
  await signOut(auth)
  toast.success("LogOut Successfully")
 } catch (error) {
  toast.error(error.message.split("/")[1])
 }
}
export { signup, login ,logout};
