"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { MapPin, ChevronRight } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [role, setRole] = useState("Personnel");
  const [open, setOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const roomData = [
    "B101",
    "B102",
    "B103",
    "B104",
    "B105",
    "B106",
    "B107",
    "B108",
    "B109",
    "B110",
    "B201",
    "B202",
    "B203",
    "B204",
    "B205",
    "B206",
    "B207",
    "B208",
    "B209",
    "B210",
    "B301",
    "B302",
    "B303",
    "B304",
    "B305",
    "B306",
    "B307",
    "B308",
    "B309",
    "B310",
  ];

  function handleSelectRoom(room: string) {
    setSelectedRoom(room);
    setOpen(false);
  }

  async function handleSignIn() {
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "student Id": username,
          password: password,
          room: selectedRoom,
        }),
      });
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.message ?? "Login failed. Please try again.");
        return;
      }
      router.push(`/attendance/${selectedRoom}`);
    } catch {
      setError("Cannot connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGuestContinue() {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room: selectedRoom }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.message ?? "Failed to continue as guest.");
        return;
      }
      router.push(`/attendance/${selectedRoom}`);
    } catch {
      setError("Cannot connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-t from-white from-67% to-kmitl font-sans">
      <div className="w-full max-w-[380px] space-y-8 flex flex-col items-center">
        <div className="flex flex-col items-center p-8 md:p-0">
          {/* Logo Section */}
          <div className="flex flex-col items-center gap-4">
            <Image
              width={240}
              height={100}
              src="/KMITL.png"
              alt="logo"
              className="h-auto w-auto object-contain"
              priority
            />
            <div className="h-1.5 w-12 bg-orange-500 rounded-full" />
          </div>

          <div className="w-full space-y-6">
            {/* STEP 1: ค้นหาห้อง */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                Step 1: Select Location
              </label>
              <Button
                onClick={() => setOpen(true)}
                variant="outline"
                className={`w-full h-14 justify-between border-2 rounded-xl transition-all shadow-sm font-semibold text-base
                  ${
                    selectedRoom
                      ? "border-green-500 bg-green-50/30 text-green-700"
                      : "border-slate-200 text-slate-600 hover:border-orange-300"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <MapPin
                    size={18}
                    className={
                      selectedRoom ? "text-green-500" : "text-slate-400"
                    }
                  />
                  {selectedRoom ? `Room ${selectedRoom}` : "Find your room..."}
                </div>
                <ChevronRight size={18} className="text-slate-300" />
              </Button>
            </div>

            {/* STEP 2: แสดงเมื่อเลือกห้องแล้ว */}
            {selectedRoom && (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                {/* Select Role */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Step 2: Login as
                  </label>
                  <div className="relative">
                    <select
                      value={role}
                      onChange={(e) => {
                        setRole(e.target.value);
                        setError("");
                      }}
                      className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-700 cursor-pointer font-medium shadow-sm"
                    >
                      <option value="Personnel">Personnel</option>
                      <option value="Guest">Guest</option>
                    </select>
                  </div>
                </div>

                {/* Login Form Section */}
                <div className="pt-2 border-t border-slate-100 mt-4">
                  {role === "Personnel" ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 pt-4">
                      <Input
                        type="text"
                        placeholder="Username / Student ID"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                          setError("");
                        }}
                        className="h-12 border-slate-200 rounded-xl focus-visible:ring-orange-500 shadow-sm"
                      />
                      <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError("");
                        }}
                        onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
                        className="h-12 border-slate-200 rounded-xl focus-visible:ring-orange-500 shadow-sm"
                      />
                      {error && (
                        <p className="text-xs text-red-500 font-medium pl-1">
                          {error}
                        </p>
                      )}
                      <Button
                        onClick={handleSignIn}
                        disabled={loading}
                        className="w-full h-12 bg-[#f15a22] hover:bg-[#d44d1d] text-white font-bold rounded-xl shadow-lg shadow-orange-200 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {loading ? "Signing in..." : "Sign In"}
                      </Button>
                    </div>
                  ) : (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300 pt-4 text-center">
                      <Button
                        onClick={handleGuestContinue}
                        disabled={loading}
                        variant="outline"
                        className="w-full h-12 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {loading ? "Please wait..." : "Continue as Guest"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <p className="text-center text-[11px] text-slate-300 font-medium uppercase tracking-tighter pt-4">
            King Mongkut&apos;s Institute of Technology Ladkrabang
          </p>
        </div>
      </div>

      {/* Dialog ค้นหาห้อง */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="rounded-xl border shadow-md">
          <CommandInput placeholder="Search room number (e.g. B201)..." />
          <CommandList className="max-h-[300px]">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Available Rooms">
              {roomData.map((room) => (
                <CommandItem
                  key={room}
                  onSelect={() => handleSelectRoom(room)}
                  className="cursor-pointer py-3 hover:bg-slate-50 transition-colors"
                >
                  <MapPin className="mr-2 h-4 w-4 text-slate-400" />
                  <span className="font-medium text-slate-700">
                    Room {room}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}
