import React from 'react'
import Image from "next/image";

export default function Login() {
  return (
    <div>
      <div className="mmin-h-screen w-full grid">
        <div className="min-h-screen flex flex-col items-center justify-center -mt-10 bg-linear-to-t from-white from-67% to-kmitl font-sans">
          <Image
                width={320}
                height={150}
                src="/KMITL.png"
                alt="logo"
                className="h-26 mb-4 drop-shadow-md lg:h-40 md:h-36 w-auto"
                priority
            />
            <div>
                <div className="flex justify-center items-center mb-4 bg-gray-600">
                    <button>
                        <h1 className=" font-bold text-gray-700 text-sm">S</h1>
                    </button>
                    
                </div>
            </div>
        </div>
      </div>      
    </div>
  )
}
