import React, { useEffect, useState } from 'react'
import assets from '../assets/assets';
import socialbg from "../assets/socialbg.jpg"
import { onAuthStateChanged } from 'firebase/auth';
import { auth,db } from '../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useData } from '../context/Chatcontext';

import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
const Profil = () => {
  const navigate=useNavigate()
  const{setUserData}=useData()
  //const [image,setImage]=useState(false)
  const [proname,setName]=useState("")
  const[bio,setBio]=useState("")
  const[avatarimg,setImage]=useState("")
  const [uid,setUid]=useState("")
  const handlesubmit= async(e)=>{
  try {
    e.preventDefault();
    console.log("submitted")
    console.log(uid)
    console.log(proname)
    console.log(avatarimg)
    const docRef=doc(db,'users',uid)
    await updateDoc(docRef,{
name:proname,
bio:bio,
avatar:avatarimg,      
    })
    console.log("Profile Updated sucessfuly")
    const docSnap1= await getDoc(docRef);
    //console.log(docSnap1.data())
    setUserData(docSnap1.data())
    navigate("/chat");
    
  } catch (error) {
   console.error(error.message)
   toast.error(error.message)
  }
   



  }
useEffect(()=>{
  onAuthStateChanged(auth,async(user)=>{
    if(user){
      const docRef=  doc(db,"users",user.uid)
      setUid(user.uid)
      console.log(user.uid)
      const docSnap= await getDoc(docRef)
      const userprofile=docSnap.data()
      console.log(userprofile)
      if(userprofile.name){
        setName(userprofile.name)
        setImage(userprofile.name.charAt(0).toUpperCase())
      }
if(userprofile.bio){
  setBio(userprofile.bio)
  console.log(bio)
}      

    }

  })
},[])

  return (
  <>
  <ToastContainer/>
<div className='w-full h-screen' style={{backgroundImage:`url("https://img.freepik.com/free-vector/vector-social-contact-seamless-pattern-white-blue_1284-41919.jpg?t=st=1737650610~exp=1737654210~hmac=4c50a83611971bd4317f23c46ba85dd734a2c89504947910096e67225be1afa2&w=826")`,
      backgroundSize:"cover",
}}>
<div className="flex justify-center items-center h-[500px]">

  <div className="w-[600px] bg-white rounded-lg shadow-lg p-6">
  
    <h1 className="text-center text-2xl font-bold mb-6">Profile Details</h1>
<form onSubmit={handlesubmit}>
    {/* Upload Image Section */}
    <div className="flex flex-col items-center mb-6">
      <label htmlFor="avatar" className="flex flex-col items-center cursor-pointer">
        <input 
          type="text" 
          id="avatar" 
        value={avatarimg}
        hidden
          
        
        />
        <img 
          src={assets.avatar_icon} 
          alt="Avatar Icon" 
          className="w-24 h-24 rounded-full border-2 border-gray-300 hover:border-indigo-500 transition duration-200"
        />
        <p className="mt-2 text-sm text-gray-600"></p>
      </label>
    </div>

    {/* Form Fields */}
    <div className="flex flex-col items-center space-y-4">
      <input 
        type="text" 
        placeholder="Your Name" 
        required 
        value={proname}
        onChange={(e)=>{
          setName(e.target.value)
        }}
        className="text-center w-[300px] p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      <textarea 
        placeholder="Write Your Profile Bio" 
        required 
        value={bio}
        onChange={(e)=>{
          setBio(e.target.value)
        }}
        className="w-[300px] h-24 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      ></textarea>
    </div>

    {/* Save Button */}
    <div className="flex justify-center mt-6">
      <button 
        type="submit"
        
        className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md shadow-md hover:bg-indigo-700 transition duration-200"
      >
        Save
      </button>
    </div>
    </form>
  </div>
</div>
</div>
</>
)}


export default Profil;