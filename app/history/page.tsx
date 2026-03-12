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

  const [selectedDate, setSelectedDate] = useState("");
  const [showAll, setShowAll] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "Select Date";
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  };

useEffect(() => {
    const loadHistory = async () => {
      // --- เริ่มส่วน Mock Data ---
      const mockData: HistoryItem[] = [
        {
          status: "checked_in",
          room_code: "401",
          student_id: "65012345",
          user_name: "Somchai Jaidee",
          timestamp: "2026-03-07T08:15:00+07:00", // วันที่ 7 เช้า 8:15
        },
        {
          status: "checked_out",
          room_code: "401",
          student_id: "65012345",
          user_name: "Somchai Jaidee",
          timestamp: "2026-03-07T11:30:00+07:00", // วันที่ 7 ออก 11:30
        },
        {
          status: "checked_in",
          room_code: "LAB-2",
          student_id: "65012345",
          user_name: "Somchai Jaidee",
          timestamp: "2026-03-07T13:00:00+07:00", // วันที่ 7 เข้าแล็บ 13:00
        },
        {
          status: "checked_out",
          room_code: "LAB-2",
          student_id: "65012345",
          user_name: "Somchai Jaidee",
          timestamp: "2026-03-07T16:00:00+07:00", // วันที่ 7 ออกแล็บ 16:00
        },
        {
          status: "checked_in",
          room_code: "LIB-01",
          student_id: "65012345",
          user_name: "Somchai Jaidee",
          timestamp: "2026-03-06T10:00:00+07:00", // ของเมื่อวาน (วันที่ 6) เอาไว้เทส Filter
        }
      ];

      // เซ็ตข้อมูลลง State เพื่อจำลองว่าโหลดมาจาก API สำเร็จ
      setHistory(mockData);
      setAllHistory(mockData);

      if (mockData.length > 0) {
        setStudentName(mockData[0].user_name);
        setStudentId(mockData[0].student_id);
        setStudentMajor("Computer Engineering"); // จำลอง Major ไปด้วยเลยจะได้ไม่เป็นค่าว่าง (-)
      }
      // --- จบส่วน Mock Data ---

      /* คอมเมนต์โค้ดของจริงเอาไว้ชั่วคราว เวลาเทสเสร็จค่อยเอาคอมเมนต์ออก
      try {
        const res = await fetch("http://localhost:4000/history");
        const data = await res.json();

        if (data.success) {
          setHistory(data.data);
          setAllHistory(data.data);

          if (data.data.length > 0) {
            setStudentName(data.data[0].user_name);
            setStudentId(data.data[0].student_id);
          }
        }
      } catch (err) {
        console.error(err);
      }
      */
    };

    loadHistory();
  }, []);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetch("http://localhost:4000/history");
        const data = await res.json();

        if (data.success) {
          setHistory(data.data);
          setAllHistory(data.data);

          if (data.data.length > 0) {
            setStudentName(data.data[0].user_name);
            setStudentId(data.data[0].student_id);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadHistory();
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
    <>
      <div className="min-h-screen bg-gray-50 font-sans text-slate-700">
        {/* Navbar */}
        <nav className="bg-white border-b px-6 py-3 flex justify-between items-center">
          <div className="flex items-start gap-3">
            <img
              src="/KMITL.png"
              alt="KMITL Logo"
              className="w-auto h-15 md:w-40  sm:hidden block object-contain"
            />
            <img
              src="/Horizontal_KMITL_Logo.png"
              alt="KMITL Logo"
              className="w-auto h-20 hidden sm:block object-contain"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right text-md">
              <p className="font-bold hidden sm:block">{studentId || "-"}</p>
            </div>

            <button className="flex items-center justify-center gap-2 border rounded-md px-3 py-1.5 text-sm hover:bg-gray-200 transition cursor-pointer">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Profile Card */}
          <section className="bg-white rounded-xl shadow-sm border p-8 flex flex-col items-center sm:items-start relative overflow-hidden">
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
                ? new Date(item.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "--:--";

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
    </>
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
  <div className="bg-white border rounded-xl p-4 flex items-center justify-between shadow-sm">
    <div className="flex items-center gap-4">
      <div className="bg-blue-50 p-2.5 rounded-lg">
        {isExit ? (
          <LogOutIcon className="text-blue-300 w-5 h-5" />
        ) : (
          <Building2 className="text-blue-700 w-5 h-5" />
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
      <div className="text-xl font-bold text-slate-800">{time}</div>
      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
        {type} TIME
      </div>
    </div>
  </div>
);

export default AttendancePage;
