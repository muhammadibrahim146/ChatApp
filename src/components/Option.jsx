import React from 'react'
import { logout } from '../config/firebase';

const Option = () => {
  return (
    <div className=' md:w-[200px]  md:h-[100px] bg-white shadow-xl  md:absolute  md:mt-10  absolute  ml-[-100px] px-4 py-4 w-[100px] h-[100px]'>
        <div className='flex flex-col'>
            <p className=' md:text-xl text-black '>Edit Profile</p>
            <p className='border-t  md:text-xl text-black' onClick={()=>{
              logout()
            }}>Logout</p>

        </div>

    </div>
  )
}

export default Option;