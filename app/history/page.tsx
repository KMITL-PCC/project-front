"use client";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, { useEffect, useState, useRef } from "react";
import { LogOut, Building2, LogOut as LogOutIcon } from "lucide-react";

// Added 'timestamp' so we can format the time and filter by date
type HistoryItem = {
  status: "checked_in" | "checked_out";
  room_code: string;
  student_id: string;
  user_name: string;
  timestamp: string;
};

type AttendanceItemProps = {
  location: string;
  status: string;
  time: string;
  type: string;
  statusColor: string;
  isExit?: boolean;
};

const AttendancePage = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [allHistory, setAllHistory] = useState<HistoryItem[]>([]);
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [studentMajor, setStudentMajor] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedDate, setSelectedDate] = useState("");
  const [showAll, setShowAll] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "Select Date";
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  };

  const handleLogout = () => {
    // Clear user data and redirect to login
    localStorage.removeItem("token");
    window.location.href = "/login";
  };
  const loadUser = async () => {
    try {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to get user");

      const data = await res.json();

      console.log("User:", data);

      setStudentName(data.user.user_name);
      setStudentId(data.user.student_id);
      setStudentMajor(data.user.major);
      setRole(data.user.role);

      return data.user.student_id;
    } catch (err) {
      console.error(err);
      setError("Failed to load user");
    }
  };
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError("");

      try {
        // 1 โหลด user ก่อน
        const studentId = await loadUser();

        // 2 โหลด history ของ user
        const res = await fetch(`/api/history/${studentId}`);

        if (!res.ok) throw new Error("History API error");

        const data = await res.json();

        console.log("History:", data);

        if (data.success) {
          setHistory(data.data);
          setAllHistory(data.data);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";

        console.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // Fixed the filtering logic
  useEffect(() => {
    if (!selectedDate) {
      setHistory(allHistory);
      return;
    }

    const filtered = allHistory.filter((item) => {
      if (!item.timestamp) return false;
      // Assuming timestamp is an ISO string like "2024-10-25T08:30:00Z"
      const itemDate = new Date(item.timestamp).toISOString().split("T")[0];
      return itemDate === selectedDate;
    });

    setHistory(filtered);
  }, [selectedDate, allHistory]);

  // Wrapped the entire return in a Fragment <> ... </> to fix the JSX error
  return (
    <div className="font">
      <div className="min-h-screen bg-gray-50 font-sans text-slate-700">
        {/* Navbar */}
        <nav className="h-16 md:h-20 w-full flex justify-between items-center px-3 md:px-4 shadow-md bg-white sticky top-0 z-50">
          <div className="flex items-center gap-2 md:gap-4">
            <img
              src="KMITL.png"
              alt="KMITL"
              title="KMITL"
              className="h-8 sm:h-10 md:h-16 w-auto"
            />
            <img
              src="ceolgo.png"
              alt="CE03"
              title="CE03"
              className="h-8 sm:h-10 md:h-16 w-auto"
            />
          </div>

          <div className="text-base sm:text-xl md:text-2xl font-extrabold text-[#203864]">
            History
          </div>

          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-2 py-1 md:px-3 md:py-2 border border-[#FE6136] hover:bg-[#F5F5F5] text-[#FE6136] cursor-pointer rounded-lg transition-all ml-2 md:ml-4 text-sm md:text-base"
            >
              <LogOut className="w-5 h-5 md:w-6 md:h-6" />
              <span>Log out</span>
            </button>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <p className="text-gray-500">Loading attendance history...</p>
            </div>
          ) : (
            <>
          {/* Profile Card */}
          <section className="bg-white rounded-xl shadow-sm p-8 flex flex-col items-center sm:items-start relative overflow-hidden">
            <div className="flex items-baseline gap-3 mb-2">
              <h1 className="text-3xl font-bold text-slate-800">
                {studentName || "User Name"}
              </h1>
            </div>

            <div className="space-y-1 text-gray-500 text-sm">
              <div className="flex items-center gap-2">
                <img src="/id.png" alt="ID Icon" className="w-5 h-5" />
                <p className="flex items-center gap-2 uppercase tracking-tight">
                  ID: {studentId || "-"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <img
                  src="/major.png"
                  alt="Major Icon"
                  className="w-5 h-5 opacity-40"
                />
                <p className="flex items-center gap-2">
                  Major: {studentMajor || "-"}
                </p>
              </div>
            </div>
          </section>

          {/* Attendance History Header */}
          <div className="flex justify-between items-center pt-4">
            <h2 className="text-lg font-bold text-slate-800">
              Attendance History
            </h2>

            <div
              onClick={() => setShowCalendar(true)}
              className="text-gray-400 text-xs flex items-center gap-2 uppercase cursor-pointer"
            >
              <img
                src="/calendar.png"
                alt="Calendar Icon"
                className="w-4 h-4 opacity-45"
              />

              {selectedDate ? formatDateDisplay(selectedDate) : "Select Date"}

              <input
                type="date"
                ref={dateInputRef}
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                }}
                className="hidden"
              />
            </div>
          </div>
        
          {/* Logs */}
          <div className="space-y-4">
            {history.length === 0 && (
              <div className="flex flex-col items-center justify-center bg-gray-50 border border-dashed border-gray-300 rounded-xl p-10 text-center">
                <div className="bg-gray-200/50 p-3 rounded-full mb-3">
                  <img src="/calendar.png" alt="No data" className="w-6 h-6 opacity-40 grayscale" />
                </div>
                <h3 className="text-slate-700 font-semibold mb-1">No Records Found</h3>
                <p className="text-gray-500 text-md">There is no attendance history for this date.</p>
              </div>
            )}

            {(showAll ? history : history.slice(0, 3)).map((item, index) => {
              // Extract the time format (e.g., 08:30 AM)
              const timeString = item.timestamp
                ? new Date(item.timestamp).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).replace(",", " ·")
                : "--";

              return (
                <AttendanceItem
                  key={index}
                  location={`Room ${item.room_code}`}
                  status={item.status === "checked_in" ? "Checked In" : "Checked Out"}
                  time={timeString}
                  type={item.status === "checked_in" ? "ENTRY" : "EXIT"}
                  statusColor={
                    item.status === "checked_in"
                      ? "text-emerald-500"
                      : "text-rose-500"
                  }
                  isExit={item.status === "checked_out"}
                />
              );
            })}
          </div>

          {/* Footer Link */}
          <div className="text-center pt-6">
            {!showAll && (
              <button
                onClick={() => setShowAll(true)}
                className="text-orange-400 font-bold text-sm hover:underline"
              >
                View All Historical Records
              </button>
            )}
          </div>
            </>
          )}
        </main>

        <footer className="text-center py-8 text-gray-400 text-xs">
          KMITL, PCC | Computer Engineering &copy; 2026
        </footer>
      </div>

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="flex flex-col justify-center content-center bg-white p-4 rounded-xl shadow-lg relative">
            <DatePicker
              selected={selectedDate ? new Date(selectedDate) : null}
              onChange={(date: Date | null) => {
                if (date) {
                  // Standardize to YYYY-MM-DD format
                  const offset = date.getTimezoneOffset();
                  const localDate = new Date(
                    date.getTime() - offset * 60 * 1000,
                  );
                  setSelectedDate(localDate.toISOString().split("T")[0]);
                }
                setShowCalendar(false);
              }}
              inline
              dateFormat="dd/MM/yyyy"
            />
            {/* Added a close button for better UX */}
            <button
              onClick={() => setShowCalendar(false)}
              className="mt-4 w-full py-2 bg-gray-100 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const AttendanceItem = ({
  location,
  status,
  time,
  type,
  statusColor,
  isExit = false,
}: AttendanceItemProps) => (
  <div className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm">
    <div className="flex items-center gap-4">
      <div className="bg-blue-50 p-2.5 rounded-lg">
        {isExit ? (
          <LogOutIcon className="text-kmitl w-5 h-5" />
        ) : (
          <Building2 className="text-kmitl w-5 h-5" />
        )}
      </div>

      <div>
        <h4 className="font-bold text-slate-800 text-sm">{location}</h4>
        <p className="text-[11px]">
          <span className="text-gray-400">
            • Check-{isExit ? "out" : "in"} Status:
          </span>{" "}
          <span className={`${statusColor} font-bold`}>{status}</span>
        </p>
      </div>
    </div>

    <div className="text-right">
      <div className="text-xs text-gray-400 font-medium">{time}</div>
      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
        {type} TIME
      </div>
    </div>
  </div>
);

export default AttendancePage;
