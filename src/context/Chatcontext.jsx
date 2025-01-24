import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../config/firebase"; // Ensure paths are correct

const UserData = createContext();

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [firedata, setUserData] = useState(null);
  const [chatdata, setChatData] = useState([]);
  const [messageID,setMessageId]=useState(null);
  const[chatuser,setChatUser]=useState(null);
  const[message,setMessage]=useState([]);
  //const [checkvisible,setVisible]=useState(false)
const [chatVisible,setChatVisible]=useState(false);
  // Function to load user data
  const loadUserData = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const datauser = userSnap.data();
        setUserData(datauser);

        if (firedata?.name) { // Check if name exists in the user data
          navigate("/chat");
        } else {
          navigate("/profil");
        }

        // Update last seen in Firestore
        await updateDoc(userRef, { lastSeen: Date.now() });

        // Periodically update last seen
        setInterval(async () => {
          await updateDoc(userRef, { lastSeen: Date.now() });
        }, 60000);
      }
    } catch (error) {
      console.error("Error loading user data:", error.message);
    }
  };

  // Watch for changes to Firestore chat data
  useEffect(() => {
    if (firedata?.id) {
      const chatRef = doc(db, "chats", firedata.id);

      const unsub = onSnapshot(chatRef, async (res) => {
        const chatItems = res.data()?.chatdata || [];
        const tempdata = await Promise.all(
          chatItems.map(async (item) => {
            const docSnap = await getDoc(doc(db, "users", item.rID));
            return docSnap.exists()
              ? { ...item, userData: docSnap.data() }
              : null;
          })
        );
        setChatData(tempdata.filter(Boolean).sort((a, b) => b.updateAt - a.updateAt));
      });

      return () => unsub(); // Clean up snapshot listener
    }
  }, [firedata?.id]);

  const value = {
    firedata,
    setUserData,
    chatdata,
    setChatData,
    loadUserData, // Add loadUserData to context
   messageID,setMessageId,
   message,setMessage,
   chatuser,setChatUser,
  chatVisible,setChatVisible,
  };

  return <UserData.Provider value={value}>{children}</UserData.Provider>;
};

export const useData = () => {
  return useContext(UserData);
};
