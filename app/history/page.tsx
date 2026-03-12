"use client"

import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import React, { useEffect, useState, useRef } from "react"
import { LogOut, Building2, LogOut as LogOutIcon } from "lucide-react"

// Added 'timestamp' so we can format the time and filter by date
type HistoryItem = {
  status: "checked_in" | "checked_out"
  room_code: string
  student_id: string
  user_name: string
  timestamp: string 
}

type AttendanceItemProps = {
  location: string
  status: string
  time: string
  type: string
  statusColor: string
  isExit?: boolean
}

const AttendancePage = () => {
  const [showCalendar, setShowCalendar] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [allHistory, setAllHistory] = useState<HistoryItem[]>([])
  const [studentName, setStudentName] = useState("")
  const [studentId, setStudentId] = useState("")
  
  const [selectedDate, setSelectedDate] = useState("")
  const [showAll, setShowAll] = useState(false)
  const dateInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetch("http://localhost:4000/history")
        const data = await res.json()

        if (data.success) {
          setHistory(data.data)
          setAllHistory(data.data)

          if (data.data.length > 0) {
            setStudentName(data.data[0].user_name)
            setStudentId(data.data[0].student_id)
          }
        }
      } catch (err) {
        console.error(err)
      }
    }

    loadHistory()
  }, [])

  // Fixed the filtering logic
  useEffect(() => {
    if (!selectedDate) {
      setHistory(allHistory)
      return
    }

    const filtered = allHistory.filter(item => {
      if (!item.timestamp) return false;
      // Assuming timestamp is an ISO string like "2024-10-25T08:30:00Z"
      const itemDate = new Date(item.timestamp).toISOString().split("T")[0];
      return itemDate === selectedDate;
    })

    setHistory(filtered)
  }, [selectedDate, allHistory])

  // Wrapped the entire return in a Fragment <> ... </> to fix the JSX error
  return (
    <>
      <div className="min-h-screen bg-gray-50 font-sans text-slate-700">

        {/* Navbar */}
        <nav className="bg-white border-b px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-blue-900 text-xl">
            <div className="bg-blue-800 p-1.5 rounded">
              <Building2 className="text-white w-6 h-6" />
            </div>
            EDUPORTAL
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right text-xs">
              <p className="font-bold hidden sm:block">{studentId || "-"}</p>
              <p className="text-gray-400 hidden sm:block">Student</p>
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
                {studentName || "Student Name"}
              </h1>
            </div>

            <div className="space-y-1 text-gray-500 text-sm">
              <p className="flex items-center gap-2 uppercase tracking-tight">
                🏢 ID: {studentId || "-"}
              </p>
              <p className="flex items-center gap-2">
                👤 Computer Science & Engineering
              </p>
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
                📅 {selectedDate ? selectedDate : "Select Date"}
                <input
                type="date"
                ref={dateInputRef}
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value)
                }}
                className="hidden"
              />
            </div>
          </div>

          {/* Logs */}
          <div className="space-y-3">
            {history.length === 0 && (
              <p className="text-gray-500 text-sm">
                No history found
              </p>
            )}

            {(showAll ? history : history.slice(0, 3)).map((item, index) => {
              // Extract the time format (e.g., 08:30 AM)
              const timeString = item.timestamp 
                ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                : "--:--";

              return (
                <AttendanceItem
                  key={index}
                  location={`Room ${item.room_code}`}
                  status={item.status === "checked_in" ? "Checked In" : "Checked Out"}
                  time={timeString}
                  type={item.status === "checked_in" ? "ENTRY" : "EXIT"}
                  // Dynamic colors based on status
                  statusColor={item.status === "checked_in" ? "text-emerald-500" : "text-rose-500"}
                  isExit={item.status === "checked_out"}
                />
              )
            })}
          </div>

          {/* Footer Link */}
          <div className="text-center pt-6">



          {!showAll && (

            <button

              onClick={() => setShowAll(true)}

              className="text-blue-600 font-bold text-sm hover:underline"

            >

              View All Historical Records

            </button>

          )}



        </div>

        </main>

        <footer className="text-center py-8 text-gray-400 text-xs">
          © 2024 EduPortal Integrated Systems. All rights reserved.
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
                  const offset = date.getTimezoneOffset()
                  const localDate = new Date(date.getTime() - (offset*60*1000))
                  setSelectedDate(localDate.toISOString().split("T")[0])
                }
                setShowCalendar(false)
              }}
              inline
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
  )
}

const AttendanceItem = ({
  location,
  status,
  time,
  type,
  statusColor,
  isExit = false
}: AttendanceItemProps) => (
  <div className="bg-white border rounded-xl p-4 flex items-center justify-between shadow-sm">
    <div className="flex items-center gap-4">
      <div className="bg-blue-50 p-2.5 rounded-lg">
        {isExit
          ? <LogOutIcon className="text-blue-300 w-5 h-5" />
          : <Building2 className="text-blue-700 w-5 h-5" />
        }
      </div>

      <div>
        <h4 className="font-bold text-slate-800 text-sm">
          {location}
        </h4>
        <p className="text-[11px]">
          <span className="text-gray-400">
            • Check-{isExit ? "out" : "in"} Status:
          </span>{" "}
          <span className={`${statusColor} font-bold`}>
            {status}
          </span>
        </p>
      </div>
    </div>

    <div className="text-right">
      <div className="text-xl font-bold text-slate-800">
        {time}
      </div>
      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
        {type} TIME
      </div>
    </div>
  </div>
)

export default AttendancePage