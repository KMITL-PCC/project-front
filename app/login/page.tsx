"use client";
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  return (
<div className="min-h-screen flex flex-col items-center justify-center -mt-10 bg-gradient-to-t from-white from-70% to-orange-500 font-sans">
    
      <img src="KMITL.png" alt="logo" className="h-26 mb-4 drop-shadow-md lg:h-40 md:h-36" />

      <div className="max-w-sm w-2/3">
        
        <div className="flex justify-center items-center mb-4">
          <h1 className=" font-bold text-gray-700 text-sm">SIGN IN</h1>
          <img src="ceolgo.png" alt="ce logo" className="h-5 ml-2" />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 text-xs font-bold mb-2 ml-1">
              STUDENT ID
            </label>

            <div className="relative">
              <img
                src="id.png" 
                alt="id icon" 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 opacity-50" 
              />
              <input
                type="text"
                className="pl-12 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]  bg-gray-50 border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none rounded-full py-3 px-4 w-full text-gray-700 placeholder-gray-400 text-xs transition-all"
                placeholder="e.g. 6X200XXX" 
              />
            </div>

          </div>

          <div>
            <label className="block text-gray-700 text-xs font-bold mb-2 ml-1">
              PASSWORD
            </label>

            <div className="relative">
              <img 
                src="lock.png" 
                alt="lock icon" 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 opacity-50" 
              />
              <input
                type={showPassword ? "text" : "password"}
                className="pl-12 pr-12 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] bg-gray-50 border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none rounded-full py-3 px-4 w-full text-gray-700 placeholder-gray-400 text-xs transition-all"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
              >
                <img
                  src={showPassword ? "eye.png" : "eye.png"}
                  alt="toggle password"
                  className="h-5 w-5 opacity-50 hover:opacity-100 transition-opacity"
                />
              </button>
          </div>
        </div>

        <div className="mt-12">
           <button className="w-full flex justify-center items-center bg-orange-500 hover:opacity-80 text-white font-bold py-3 rounded-2xl shadow-lg transition-all transform hover:scale-105">
             SIGN IN
             <img src="move-right.png" alt="" className="ml-2" />
           </button>
        </div>
        {/* <div className="flex items-center my-6">
          <div className="flex-grow h-[1px] bg-gray-200"></div>
            <span className="flex-shrink mx-4 text-[10px] font-medium text-gray-400 uppercase tracking-[0.2em]">
              Authentication Room XXXX
            </span>
          <div className="flex-grow h-[1px] bg-gray-200"></div>
        </div> */}
        <a className="text-xs text-gray-500">© 2026 KMITL Room Check in System. Designed & developed by CE03.</a>
      </div>
    </div>
  </div>
  );
}
