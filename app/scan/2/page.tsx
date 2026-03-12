"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  User,
  ShieldCheck,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  HandMetal,
  Smartphone,
  Camera,
  X,
  Lock,
  LogOut,
  ArrowRightLeft,
  LogIn,
  UserCircle,
  Orbit,
} from "lucide-react";
import { toast } from "sonner";
import { Html5Qrcode } from "html5-qrcode";

// --- Cookie Helpers ---
const setCookie = (name: string, value: string, hours: number) => {
  const expires = new Date(Date.now() + hours * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
};

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

const formatTime = (isoString: string) => {
  if (!isoString) return "--:--";
  try {
    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch (e) {
    return "--:--";
  }
};

type ViewState = "AUTH" | "SCAN" | "CONFIRM" | "SUCCESS";

interface ScanData {
  success: boolean;
  action: "CHECK_IN" | "CHECK_OUT" | "SWAP" | "GUEST_FORCED_CHECKOUT";
  currentSession: {
    id: number;
    StudentId: string;
    roomCode: string;
    checkIn: string;
    checkOut: string | null;
  } | null;
  metadata: {
    class_session_id: number;
    subject_id: number;
    startTime: string;
    endTime: string;
    roomCode: string;
    roomDesc: string;
    studentName: string;
  };
}

function ScanPageContent() {
  const searchParams = useSearchParams();
  const [view, setView] = useState<ViewState>("AUTH");
  const [userId, setUserId] = useState("");
  const [isGuest, setIsGuest] = useState(false);

  const [token, setToken] = useState("");
  const [scanData, setScanData] = useState<ScanData | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const [scannerLoading, setScannerLoading] = useState(false);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  const API_URL = "http://192.168.0.166:4000";

  // Initial Load: Check for Token in URL and Cookies
  useEffect(() => {
    const checkSession = async () => {
      // Artificial delay for premium feel and state synchronization
      await new Promise((resolve) => setTimeout(resolve, 800));

      const urlToken = searchParams.get("token");
      if (urlToken) {
        setToken(urlToken);
      }

      const savedId = getCookie("booth_userId");
      if (savedId) {
        setUserId(savedId);
        setIsGuest(savedId === "Guest");
        setView("SCAN");
        if (urlToken) {
          performScanDiscovery(urlToken, savedId);
        }
      } else {
        // If no cookie, check if Guest has a pending checkout
        try {
          const statusRes = await fetch(`${API_URL}/api/auth/guest-status`);
          if (statusRes.ok) {
            const data = await statusRes.json();
            if (data.isActive) {
              // Restore Guest session automatically
              const guestId = "Guest";
              setUserId(guestId);
              setIsGuest(true);
              setCookie("booth_userId", guestId, 24 * 7);
              toast.warning("Resumed Guest session to complete check-out.");
              setView("SCAN");
              if (urlToken) {
                performScanDiscovery(urlToken, guestId);
              }
            }
          }
        } catch (e) {
          console.error("Failed to check guest status", e);
        }
      }
      setIsInitialLoading(false);
    };

    checkSession();
  }, [searchParams]);

  // --- Authentication Handlers ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      toast.error("Please enter your Student ID");
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/student-check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nationalId: userId }),
      });

      if (res.ok) {
        const data = await res.json();
        setCookie("booth_userId", userId, 24);
        toast.success(`Welcome back, ${data.student?.fname || "Student"}!`);
        setIsGuest(false);
        setView("SCAN");
        // If we already had a token from URL, discover it now
        if (token) performScanDiscovery(token, userId);
      } else {
        toast.error("ID not recognized. Students only.");
      }
    } catch (err: any) {
      toast.error("Login failed. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleGuestMode = () => {
    const guestId = "Guest";
    setUserId(guestId);
    setIsGuest(true);
    setCookie("booth_userId", guestId, 24 * 7); // Ensure cookie for guest (7 days)
    toast.success("Joined as Guest");
    setView("SCAN");
    if (token) performScanDiscovery(token, guestId);
  };

  const handleLogout = () => {
    deleteCookie("booth_userId");
    setUserId("");
    setView("AUTH");
  };

  // --- Scanner Logic ---
  const startScanner = async () => {
    if (typeof window !== "undefined" && !window.isSecureContext) {
      setError("Secure Context (HTTPS) required for camera scanning.");
      return;
    }

    setScannerLoading(true);
    setShowScanner(true);
    setError(null);

    setTimeout(async () => {
      try {
        const html5QrCode = new Html5Qrcode("reader");
        html5QrCodeRef.current = html5QrCode;
        const config = { fps: 10, qrbox: { width: 250, height: 250 } };

        await html5QrCode.start(
          { facingMode: "environment" },
          config,
          (decodedText) => handleDecodedText(decodedText),
          () => {},
        );
        setScannerLoading(false);
      } catch (err: any) {
        console.error("Camera access error:", err);
        toast.error("Could not access camera.");
        setShowScanner(false);
        setScannerLoading(false);
      }
    }, 300);
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (err) {}
    }
    setShowScanner(false);
  };

  const handleDecodedText = async (decodedText: string) => {
    let extractedToken = decodedText;
    try {
      const url = new URL(decodedText);
      extractedToken = url.searchParams.get("token") || decodedText;
    } catch (e) {}

    setToken(extractedToken);
    stopScanner();
    await performScanDiscovery(extractedToken, userId);
  };

  // --- Action Discovery (Phase 1) ---
  const performScanDiscovery = async (t: string, u: string) => {
    if (!t || !u) return;

    setActionLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/qrcode/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: t, userId: u }),
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.code === "GUEST_SWAP_BLOCKED") {
          handleLogout(); // Automatically log out the guest
          toast.error("Guest cannot swap rooms. Session cleared.");
          throw new Error("Guest swap blocked");
        }
        throw new Error(data.error || "Token validation failed");
      }

      const data = await res.json();
      setScanData(data);
      setView("CONFIRM");
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // --- Action Execution (Phase 2) ---
  const confirmAction = async () => {
    if (!scanData || !token || !userId) return;

    setActionLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/qrcode/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: scanData.action,
          userId,
          token,
          isGuest,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Action failed");
      }

      const data = await res.json();
      toast.success(`${scanData.action.replace(/_/g, " ")} confirmed!`);

      if (scanData.action === "GUEST_FORCED_CHECKOUT") {
        toast.success(
          "Successfully checked out. Please log in again to enter the new room.",
        );
        handleLogout(); // Force logout return to AUTH view
        return;
      }

      setView("SUCCESS");
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // --- Views ---

  // 0. INITIAL LOADING VIEW
  if (isInitialLoading) {
    return (
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center animate-pulse">
        <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mb-6 border border-zinc-800">
          <Orbit className="w-10 h-10 text-orange-500 animate-spin-slow" />
        </div>
        <h1 className="text-xl font-black italic tracking-tighter text-white uppercase mb-2">
          Synchronizing...
        </h1>
        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em]">
          Gatekeeper Protocol
        </p>
      </div>
    );
  }

  // 1. AUTH VIEW
  if (view === "AUTH") {
    return (
      <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-orange-600 rounded-3xl flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(249,115,22,0.4)] rotate-3">
              <Orbit className="w-10 h-10 text-white animate-spin-slow" />
            </div>
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none mb-2">
            Dimension <span className="text-orange-500">S</span>
          </h1>
          <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-[0.4em]">
            Gatekeeper Protocol
          </p>
        </div>

        <Card className="bg-zinc-900/50 border-zinc-800 rounded-[32px] overflow-hidden backdrop-blur-xl mb-6">
          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                  Identity Access
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-orange-500 transition-colors">
                    <LogIn className="w-5 h-5" />
                  </div>
                  <Input
                    placeholder="Student ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="bg-zinc-950 border-zinc-800 h-16 pl-12 rounded-2xl text-lg font-bold text-white placeholder:text-zinc-700 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={actionLoading || !userId}
                className="w-full h-16 bg-orange-600 hover:bg-orange-500 rounded-2xl font-black text-white shadow-lg active:scale-95 transition-all"
              >
                {actionLoading ? (
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "AUTHENTICATE"
                )}
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-zinc-900 px-4 text-zinc-600 font-bold tracking-[0.2em]">
                  OR
                </span>
              </div>
            </div>

            <Button
              onClick={handleGuestMode}
              variant="outline"
              className="w-full h-14 border-zinc-800 hover:bg-zinc-800 rounded-2xl font-black text-zinc-400 hover:text-white"
            >
              JOIN AS GUEST
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 2. SCAN VIEW
  if (view === "SCAN") {
    return (
      <div className="w-full max-w-md mx-auto animate-in fade-in duration-500">
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center">
              {isGuest ? (
                <Orbit className="w-5 h-5 text-orange-500" />
              ) : (
                <UserCircle className="w-5 h-5 text-zinc-400" />
              )}
            </div>
            <div className="text-left">
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                Active Identity
              </p>
              <p className="text-xs font-bold text-white uppercase">
                {isGuest ? "Guest User" : userId}
              </p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="icon"
            className="text-zinc-500 hover:text-rose-500"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>

        {showScanner ? (
          <div className="animate-in zoom-in duration-300">
            <div className="bg-zinc-900 border-2 border-orange-500/50 rounded-3xl overflow-hidden relative shadow-[0_0_50px_rgba(249,115,22,0.2)]">
              <div id="reader" className="w-full aspect-square" />
              {scannerLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/80 z-20 gap-4">
                  <div className="w-10 h-10 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
                  <p className="text-[10px] font-black text-white uppercase tracking-widest">
                    Warping Camera...
                  </p>
                </div>
              )}
              <Button
                onClick={stopScanner}
                className="absolute top-4 right-4 h-10 w-10 p-0 rounded-full bg-black/50 text-white z-30"
                variant="outline"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase leading-none">
                Scanning <span className="text-orange-500">Arena</span>
              </h2>
              <p className="text-zinc-500 text-xs font-medium mt-2 uppercase tracking-widest">
                Locate personal session QR
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Button
                onClick={startScanner}
                className="h-28 bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 rounded-[2rem] flex flex-col items-center justify-center gap-3 transition-all"
              >
                <div className="p-4 bg-orange-500/10 rounded-2xl">
                  <Camera className="w-8 h-8 text-orange-500" />
                </div>
                <span className="font-black text-sm uppercase tracking-widest text-zinc-200">
                  Open Scanner
                </span>
              </Button>
            </div>

            {error && (
              <div className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-3xl text-rose-500 flex items-center gap-4">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <p className="text-xs font-bold leading-tight">{error}</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // 3. CONFIRMATION VIEW
  if (view === "CONFIRM" && scanData) {
    return (
      <div className="w-full max-w-md mx-auto animate-in slide-in-from-right-16 duration-500">
        <div className="text-center mb-8">
          <div
            className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-4 shadow-xl ${
              scanData.action === "CHECK_OUT" ||
              scanData.action === "GUEST_FORCED_CHECKOUT"
                ? "bg-rose-500/20 text-rose-500 border border-rose-500/30"
                : scanData.action === "SWAP"
                  ? "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                  : "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30"
            }`}
          >
            {scanData.action === "CHECK_OUT" ||
            scanData.action === "GUEST_FORCED_CHECKOUT" ? (
              <LogOut className="w-10 h-10" />
            ) : scanData.action === "SWAP" ? (
              <ArrowRightLeft className="w-10 h-10 animate-pulse" />
            ) : (
              <Smartphone className="w-10 h-10" />
            )}
          </div>
          <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase leading-none">
            {scanData.action === "CHECK_OUT" ||
            scanData.action === "GUEST_FORCED_CHECKOUT"
              ? "CHECK-OUT"
              : scanData.action === "SWAP"
                ? "ROOM SWAP"
                : "CHECK-IN"}
          </h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">
            Required Verification
          </p>
        </div>

        <Card className="bg-zinc-900/50 border-zinc-800 rounded-[32px] overflow-hidden mb-8">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-zinc-800/80 rounded-2xl text-orange-500">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  Destination
                </p>
                <p className="text-lg font-bold text-zinc-100">
                  {scanData.metadata.roomCode} - {scanData.metadata.roomDesc}
                </p>
              </div>
            </div>

            {scanData.action === "SWAP" && scanData.currentSession && (
              <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex gap-4 items-center">
                <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
                <div className="text-[10px] leading-relaxed text-zinc-400">
                  You are currently in{" "}
                  <span className="text-white font-bold">
                    {scanData.currentSession.roomCode}
                  </span>
                  . This will check you out there and move you here.
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="p-3 bg-zinc-800/80 rounded-2xl text-orange-500">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  Activity
                </p>
                <p className="text-lg font-bold text-zinc-100 truncate">
                  {scanData.metadata.roomDesc}
                </p>
                <p className="text-[10px] font-bold text-orange-500 uppercase tracking-tighter">
                  {formatTime(scanData.metadata.startTime)} -{" "}
                  {formatTime(scanData.metadata.endTime)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-t border-zinc-800/50 pt-4">
              <div className="p-3 bg-zinc-800/80 rounded-2xl text-emerald-500">
                <UserCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  Authorized User
                </p>
                <p className="text-lg font-bold text-white">
                  {scanData.metadata.studentName}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Button
            onClick={confirmAction}
            disabled={actionLoading}
            className={`w-full h-16 rounded-2xl font-black text-white shadow-xl active:scale-95 transition-all ${
              scanData.action === "CHECK_OUT" ||
              scanData.action === "GUEST_FORCED_CHECKOUT"
                ? "bg-rose-600 hover:bg-rose-500"
                : scanData.action === "SWAP"
                  ? "bg-amber-600 hover:bg-amber-500"
                  : "bg-orange-600 hover:bg-orange-500"
            }`}
          >
            {actionLoading ? (
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
            ) : scanData.action === "GUEST_FORCED_CHECKOUT" ? (
              "CONFIRM CHECK-OUT (REQUIRED)"
            ) : (
              `CONFIRM ${scanData.action.replace("_", "-")}`
            )}
          </Button>
          <Button
            onClick={() => setView("SCAN")}
            disabled={actionLoading}
            variant="ghost"
            className="w-full h-14 text-zinc-500 font-bold hover:text-white"
          >
            CANCEL
          </Button>
        </div>
      </div>
    );
  }

  // 4. SUCCESS VIEW
  if (view === "SUCCESS") {
    return (
      <div className="w-full max-w-md mx-auto animate-in zoom-in duration-500 text-center">
        <div className="relative mb-8 flex justify-center">
          <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20 animate-pulse" />
          <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center relative z-10 shadow-[0_0_40px_rgba(16,185,129,0.5)]">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-black italic tracking-tighter text-white mb-2 uppercase">
          Success!
        </h1>
        <p className="text-zinc-400 mb-8 font-medium italic uppercase tracking-widest text-[10px]">
          Transmission Complete
        </p>

        <Card className="bg-zinc-900/50 border-zinc-800 text-left overflow-hidden rounded-3xl backdrop-blur-md mb-8">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-4 border-emerald-500/20">
              <div className="p-3 bg-zinc-800 rounded-2xl text-emerald-500">
                <UserCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  Identity Verified
                </p>
                <p className="text-lg font-bold text-white">
                  {scanData?.metadata?.studentName}
                </p>
                <p className="text-[10px] font-medium text-zinc-500 uppercase">
                  {isGuest ? "Guest Access" : `ID: ${userId}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-zinc-800 rounded-2xl text-orange-500">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  Location Locked
                </p>
                <p className="text-lg font-bold text-zinc-100">
                  {scanData?.metadata.roomCode}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={() => {
            setToken("");
            setScanData(null);
            if (isGuest) {
              setUserId("");
              setIsGuest(false);
              setView("AUTH");
            } else {
              setView("SCAN");
            }
          }}
          className="rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all h-16 w-full font-bold uppercase tracking-widest"
        >
          {isGuest ? "Finish Session" : "Return to Arena"}
        </Button>
      </div>
    );
  }

  return null;
}

export default function MobileScanPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-black selection:bg-orange-500 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none" />

      <main className="flex-1 flex flex-col justify-center px-6 py-12 relative z-10 overflow-y-auto">
        <Suspense
          fallback={
            <div className="flex flex-col items-center gap-4 animate-pulse">
              <div className="w-16 h-16 bg-zinc-900 rounded-full" />
              <div className="w-32 h-4 bg-zinc-900 rounded" />
            </div>
          }
        >
          <ScanPageContent />
        </Suspense>
      </main>

      <div className="h-6 bg-gradient-to-t from-black to-transparent w-full absolute bottom-0 z-20" />
      <div className="absolute bottom-4 left-0 right-0 py-4 flex items-center justify-center gap-4 text-zinc-700 pointer-events-none">
        <div className="h-px w-8 bg-zinc-900" />
        <HandMetal className="w-4 h-4" />
        <p className="text-[8px] font-black uppercase tracking-widest leading-none">
          Dimension S Verification Protocol
        </p>
        <div className="h-px w-8 bg-zinc-900" />
      </div>
    </div>
  );
}
