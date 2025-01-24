import React, { useEffect, useState } from 'react'
import Left from '../components/Left';
import Chatbox from '../components/Chatbox';
import Right from '../components/Right';
import { useData } from '../context/Chatcontext';
//import { Databases } from 'appwrite';
//import { COLLECTION_ID_MESSAGE, DATABASE_ID ,databases} from '../config/appwrite';
const Chat = () => {
 // const [msg,setMsg]=useState([]);
const{chatdata,firedata}=useData()
const[loading,setloading]=useState(false)
useEffect(()=>{
  if(chatdata&&firedata){
    setloading(false)
  }
  else{
    setloading(true)
  }
},[chatdata,firedata])
  
  return (
    <>
    
    {loading?
    <h1 className='text-center text-3xl text-black mt-[200px]'>Loading Your Chats....</h1>:

    <div  className="w-full h-screen flex"style={{backgroundColor:"white"}}>
      <Left/>
      
      <Chatbox/>
      
    </div>
}
    </>
  )
}

export default Chat;