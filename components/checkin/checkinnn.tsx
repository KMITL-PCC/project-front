"use client";

type Props = {
  open: boolean;
  onClose: () => void;

  type: "checkin" | "checkout";
  room: string;
  time: string;
  studentName: string;
};

export default function CheckStatusModal({
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[360px] rounded-2xl bg-white p-6 shadow-xl flex flex-col">

        {/* ===== Content ===== */}
        <div className="flex-1">

          {/* Icon */}
          <div className="mx-auto mt-2 flex h-20 w-20 items-center justify-center rounded-full bg-kmitl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-kmu">
              <span className="text-2xl text-white">✓</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="mt-4 text-center text-lg font-semibold">
            {isCheckIn ? "Check-In" : "Check-Out"} <br />
            Successfully
          </h2>

          {/* Description */}
          <p className="mt-2 text-center text-sm text-gray-500">
            You have been checked {isCheckIn ? "in" : "out"} for <br />
            <span className="font-medium text-gray-700">
              Room {room}
            </span>{" "}
            at {time} today.
          </p>

          {/* Info Card */}
          <div className="mt-5 rounded-xl bg-gray-100 p-4 shadow-sm">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Student Name :</span>
              <span className="font-medium text-gray-800">
                {studentName}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-gray-600">Status :</span>
              <span
                className={`rounded-full px-4 py-1 text-xs font-medium
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
          className="mt-15 mx-auto flex w-60 items-center justify-center gap-3 rounded-full bg-kmitl py-3 text-white"
        >
          Done
        </button>
      </div>
    </div>
  );
}
