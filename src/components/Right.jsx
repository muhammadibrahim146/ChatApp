import React from "react";
import assets from "../assets/assets";
import { logout } from "../config/firebase";

const Right = () => {
  return (
    <div className="w-full sm:w-full md:w-[250px] lg:w-[300px] h-screen bg-gray-700 p-4">
      {/* Profile Section */}
      <div className="flex flex-col items-center">
        <img
          src={assets.profile_img}
          alt="Profile"
          className="w-24 h-24 md:w-32 md:h-32 rounded-full mt-3"
        />
        <h1 className="text-center text-white text-xl md:text-2xl mt-2">
          Richard Staff
        </h1>
        <h2 className="text-white text-sm md:text-lg text-center mt-2 px-4">
          Hey Dear, I am Richard Staff. Using Chat App.
        </h2>
      </div>

      {/* Media Section */}
      <div className="mt-6">
        <p className="text-white text-lg ml-2">Media</p>
        <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
          <img src={assets.pic1} alt="Media 1" className="w-full rounded-lg" />
          <img src={assets.pic2} alt="Media 2" className="w-full rounded-lg" />
          <img src={assets.pic3} alt="Media 3" className="w-full rounded-lg" />
          <img src={assets.pic4} alt="Media 4" className="w-full rounded-lg" />
        </div>
      </div>

      {/* Logout Button */}
      <div className="flex justify-center mt-6">
        <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600" onClick={()=>{
          logout()
        }}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Right;
