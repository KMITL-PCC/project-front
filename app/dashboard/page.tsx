"use client";

import React, { useState, useEffect, useRef } from "react";
import "./styles/calendar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  ChevronDown,
  Search,
  FileSpreadsheet,
  Presentation,
  Clock,
  LogOut
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend, // <-- Add this
  ResponsiveContainer,
} from "recharts";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const MOCK_DATA = [
  {
    id: "66200xxx",
    name: "Kaki Miku",
    room: "B218",
    checkIn: "10:15",
    checkOut: "12:15",
  },
  {
    id: "66200xxx",
    name: "Tata",
    room: "B218",
    checkIn: "10:16",
    checkOut: "12:17",
  },
  {
    id: "66200xxx",
    name: "Polymale",
    room: "B219",
    checkIn: "17:15",
    checkOut: "20:12",
  },
  {
    id: "66200xxx",
    name: "UwU",
    room: "B219",
    checkIn: "17:16",
    checkOut: "20:11",
  },
];

const data = [
  { time: "08:00", students: 10 },
  { time: "09:00", students: 45 },
  { time: "10:00", students: 58 },
  { time: "11:00", students: 60 },
  { time: "12:00", students: 0 },
  { time: "13:00", students: 52 },
  { time: "14:00", students: 60 },
];

const data_out = [
  { time: "08:00", students: 0 },
  { time: "09:00", students: 0 },
  { time: "10:00", students: 0 },
  { time: "11:00", students: 0 },
  { time: "12:00", students: 60 },
  { time: "13:00", students: 0 },
  { time: "14:00", students: 0 },
];

const combinedData = data.map((item, index) => ({
  time: item.time,
  checkIn: item.students,
  checkOut: data_out[index].students,
}));

function Dashboard() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("All");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  // Filter and search logic
  const filteredStudents = MOCK_DATA.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.includes(searchTerm) ||
      item.room.includes(searchTerm) ||
      item.checkIn.includes(searchTerm) ||
      item.checkOut.includes(searchTerm);

    const matchesRoom = selectedRoom === "All" || item.room === selectedRoom;

    return matchesSearch && matchesRoom;
  });

  return (
    <div className="font-sans">
      {/* HEADER */}
      <div className="h-16 md:h-20 w-full flex justify-between items-center px-3 md:px-4 shadow-md bg-white transition-all duration-300 sticky top-0 z-50">
        <div className="flex items-center gap-2 md:gap-4">
          <img
            src="KMITL.png"
            alt="KMITL"
            title="KMITL"
            className="h-8 sm:h-10 md:h-16 w-auto transition-all"
          />
          <img
            src="ce-logo.png"
            alt="CE03"
            title="CE03"
            className="h-8 sm:h-10 md:h-16 w-auto transition-all"
          />
        </div>
        <div className="text-base sm:text-xl md:text-2xl font-extrabold text-[#203864] transition-all">
          Dashboard
        </div>
        <div className="flex items-center">
          <div className="hidden sm:block text-right mr-3 md:mr-4">
            <div className="text-sm md:text-base font-bold">Lord Gaydow</div>
            <div className="text-xs md:text-sm text-gray-600">Professor</div>
          </div>
          {/* <img
            src="user.jpg"
            alt="User Profile"
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-cover rounded-full border transition-all"
          /> */}
          <button className="flex items-center gap-1 px-2 py-1 md:px-3 md:py-2 border-1 border-[#FE6136] hover:bg-[#F5F5F5] text-[#FE6136] cursor-pointer rounded-lg transition-all ml-2 md:ml-4 text-sm md:text-base">
            <LogOut color="#FE6136" className="w-5 h-5 md:w-6 md:h-6 transition-colors" />
            <span>Log out</span>
          </button>
        </div>
      </div>

      {/* Selection Date */}
      <div className="flex flex-col items-start p-3">
        <div className="relative">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            customInput={
              <button className="flex items-center gap-2 px-4 py-2 border-1 border-[#FE6136] hover:bg-[#F5F5F5] text-[#FE6136] rounded-lg transition-all">
                <span>
                  {selectedDate
                    ? selectedDate.toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                    : "Select date"}
                </span>
                <ChevronDown className="w-5 h-5" />
              </button>
            }
            calendarClassName="custom-calendar-style ml-30"
          />
        </div>
      </div>

      {/* Room Number */}
      <div className="mb-8">
        <h2 className="text-[#FE6136] font-bold text-md text-center md:text-center uppercase tracking-wide">
          Chart Room {selectedRoom === "All" ? "Overview" : selectedRoom}
        </h2>
      </div>

      {/* phone's cards */}
      <div className="flex flex-row justify-around items-center gap-2 md:gap-2 mb-7 bg-white rounded-2xl block md:hidden">
        <StatCircle
          percentage={45}
          label="Total Student"
          color="text-orange-500"
          stroke="stroke-orange-500"
          sub=" peoples"
        />
        <StatCircle
          percentage={45}
          label="Check out"
          color="text-teal-500"
          stroke="stroke-teal-500"
          sub=" peoples"
        />
        <StatCircle
          percentage={40}
          label="Check in"
          color="text-slate-700"
          stroke="stroke-slate-700"
          sub=" peoples"
        />
      </div>

      {/* Line Chart for desktop and tablet */}
      <div className="hidden md:flex justify-around gap-[4%] p-6 w-full mx-auto bg-white rounded-xl">
        <div className="flex-1 self-center h-[350px] w-full border border-gray-100 rounded-3xl p-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={combinedData}
              margin={{ top: 10, right: 10, bottom: 10, left: -20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f3f4f6"
              />

              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                }}
                labelStyle={{
                  color: "#1f2937",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
              />

              <Legend verticalAlign="top" height={36} />

              <XAxis
                dataKey="time"
                stroke="#9ca3af"
                fontSize={14}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="#9ca3af"
                fontSize={14}
                tickLine={false}
                axisLine={false}
              />

              <Line
                type="monotone"
                dataKey="checkIn" // match the key in function combinedData
                name="Check In" // this will be showed in tooltip and legend
                stroke="#1e3a8a"
                strokeWidth={4}
                dot={{ r: 5, fill: "#1e3a8a", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{
                  r: 8,
                  fill: "#ff5a36",
                  stroke: "#fff",
                  strokeWidth: 3,
                }}
              />
              <Line
                type="monotone"
                dataKey="checkOut" // match the key in function combinedData
                name="Check Out" // this will be showed in tooltip and legend
                stroke="#ff5a36"
                strokeWidth={4}
                dot={{ r: 5, fill: "#ff5a36", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{
                  r: 8,
                  fill: "#1e3a8a",
                  stroke: "#fff",
                  strokeWidth: 3,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ส่วนขวา: การ์ดสถิติ (จัดเรียงอยู่ข้างๆ กราฟ) */}
        <div className="flex flewx-row flex flex-col gap-5 w-[220px] shrink-0">
          {/* Card 1: Total Student */}
          <div className="bg-[#e8edf5] rounded-3xl p-6 relative h-full flex flex-col justify-end min-h-[140px]">
            <div className="absolute top-5 right-5">
              <Presentation
                className="text-[#1e3a8a] w-7 h-7"
                strokeWidth={2.5}
              />
            </div>
            <div>
              <div className="text-[40px] leading-none font-bold text-[#1e3a8a] mb-2">
                60
              </div>
              <div className="text-[#ff5a36] text-sm font-semibold tracking-wide">
                Total Student
              </div>
            </div>
          </div>

          {/* Card 2: Check-in */}
          <div className="bg-[#e8edf5] rounded-3xl p-6 relative h-full flex flex-col justify-end min-h-[140px]">
            <div className="absolute top-5 right-5">
              <Clock className="text-[#1e3a8a] w-7 h-7" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-[40px] leading-none font-bold text-[#1e3a8a] mb-2">
                58
              </div>
              <div className="text-[#ff5a36] text-sm font-semibold tracking-wide">
                check-in
              </div>
            </div>
          </div>

          {/* Card 3: Check-out */}
          <div className="bg-[#e8edf5] rounded-3xl p-6 relative h-full flex flex-col justify-end min-h-[140px]">
            <div className="absolute top-5 right-5">
              <Clock className="text-[#1e3a8a] w-7 h-7" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-[40px] leading-none font-bold text-[#1e3a8a] mb-2">
                55
              </div>
              <div className="text-[#ff5a36] text-sm font-semibold tracking-wide">
                check-out
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3 mb-8 h-12">
        <div className="relative flex-1 ml-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search Name, ID, or Time..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#E8EEFB] rounded-full focus:outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative flex-1 md:flex-none ">
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="appearance-none w-full md:w-40 sm:w-10 h-12 bg-[#E8EEFB] px-4 pr-10 rounded-xl font-bold text-[#FE6136] focus:outline-none cursor-pointer border-2 border-transparent hover:border-orange-200 transition-all"
          >
            <option value="All">Room: All</option>
            <option value="B217">B217</option>
            <option value="B218">B218</option>
            <option value="B301">B301</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FE6136] pointer-events-none" />
        </div>
      </div>

      {/*history list name */}
      {/* check user role (professor, student) */}
      <div className="bg-white rounded-xl text-lg overflow-hidden">
        <div className="pl-4">
          <h3 className="text-[#FE6136] font-bold">Total Student</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[#FE6136] text-sm md:text-base border-b border-grey-200">
                <th className="hidden sm:block p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold text-center">Student Id</th>
                <th className="p-4 font-semibold text-center">Room code</th>
                <th className="p-4 font-semibold text-center">Check in</th>
                <th className="p-4 font-semibold text-center">Check out</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((row, index) => (
                <tr
                  key={index}
                  className={`last:border-0 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-[#E8EEFB]/30"}`}
                >
                  <td className="hidden sm:block p-4 font-medium text-sm md:text-base">
                    {row.name}
                  </td>
                  <td className="p-4 text-center text-gray-600 text-sm">
                    {row.id}
                  </td>
                  <td className="p-4 text-center text-gray-600 text-sm">
                    {row.room}
                  </td>
                  <td className="p-4 text-center text-gray-600 text-sm">
                    {row.checkIn}
                  </td>
                  <td className="p-4 text-center text-gray-600 text-sm">
                    {row.checkOut}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCircle({ percentage, label, color, stroke, sub }: any) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center mb-2">
        <svg className="w-28 h-28 md:w-32 md:h-32 transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-100"
          />
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`${stroke} transition-all duration-1000`}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-xl md:text-2xl font-bold">{percentage}</span>
          <span className="text-[10px] text-gray-400 font-medium">{sub}</span>
        </div>
      </div>
      <span className={`${color}`}>{label}</span>
    </div>
  );
}

export default Dashboard;
