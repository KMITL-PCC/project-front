"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { StatusBadge } from "./StatusBadge";
import { StudentProfile } from "./StudentProfile";
import { RoomHeader } from "./RoomHeader";
import { PrivacyModal } from "./PrivacyModal";
import { CheckStatusModal } from "../checkin/checkinnn";
import AddFriendLINE from "../addfriend/addfriend";

type Props = {
  room: string;
};

type Status = "pending" | "checked_in" | "checked_out" | "error";

export function AttenDance({ room }: Props) {
  const [status, setStatus] = useState<Status>("pending");
  const [time, setTime] = useState("");
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"checkin" | "checkout">("checkin");
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);

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
    // status === "error"
    //   ? "RETRY"
    status === "pending"
      ? "CHECK-IN →"
      : status === "checked_in"
        ? "CHECK-OUT →"
        : "DONE";

  const title =
    status === "checked_in"
      ? "Check-out"
      : status === "checked_out"
        ? "Completed"
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
    try {
      setLoading(true);
      setError(null);

      if (status === "pending") {
        // await checkIn();
        setStatus("checked_in");
        setModalType("checkin");
        setIsModalOpen(true);
        setIsAddFriendOpen(true);
      } else if (status === "checked_in") {
        // await checkOut();
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
            name="Mr. Shadow Milk"
            studentId="66200888"
            avatarUrl="/avatar.png"
          />

          <div className="grid grid-cols-2 gap-6 pt-6">
            <StatusBadge label="STATUS" value={status} status={status} />
            <StatusBadge label="TIME" value={time} />
          </div>
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

      <CheckStatusModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={modalType}
        room={room}
        time={time}
        studentName="Mr. Shadow Milk"
      />

      <AddFriendLINE
        open={isAddFriendOpen}
        onClose={() => setIsAddFriendOpen(false)}
      />
    </section>
  );
}
