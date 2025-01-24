import React, { useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { toast, ToastContainer } from "react-toastify";
import { useData } from "../context/Chatcontext";
import assets from "../assets/assets";
import Option from "../components/Option";

function Left() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const[dot,setDot]=useState(false)
  const { firedata, chatdata,chatuser,setChatUser ,messageID,setMessageId , chatVisible,setChatVisible} = useData();
console.log(chatVisible)
  const handleSearch = async (e) => {
    const value = e.target.value;
    setInput(value);
   

    if (!value.trim()) {
      setResults([]);
      return;
    }

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", value.toLowerCase()));
      const qSnap = await getDocs(q);
      const users = qSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const filteredUsers = users.filter((user) =>user.id!=firedata.id);
      if (!qSnap.empty&&filteredUsers) {
        let userExist=false;
        chatdata.map((user)=>user.rID===users.id)
        userExist=true
        //const users = qSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        //const filteredUsers = users.filter((user) =>user.id!=firedata.id);
if(userExist){
        setResults(filteredUsers);
      }
      } else {
        setResults([]);
      }
    } catch (error) {
      toast.error("Error searching users: " + error.message);
    }
  };
  //const togglechat=()=>{
   // console.log("working")
    //setChatVisible((pre)=>!pre) 
    //console.log("yes it is");   
 // }
//setVisible(true)
  const addToMessage = async (user) => {
    try {
      console.log(chatdata)
      const existingUser = chatdata.some(
        (chat) => chat.rID === user.id||chat.messageID===user.messageID
      );

      if (existingUser) {
        toast.info("User already exists in your chat list.");
        return;
      }

      const chatsRef = collection(db, "chats");
      const newMessageRef = doc(collection(db, "message"));

      // Create a new message document
      await setDoc(newMessageRef, {
        createAt: serverTimestamp(),
        message: [],
      });

      // Update both users' chat references
      await Promise.all([
        updateDoc(doc(chatsRef, firedata.id), {
          chatdata: arrayUnion({
            messageID: newMessageRef.id,
            lastMessage: "",
            rID: user.id,
            updateAt: Date.now(),
            messageSeen: true,
          }),
        }),
        updateDoc(doc(chatsRef, user.id), {
          chatdata: arrayUnion({
            messageID: newMessageRef.id,
            lastMessage: "",
            rID: firedata.id,
            updateAt: Date.now(),
            messageSeen: true,
          }),
        }),
      ]);

      toast.success("Message added successfully!");
    } catch (error) {
      toast.error("Error adding message: " + error.message);
    }
  };
const setchats= async(item)=>{
  //console.log(item)
setMessageId(item.messageID)
setChatUser(item)
setChatVisible(true)
//setVisible(true)

}

  return (
    <>
      <ToastContainer />
      <div className={` ${chatVisible? "hidden md:block":""}   w-[500px] md:w-[300px] lg:w-[350px] h-full bg-gray-700`}>
        <div className="flex justify-between p-3 items-center">
          <img
            src={assets.logo_big}
            alt="Logo"
            className="w-20 h-16 md:w-28 md:h-20"
          />
          <div className="flex flex-col  md:relative  relative">
          <BiDotsVerticalRounded className="text-white text-3xl md:text-4xl cursor-pointer" onClick={()=>{
setDot((pre)=>!pre)          
            
          }}/>
          {dot===true&&<Option/>}
          </div>
        </div>

        <div className={`flex items-center w-full border rounded-md px-2 bg-gray-600 md:w-[280px] md:ml-2 lg:w-[300px]`}>
          <input
            type="text"
            value={input}
            placeholder="Search here.."
            onChange={handleSearch}
            className="w-full h-[30px] border-none outline-none bg-transparent text-white placeholder-gray-400"
          />
          <FaSearch className="text-white text-lg md:mr-2" />
        </div>

        <div className="mt-3 flex flex-col overflow-y-auto h-[calc(100%-150px)] p-3 scrollbar-thin scrollbar-thumb-gray-400">
          {results.length > 0
            ? results.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center p-2 hover:bg-gray-600 rounded-md cursor-pointer"
                  onClick={() => addToMessage(user)}
                >
                  <img
                    src={assets.avatar_icon}
                    alt="Profile"
                    className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-full"
                  />
                  <div className="ml-3">
                    <p className="text-white text-sm md:text-base">{user.username}</p>
                    <p className="text-white text-xs md:text-sm">
                      {user.bio || "No status"}
                    </p>
                  </div>
                </div>
              ))
            : chatdata.map((chat) => (
                <div
                  key={chat.rID}
                  onClick={()=>{
                    setchats(chat)
                    //togglechat()
                
                    
                  }}
                  className={`flex items-center p-2 hover:bg-gray-600 rounded-md`}>
                  <img
                    src={assets.avatar_icon}
                    alt="Profile"
                    className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-full"
                  />
                  <div className="ml-3">
                    <p className="text-white text-sm md:text-base">
                      {chat.userData.username || "Unknown User"}
                    </p>
                    <p className="text-white text-xs md:text-sm">
                      {chat.lastMessage || ""}
                    </p>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </>
  );
}

export default Left;
