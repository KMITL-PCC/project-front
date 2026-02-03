"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { StatusBadge } from "./StatusBadge";
import { StudentProfile } from "./StudentProfile";
import { RoomHeader } from "./RoomHeader";
import CheckoutSuccess from "../../app/successpage/CheckoutSuccess";



type Props = {
  room: string;
};

type Status = "pending" | "checked_in" | "checked_out" | "error";

export function CheckInClient({ room }: Props) {
  const [status, setStatus] = useState<Status>("pending");
  const [time, setTime] = useState("");
  const [checkInTime, setCheckInTime] = useState("");
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("th-TH", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    updateTime();
  }, []);

  const handleAction = () => {
    if (status === "pending") {
      setCheckInTime(time);
      setStatus("checked_in");
    } else if (status === "checked_in") {
      setStatus("checked_out");
      setShowSuccess(true);
    }
  };

  const buttonLabel =
    status === "pending"
      ? "CHECK-IN →"
      : status === "checked_in"
      ? "CHECK-OUT →"
      : "DONE";

  const title = status === "checked_in" ? "Check-out" : "Check-in";

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

      {/* Privacy */}
      <div className="flex items-start gap-2 text-sm text-gray-500">
        <input
          type="checkbox"
          checked={acceptedPolicy}
          onChange={(e) => setAcceptedPolicy(e.target.checked)}
          className="mt-1"
        />
        <p>
          Please read and accept the{" "}
          <span className="text-kmitl underline cursor-pointer">
            Privacy Policy
          </span>{" "}
          
          to continue
        </p>
      </div>

      <button
        disabled={!acceptedPolicy || status === "checked_out"}
        onClick={handleAction}
        className="
          w-full rounded-xl py-3 font-semibold text-white
          bg-kmitl hover:bg-orange-600
          disabled:bg-orange-300 disabled:cursor-not-allowed
          transition
        "
      >
        {buttonLabel}
      </button>

      <CheckoutSuccess
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        room={room}
        checkInTime={checkInTime}
        checkOutTime={time}
      />
    </section>
  );
}
