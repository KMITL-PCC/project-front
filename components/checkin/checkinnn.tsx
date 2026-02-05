"use client";

import Image from "next/image";

type Props = {
  open: boolean;
  onClose: () => void;

  type: "checkin" | "checkout";
  room: string;
  time: string;
  studentName: string;
};

export function CheckStatusModal({
  open,
  onClose,
  type,
  room,
  time,
  studentName,
}: Props) {
  if (!open) return null;

  const isCheckIn = type === "checkin";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm sm:max-w-md rounded-2xl bg-white p-5 sm:p-6 shadow-xl flex flex-col">
        {/* ===== Content ===== */}
        <div className="flex-1">
          {/* Icon */}
          <div className="mx-auto mt-2 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-kmitl/25">
            <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-kmitl/90">
              <Image
                width={36}
                height={36}
                src="/check.svg"
                alt="check icon"
                className="h-7 w-7 sm:h-9 sm:w-9"
              />
            </div>
          </div>

          {/* Title */}
          <h2 className="mt-4 text-center text-base sm:text-lg font-semibold text-gray-600 leading-snug">
            {isCheckIn ? "Check-In" : "Check-Out"} <br />
            Successfully
          </h2>

          {/* Description */}
          <p className="mt-2 text-center text-xs sm:text-sm text-gray-500 leading-relaxed">
            You have been checked {isCheckIn ? "in" : "out"} for <br />
            <span className="font-medium text-gray-700">
              Room {room}
            </span> at {time} today.
          </p>

          {/* Info Card */}
          <div className="mt-5 rounded-xl bg-gray-100 p-4 shadow-sm">
            <div className="flex justify-between text-xs sm:text-sm text-gray-600">
              <span>Student Name :</span>
              <span className="font-medium text-gray-800">{studentName}</span>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-600">Status :</span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium
                  ${
                    isCheckIn
                      ? "bg-green-200 text-green-700"
                      : "bg-red-200 text-red-700"
                  }`}
              >
                {isCheckIn ? "Check-in" : "Check-out"}
              </span>
            </div>
          </div>
        </div>

        {/* ===== Button ===== */}
        <button
          onClick={onClose}
          className="mt-6 sm:mt-8 mx-auto flex w-full max-w-xs items-center justify-center rounded-2xl bg-kmitl hover:bg-orange-500 active:bg-orange-600 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-white"
        >
          Done
        </button>
      </div>
    </div>
  );
}
