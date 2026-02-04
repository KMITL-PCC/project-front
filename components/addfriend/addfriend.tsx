"use client";

import { useState } from "react";

export default function AttendanceModal() {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-[90%] max-w-[360px] sm:w-[360px] rounded-2xl bg-white p-4 sm:p-6 shadow-lg">
        {/* ปุ่มปิด */}
        <button
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3 text-gray-400 text-lg drop-shadow-sm"
        >
          ✕
        </button>

        {/* ไอคอน */}
        <div className="mt-5 mx-auto flex h-35 w-35 items-center justify-center rounded-full bg-[#08E964] shadow-lg">
          <img
            src="/profile.png" alt="Add user"
            className="h-30 w-30"
          />
        </div>

        {/* หัวข้อ */}
        <h2 className="mt-10 text-center text-xl font-SF Pro font-Medium">
          Almost there!
        </h2>

        {/* คำอธิบาย */}
        <p className="mt-10 text-center text-sm text-gray-500">
          Please add our{" "}
          <span className="text-[#08E964] font-medium">
            LINE Official Account
          </span>{" "}
          <br />
          to complete your attendance check - in.
        </p>

        {/* รายการ */}
        <div className="mt-13 space-y-5">
          <Item
            icon="/check.svg"
            text="Verify your student identity"
          />
          <Item
            icon="/notifications.svg"
            text="Get attendance notifications"
          />
        </div>

        {/* ปุ่ม Add Friend */}
        <button className="mt-15 mx-auto flex w-60 items-center justify-center gap-3 rounded-full bg-[#08E964] py-3 text-white">
          <div className="mx-auto flex items-center justify-center gap-3">
            <img
              src="/profile_add.png" alt="Add friend"
              className="h-8 w-8"
            />
            <span className="text-base font-medium leading-none">
              Add Friend
            </span>
          </div>
        </button>

        <p
          className="mt-5 mb-15 text-center text-sm text-gray-400 cursor-pointer"
          onClick={() => setOpen(false)}
        >
          Remind me later.
        </p>
      </div>
    </div>
  );
}

function Item({ text, icon }: { text: string; icon: string }) {
  return (
    <div className="flex items-center gap-3 justify-center rounded-full bg-[#D9D9D9]/[0.27] px-4 py-3 text-sm shadow-sm">
      <img
        src={icon} alt=""
        className="h-5 w-5 flex-shrink-0"
      />
      <span className="ml-2 leading-snug">{text}</span>
    </div>
  );
}
