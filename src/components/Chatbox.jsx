import React, { useEffect, useState } from "react";
import assets from "../assets/assets";
import { useData } from "../context/Chatcontext";
import Chat from "../pages/Chat";
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc ,} from "firebase/firestore";
import { db } from "../config/firebase";
//import { COLLECTION_ID_MESSAGE, DATABASE_ID, databases } from "../config/appwrite";
//import { ID } from "appwrite";

const Chatbox = () => {
  //const [messagebody, setMessagebody] = useState("");
  const{chatuser,setMessage,message,messageID,firedata,chatVisible}=useData()
  const[input,setInput]=useState("")

  const sendMessage = async () => {
    console.log(input);
    try {
      if (input && messageID) {
        // Update the message document in Firestore
        await updateDoc(doc(db, "message", messageID), {
          message: arrayUnion({
            sID: firedata.id,
            text: input,
            createdAt: new Date(),
          }),
        });
  
        // Update user chats for both users
        const userIds = [chatuser.rID, firedata.id];
  
        await Promise.all(
          userIds.map(async (id) => {
            const userchatRef = doc(db, "chats", id);
            const userChatssnapShot = await getDoc(userchatRef);
  
            if (userChatssnapShot.exists()) {
              const userchatsdata = userChatssnapShot.data();
              console.log(userchatsdata);
  
              // Find the chat index
              const chatIndex = userchatsdata.chatdata.findIndex(
                (c) => c.messageID === messageID
              );
  
              if (chatIndex !== -1) {
                // Update the specific chat data
                userchatsdata.chatdata[chatIndex].lastMessage = input.slice(0, 30);
                userchatsdata.chatdata[chatIndex].updateAt = Date.now();
  
                if (userchatsdata.chatdata[chatIndex].rID === firedata.id) {
                  userchatsdata.chatdata[chatIndex].messageSeen = false;
                }
  
                // Save the updated chatdata back to Firestore
                await updateDoc(userchatRef, {
                  chatdata: userchatsdata.chatdata,
                });
              } else {
                console.error(
                  "Chat with the specified messageID not found in chatdata."
                );
              }
            }
          })
        );
  
        // Clear the input after sending the message
        setInput("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
 const convertTime=(time)=>{
  let date=time.toDate();
  let hour=date.getHours();
  let min=date.getMinutes()
if(hour>12){
  return hour-12+":"+min+"PM"
}
else{
  return hour+":"+min+"AM"
}
 } 

  useEffect(()=>{
    if(messageID){
      const unsub=onSnapshot(doc(db,"message",messageID),(res)=>{
        setMessage(res.data().message.reverse());
        

      })
      return ()=>{
        unsub()
            }
    }
 
  },[messageID])
  return  chatuser ?
  (
    <>
     
    <div className={`   w-full  md:w-[700px]  lg:w-[1000px]  bg-gray-200  rounded-lg shadow-lg  p-4`}>
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <div className="flex items-center">
          <img
            src={assets.avatar_icon}
            alt="Profile"
            className="w-12 h-12 md:w-16 md:h-16 rounded-full"
          />
          <div className="flex items-center gap-2 ml-4">
            <p className="text-lg font-semibold">{chatuser.userData.username.toUpperCase()}</p>
            <img
              src={assets.green_dot}
              alt="Online Status"
              className="w-4 h-4 md:w-6 md:h-6"
            />
          </div>
        </div>
        <img
          src={assets.help_icon}
          alt="Help"
          className="w-6 h-6 md:w-8 md:h-8 cursor-pointer"
        />
      </div>

      {/* Messages */}
      <div className="h-[60vh] overflow-y-auto flex flex-col-reverse scrollbar-thin scrollbar-thumb-gray-400 p-2">
        {/* Sent Message */}
        {/* Dynamic Messages */}
{message.map((msg, index) => (
  <div
    key={index}
    className={`flex mt-3 ${
      msg.sID === firedata.id ? "justify-end" : "justify-start"
    }`}
  >
    {/* Sender's Message */}
    {msg.sID === firedata.id ? (
      <div className="flex items-end">
        <div className="flex flex-col items-end">
          <p className="w-[200px] md:w-[300px] bg-blue-500 text-white rounded-lg p-2">
            {msg.text}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {convertTime(msg.createdAt)}
          </p>
        </div>
        <img
          src={assets.avatar_icon}
          alt="Sender Profile"
          className="w-8 h-8 md:w-10 md:h-10 rounded-full ml-2"
        />
      </div>
    ) : (
      /* Receiver's Message */
      <div className="flex items-start">
        <img
          src={assets.avatar_icon}
          alt="Receiver Profile"
          className="w-8 h-8 md:w-10 md:h-10 rounded-full mr-2"
        />
        <div className="flex flex-col">
          <p className="w-[200px] md:w-[300px] bg-gray-300 text-black rounded-lg p-2">
            {msg.text}
          </p>
          <p className="text-sm text-gray-500 mt-1">
          {convertTime(msg.createdAt)}
          </p>
        </div>
      </div>
    )}
  </div>
))}

      </div>
        
      {/* Input Box */}
      <div className="flex items-center bg-gray-300 p-3 rounded-b-lg">
        <form className="flex-grow" onSubmit={(e)=>{
          e.preventDefault()
          sendMessage()
        }}>
          <input
            type="text"
            value={input}
            onChange={(e)=>{
              setInput(e.target.value);
            }}
            placeholder="Type a message"
            className="w-full h-10 border rounded-lg px-3 outline-none"
            
          />
        </form>
        <div className="flex items-center gap-4 ml-4">
          <label htmlFor="image" className="cursor-pointer">
            <img
              src={assets.gallery_icon}
              alt="Gallery"
              className="w-6 h-6 md:w-8 md:h-8"
            />
            <input type="file" id="image" accept="image/png, image/jpeg" hidden />
          </label>
          <img
            src={assets.send_button}
            alt="Send"
            onClick={sendMessage}
            className="w-6 h-6 md:w-8 md:h-8 cursor-pointer"
          />
        </div>
      </div>
    </div>
    
     
  </>
     
  ) :
  <div className=" hidden md:flex    ">
    <div className="md:flex  md:flex-col md:ml-7 lg:ml-[90px]">
<img src={assets.logo_icon} className="w-[500px] h-[400px]"/>
<h1 className="text-center text-3xl font-bold">Chats With Your Friends and Family</h1>
</div>
  </div>

};

export default Chatbox;
