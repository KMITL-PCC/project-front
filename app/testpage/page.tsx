"use client";

import { useState } from "react";
import CheckStatusModal from "@/components/checkin/checkinnn";

export default function CheckStatusPage() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"checkin" | "checkout">("checkin");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-100">

      <h1 className="text-xl font-semibold">
        Check Status Modal Preview
      </h1>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => {
            setType("checkin");
            setOpen(true);
          }}
          className="rounded-full bg-green-500 px-6 py-2 text-white"
        >
          Show Check-In
        </button>

        <button
          onClick={() => {
            setType("checkout");
            setOpen(true);
          }}
          className="rounded-full bg-red-500 px-6 py-2 text-white"
        >
          Show Check-Out
        </button>
      </div>

      {/* Modal */}
      <CheckStatusModal
        open={open}
        onClose={() => setOpen(false)}
        type={type}
        room="E107"
        time={type === "checkin" ? "09:41 AM" : "01:14 PM"}
        studentName="Mr. Shadow"
      />
    </div>
  );
}
