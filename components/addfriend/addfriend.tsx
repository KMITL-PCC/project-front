"use client";

import { useState } from "react";
import Image from "next/image";

export default function AttendanceModal() {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="relative w-full max-w-sm sm:max-w-md rounded-2xl bg-white p-5 sm:p-6 shadow-xl">
        {/* ปุ่มปิด */}
        <button
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3 text-gray-400 text-lg drop-shadow-sm"
        >
          ✕
        </button>

        {/* ไอคอน */}
        <div className="mt-5 mx-auto flex h-24 w-24 sm:h-32 sm:w-32 items-center justify-center rounded-full bg-[#05C655] shadow-lg">
          <Image src="/profile.png" alt="Add user" width={72} height={72} />
        </div>

        {/* หัวข้อ */}
        <h2 className="mt-6 sm:mt-8 text-center text-lg sm:text-xl font-medium text-black">
          Almost there!
        </h2>

        {/* คำอธิบาย */}
        <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-500 leading-relaxed">
          Please add our{" "}
          <span className="text-[#05C655] font-medium">
            LINE Official Account
          </span>{" "}
          <br className="hidden sm:block" />
          to complete your attendance check - in.
        </p>

        {/* รายการ */}
        <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4 text-black">
          <Item  icon="/check(1).svg" text="Verify your student identity" />
          <Item icon="/notifications.svg" text="Get attendance notifications" />
        </div>

        {/* ปุ่ม Add Friend */}
        <button className="mt-8 sm:mt-10 mx-auto flex w-full max-w-xs items-center justify-center gap-3 rounded-full bg-[#05C655] py-2.5 sm:py-3 text-white">
          <div className="mx-auto flex items-center justify-center gap-3">
            <Image src="/profile_add.png" alt="Add friend" width={32} height={32} />
          <span className="text-sm sm:text-base font-medium leading-none">
              Add Friend
            </span>
          </div>
        </button>

        <p
          className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-400 cursor-pointer"
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
    <div className="flex items-center gap-3 justify-center rounded-full bg-[#D9D9D9]/30 px-4 py-2.5 sm:py-3 text-xs sm:text-sm shadow-sm">
      <Image src={icon} alt="" width={20} height={20} className="sepia-40" />
      <span className="ml-2 leading-snug">{text}</span>
    </div>
  );
}
