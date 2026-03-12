"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [id, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("error");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!id) {
      setError("Please enter your Student ID");
      setAlertType("error");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 1800);
      return false;
    }

    if (!/^\d+$/.test(id)) {
      setError("Student ID must contain only numbers");
      setAlertType("error");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 1800);
      return false;
    }

    if (!password) {
      setError("Please enter your password");
      setAlertType("error");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 1800);
      return false;
    }

    if (id.length !== 8) {
      setError("Invalid Student ID");
      setAlertType("error");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 1800);
      return false;
    }

    setError("");
    return true;
  };

  const handleLogin = async () => {
  if (!validate()) return;

  setLoading(true);

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const response = await fetch(`${apiUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        studentId: id,
        password: password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Invalid credentials");
    }
    
    localStorage.setItem("user", JSON.stringify(data.user));

    setAlertMessage("Sign in successful!");
    setAlertType("success");
    setShowAlert(true);

    setTimeout(() => {
      router.push("/attendance/test");
    }, 1200);

  } catch (err) {
    const e = err as Error;

    setAlertMessage(e.message);
    setAlertType("error");
    setShowAlert(true);

    setTimeout(() => setShowAlert(false), 2500);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen w-full grid">
      <div className="min-h-screen flex flex-col items-center justify-center -mt-10 bg-linear-to-t from-white from-67% to-kmitl font-sans">
        <Image
          width={320}
          height={150}
          src="/KMITL.png"
          alt="logo"
          className="h-26 mb-4 drop-shadow-md lg:h-40 md:h-36 w-auto"
          priority
        />

        <div className="max-w-sm w-2/3">
          <div className="flex justify-center items-center mb-4">
            <h1 className=" font-bold text-gray-700 text-sm">SIGN IN</h1>
            <Image width={20} height={20} src="/ceolgo.png" alt="ce logo" className="w-auto ml-2" style={{ height: 'auto' }}/>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-xs font-bold mb-2 ml-1">
                STUDENT ID
              </label>

              <div className="relative">
                <Image
                  width={20}
                  height={20}
                  src="/id.png"
                  alt="id icon"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 opacity-50"
                />
                <input
                  type="text"
                  value={id}
                  onChange={(e) => setStudentId(e.target.value)}
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
                <Image
                  width={20}
                  height={20}
                  src="/lock.png"
                  alt="lock icon"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 opacity-50"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] bg-gray-50 border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none rounded-full py-3 px-4 w-full text-gray-700 placeholder-gray-400 text-xs transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
                >
                  <Image
                    width={20}
                    height={20}
                    src={showPassword ? "/eye.png" : "/eye-closed (1).png"}
                    alt="toggle password"
                    className="h-5 w-5 opacity-50 hover:opacity-100 transition-opacity"
                  />
                </button>
              </div>
            </div>

            <div className="mt-12">
              <button
                onClick={() => handleLogin()}
                className="w-full flex justify-center items-center bg-kmitl hover:opacity-80 text-white font-bold py-3 rounded-2xl shadow-lg transition-all transform hover:scale-105"
              >
                SIGN IN
                <Image width={20} height={20} src="/move-right.png" alt="" className="ml-2" />
              </button>
            </div>
            
            <a className="text-xs text-gray-500">
              © 2026 KMITL Room Check in System. Designed & developed by CE03.
            </a>
          </div>
        </div>

        {/* Floating Alert Toast */}
        {showAlert && (
          <div
            className={`fixed top-6 lg:left-19/39 left-19/42 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300 ${
              alertType === "success"
                ? "bg-green-600 border-l-4 border-green-700"
                : "bg-red-500 border-l-4 border-red-700"
            } text-white px-6 py-4 rounded-lg shadow-xl max-w-md w-70 mx-4`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs">{alertMessage}</span>
              {alertType !== "success" && (
                <button
                  onClick={() => setShowAlert(false)}
                  className="ml-4 text-white hover:text-gray-200 transition"
                >
                  ✕
                </button>
              )}
            </div>
            {alertType === "success" && (
              <div className="mt-2 text-sm opacity-90">Redirecting...</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
