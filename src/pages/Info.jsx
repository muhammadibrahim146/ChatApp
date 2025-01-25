import React, { useState } from 'react'
import background from "../assets/background.png"
import chat from "../assets/chat.png"
import { login, signup } from '../config/firebase'
import { ToastContainer } from 'react-toastify'
const Info = () => {
  const [currset,setCurr]=useState("Sign Up")
  const [user,setUser]=useState({
  
    username:"",
    email:"",
    password:"",
    
  })
  const handleInput=(e)=>{
    const {name,value}=e.target
    setUser((pre)=>({...pre,[name]:value}))
// console.log(user)
 
  }
const handleform=(e)=>{
  e.preventDefault()
  //setUser("")
 if(currset==="Sign Up")
  {
    signup(user.username,user.email,user.password)

  } 
  else{
    login(user.email,user.password)
  }
setUser({username:" " , email:" " , password:" "})
}
  return (
    <>
    <ToastContainer/>
    <div className='w-full h-screen '  
    style={{
      backgroundImage:`url("https://img.freepik.com/free-vector/vector-social-contact-seamless-pattern-white-blue_1284-41919.jpg?t=st=1737650610~exp=1737654210~hmac=4c50a83611971bd4317f23c46ba85dd734a2c89504947910096e67225be1afa2&w=826")`,
      backgroundSize:"cover",

      }}>
        <div className='flex justify-around flex-wrap  '>
       <h1 className='lg:text-7xl  text-4xl font-serif font-extrabold w-[300px] lg:w-[400px]  lg:mt-[100px]  md:mt-[60px] md:ml-[-50px] text-center'>Welcome to Online Chat Application</h1>
       <div className='flex justify-center mt-2  lg:mt-[100px] md:mt-[60px]'>
      <div className='bg-slate-100 w-[300px]   h-[360px] md:h-[350px] border px-4 py-4' >
      <h1 className='text-center item-center text-2xl text-black font-bold'>{currset}</h1>
      <form className='flex justify-center flex-col ' onSubmit={handleform}>
        
   {currset==="Sign Up"?  <input type='text' placeholder='UserName' name='username' className='w-[250px] h-[30px]  border mt-3 outline-none' onChange={(e)=>{
    handleInput(e)}
    } required value={user.username} />:null}
         <input type='email' placeholder='Email'  onChange={(e)=>{
          handleInput(e)
         }} value={user.email} name="email" className='w-[250px] h-[30px] boreder mt-3 outline-none' required/>
         <input type='password' placeholder='Password' name='password' onChange={(e)=>{
          handleInput(e)
         }} value={user.password} className='w-[250px] h-[30px] boreder mt-3 outline-none' required/>
    { currset==="Sign Up"? <button className='mt-4 px-2 py-2 h-[50px] mr-3 bg-blue-400 text-white ' type='submit'>Create Account</button>:<button className='mt-4 px-2 py-2 h-[50px] mr-3 bg-blue-400 text-white' type='submit'>Login</button>}
      <div className='flex  mt-3 gap-3'>
      <input type='checkbox'/>
      <p>Agree with terms and conditions</p>
      </div>
      {currset==="Sign Up"?
<p className='mt-3'>Already have a account <span className='text-blue-400 cursor-pointer mt-3' onClick={()=>{
        setCurr("Login")
        }}>Click Here</span></p>:<p className='mt-3'>Create  account <span className='text-blue-400 cursor-pointer mt-3' onClick={()=>{
          setCurr("Sign Up")
          }}>Click Here</span></p>}
      </form>
    </div>
    </div>

        </div>
     </div>  


    
    
</>    
  )
}

export default Info