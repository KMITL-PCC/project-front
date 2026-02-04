'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Eye, EyeOff } from 'lucide-react'

export default function TeacherLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // mock login (เอาไว้ทดสอบ flow เฉย ๆ)
    // ไว้เปลี่ยนเป็นเรียก API + auth จริงทีหลัง
    if (username && password) {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 bg-gradient-to-br from-orange-400 via-orange-200 to-white md:from-orange-500 md:via-orange-300">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8">

        {/*Logo+Title*/}
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/kmitl-logo.png"
            alt="KMITL Logo"
            width={180}
            height={90}
            className="mb-3"
            priority
          />
          <h1 className="text-xl font-semibold text-orange-600 text-center">
            KMITL Attendance System
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Professor Login
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full rounded-xl border border-gray-300 px-4 py-2
                         focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-600"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-xl border border-gray-300 px-4 py-2 pr-12
                           focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-600"
                required
              />

              {/* Toggle show/hide password */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2
                           text-gray-500 hover:text-orange-500 transition"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/*Login Button*/}
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600
                       text-white font-semibold py-3 rounded-xl transition"
          >
            LOGIN →
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500">
          * Professor only *
        </p>
      </div>
    </div>
  )
}
