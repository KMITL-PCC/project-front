"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "../ui/card";
import { StatusBadge } from "./StatusBadge";
import { StudentProfile } from "./StudentProfile";
import { RoomHeader } from "./RoomHeader";
import { PrivacyModal } from "./PrivacyModal";
import { CheckStatusModal } from "../checkin/checkinnn";

type Props = {
  room: string;
};

type Status = "pending" | "checked_in" | "checked_out" | "error" | "swapped";

export function AttenDance({ room }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("pending");
  const [time, setTime] = useState("");
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"checkin" | "checkout">("checkin");
  const [user, setUser] = useState<{
    studentId: string;
    fname: string;
    lname: string;
  } | null>(null);
  const [swappedFrom, setSwappedFrom] = useState<{
    code: string;
    desc: string;
  } | null>(null);

  useEffect(() => {
    const fetchUserAndStatus = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });

        let currentStudentId = null;
        let identifiedUser = null;

        if (response.ok) {
          const data = await response.json();
          const userData = data.user;
          if (userData) {
            identifiedUser = {
              studentId: userData.studentId || userData.StudentId,
              fname: userData.fname,
              lname: userData.lname,
            };
            currentStudentId = identifiedUser.studentId;
            setUser(identifiedUser);
          }
        } else {
          const localUser = localStorage.getItem("user");
          if (localUser) {
            identifiedUser = JSON.parse(localUser);
            if (identifiedUser) {
              identifiedUser = {
                studentId: identifiedUser.studentId || identifiedUser.StudentId,
                fname: identifiedUser.fname,
                lname: identifiedUser.lname,
              };
              currentStudentId = identifiedUser.studentId;
              setUser(identifiedUser);
            }
          }
        }

        if (currentStudentId) {
          // Fetch check-in status
          const statusRes = await fetch(`/api/qrcode/status/${room}`, {
            credentials: "include",
          });
          if (statusRes.ok) {
            const statusData = await statusRes.json();
            if (statusData.action === "CHECK_OUT") {
              setStatus("checked_in");
            } else if (statusData.action === "SWAP") {
              setStatus("swapped");
              setSwappedFrom({
                code: statusData.currentRoom,
                desc: statusData.currentRoomDesc,
              });
            } else {
              setStatus("pending");
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch user or status:", err);
      }
    };
    fetchUserAndStatus();
  }, [room]);

  const checkIn = async () => {
    const res = await fetch("/api/check-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ room }),
    });

    if (!res.ok) {
      throw new Error("Check-in failed");
    }

    return res.json();
  };

  const checkOut = async () => {
    const res = await fetch("/api/check-out", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ room }),
    });

    if (!res.ok) {
      throw new Error("Check-out failed");
    }

    return res.json();
  };

  const buttonLabel =
    status === "pending"
      ? "CHECK-IN →"
      : status === "checked_in"
        ? "CHECK-OUT →"
        : status === "swapped"
          ? "SWAP →"
          : "DONE";

  const title =
    status === "checked_in"
      ? "Check-out"
      : status === "checked_out"
        ? "Completed"
        : status === "swapped"
          ? "Swap Room"
          : "Check-in";

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("th-TH", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleAction = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      let action = "CHECK_IN";
      if (status === "checked_in") action = "CHECK_OUT";
      if (status === "swapped") action = "SWAP";

      const res = await fetch("/api/qrcode/action/direct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          roomCode: room,
          studentId: user.studentId,
        }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Action failed");

      if (status === "pending" || status === "swapped") {
        setStatus("checked_in");
        setModalType("checkin");
        setIsModalOpen(true);
      } else if (status === "checked_in") {
        setStatus("checked_out");
        setModalType("checkout");
        setIsModalOpen(true);
      }
    } catch (err) {
      setStatus("error");
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full max-w-sm space-y-4">
      <h1 className="text-center text-lg font-semibold text-black">{title}</h1>

      <Card className="rounded-3xl shadow-xl">
        <CardContent className="p-6 text-center space-y-4 text-black">
          <RoomHeader room={room} />

          <StudentProfile
            firstName={user && user.fname}
            lastName={user && user.lname}
            isLoading={!user}
            studentId={user ? user.studentId : "..."}
            avatarUrl="/avatar.png"
          />

          <div className="grid grid-cols-2 gap-6 pt-6">
            <StatusBadge label="STATUS" value={status} status={status} />
            <StatusBadge label="TIME" value={time} />
          </div>

          {status === "swapped" && swappedFrom && (
            <div className="mt-4 p-3 bg-blue-50 rounded-xl text-blue-700 text-sm">
              คุณกำลังเช็คอินอยู่ที่ห้อง <strong>{swappedFrom.code}</strong> (
              {swappedFrom.desc})
              <br />
              คลิกปุ่มด้านล่างเพื่อทำการ Swap ย้ายมาห้องนี้แทน
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-start gap-2 text-sm text-gray-500">
        <input
          type="checkbox"
          checked={acceptedPolicy}
          onChange={(e) => setAcceptedPolicy(e.target.checked)}
          className="mt-1"
        />
        <p>
          Please read and accept the <PrivacyModal /> to continue
        </p>
      </div>

      <button
        disabled={!acceptedPolicy || status === "checked_out"}
        onClick={handleAction}
        className="
          w-full rounded-xl py-3 font-semibold text-white
          bg-kmitl hover:bg-orange-500 active:bg-orange-600
          disabled:bg-orange-300 disabled:cursor-not-allowed
          transition
        "
      >
        {buttonLabel}
      </button>

      <button
        onClick={() => router.push("/history")}
        className="
          w-full rounded-xl py-3 font-semibold
          border-2 border-kmitl text-kmitl
          hover:bg-orange-50 active:bg-orange-100
          transition text-sm sm:text-base
        "
      >
        History
      </button>

      <CheckStatusModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={modalType}
        room={room}
        time={time}
        studentName={user ? `${user.fname} ${user.lname}` : "Student"}
      />
    </section>
  );
}
