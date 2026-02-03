"use client";

import React, { useState, useEffect, useRef } from 'react';
import './styles/scrollbar.css';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  startOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
} from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChevronDown, Monitor, Clock, User, Presentation, FileSpreadsheet } from 'lucide-react';

const datain = [
  { value: 60, name: 'Total Student', isMain: true, progress: 100 },
  { value: 58, name: '00:00 - 11:59', isMain: false, progress: 96.67 },
  { value: 55, name: '12:00 - 16:00', isMain: false, progress: 91.67 },
  { value: 57, name: '17:00 - 23:59', isMain: false, progress: 95 },
];

const dataout = [
  { value: 60, name: 'Total Student', isMain: true, progress: 100 },
  { value: 48, name: '00:00 - 11:59', isMain: false, progress: 80 },
  { value: 50, name: '12:00 - 16:00', isMain: false, progress: 83.33 },
  { value: 47, name: '17:00 - 23:59', isMain: false, progress: 78.33 },
];

const StatCard = ({ item, type }: { item: any, type: 'in' | 'out' }) => (
  <div className={`relative p-3 rounded-2xl flex flex-col justify-between h-42 min-w-[100px] ${type === 'in' ? 'bg-[#E0E6F2] border border-[#D0D7E4]' : 'bg-[#FFE2DB] border border-[#F5C2C7]'
    }`}>
    {/* Icon Top Right */}
    <div className="absolute top-4 right-4 text-[#203864]">
      {item.isMain ? <Presentation size={20} strokeWidth={3} /> : <Clock size={20} strokeWidth={3} />}
    </div>
    {/* Center Content */}
    <div className="mt-10">
      <h2 className="text-[16px] font-bold text-[#203864] mb-2">{item.value}</h2>
      <p className={`text-[12px] font-semibold ${type === 'in' ? 'text-orange-500' : 'text-orange-600'
        }`}>
        {item.name}
      </p>
    </div>
    {/* Progress Footer */}
    <div className="w-full mt-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] text-gray-500">Progress</span>
        <span className="text-[10px] text-gray-500">{item.progress}%</span>
      </div>
      <div className="w-full bg-gray-300 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-green-600 h-full rounded-full transition-all duration-500"
          style={{ width: `${item.progress}%` }}
        />
      </div>
    </div>
  </div>
);

const students = [
  { name: "John Doe", id: "66200xxx", in: "10:15", out: "12:15" },
  { name: "Jane Eleven", id: "66200xxx", in: "10:16", out: "12:17" },
  { name: "Mike Kawazaki", id: "66200xxx", in: "17:15", out: "20:12" },
  { name: "Vecna Vasit", id: "66200xxx", in: "17:16", out: "20:11" },
  { name: "Vecna Vasit", id: "66200xxx", in: "17:16", out: "20:11" },
  { name: "Vecna Vasit", id: "66200xxx", in: "17:16", out: "20:11" },
];

const COLORS = ['#66C975', '#FADB60', '#CE5353'];

export default function HomePage() {
  const rooms = ['B 218', 'B 219', 'B 220', 'C 101'];
  const [selectedRoom, setSelectedRoom] = useState('B 218');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);


  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const renderCalendarCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);

    const calendarDays = Array.from({ length: 42 }, (_, i) =>
      addDays(startDate, i)
    );

    return calendarDays.map((day) => {
      const isSelected = isSameDay(day, selectedDate);
      const isCurrentMonth = isSameMonth(day, monthStart);
      const dayLabel = format(day, 'd');
      const isFirstDay = dayLabel === '1';

      return (
        <div
          key={day.toISOString()}
          onClick={() => {
            if (isCurrentMonth) setSelectedDate(day);
          }}
          className={`relative flex items-center justify-center h-9.5 w-9.5 mx-auto text-sm transition-colors duration-200 mt-0.4
    ${isCurrentMonth ? 'cursor-pointer w-8 h-8 hover:bg-gray-100 rounded-full' : 'cursor-default opacity-40'}
  `}
        >

          {isSelected && (
            <div className="absolute w-8 h-8 bg-[#4a5d7e] rounded-full" />
          )}

          <span
            className={`relative z-10 font-medium ${isSelected
              ? 'text-white'
              : isCurrentMonth
                ? 'text-[#1e3a5f]'
                : 'text-gray-300'
              }`}
          >
            {dayLabel}
          </span>
        </div>
      );
    });
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden font-sans">
      {/* HEADER */}
      <div className="h-20 w-full flex justify-between items-center px-4 shadow-md ">
        <div className="flex items-center">
          <img src="KMITL.png" className="h-16" />
          <img src="ce-logo.png" className="h-16 ml-2" />
        </div>

        <div className="text-2xl font-extrabold text-[#203864]">
          Dashboard
        </div>

        <div className="flex items-center">
          <div className="text-right mr-4">
            <div className="font-bold">Lord Gaydow</div>
            <div className="text-sm">Professor</div>
          </div>
          <img
            src="user.jpg"
            className="w-12 h-12 object-cover rounded-full border"
          />
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 grid grid-cols-4 min-h-0">
        <div className="col-span-3 grid grid-rows-10 min-h-0">
          {/* SELECT ROOM */}
          <div ref={dropdownRef} className="row-span-1 flex flex-col justify-center">
            <button onClick={() => setIsOpen(!isOpen)} className="w-32 h-12 ml-4 rounded-xl flex items-center justify-center text-lg hover:bg-[#F5F5F5] transition-colors duration-200 cursor-pointer">
              <span className='text-[#FE6136] font-bold'>ROOM</span>
              <ChevronDown size={24} color='#FE6136' className={`ml-2 transition-transform duration-300  ${isOpen ? 'rotate-180' : 'rotate-0'
                }`} />
            </button>

            {isOpen && (
              <div className="absolute top-35 ml-7 left-0 w-40 bg-white rounded-xl shadow-lg z-50">
                {rooms.map((room) => (
                  <div
                    key={room}
                    onClick={() => {
                      setSelectedRoom(room);
                      setIsOpen(false);
                    }}
                    className="px-4 py-2 cursor-pointer hover:bg-orange-100
                       text-[#203864] font-medium  hover:bg-orange-100 first:hover:rounded-t-xl last:hover:rounded-b-xl"
                  >
                    {room}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* CARD TIMEIN&OUT */}
          <div className="row-span-4">
            <div className="pl-4 pr-4 pb-4 min-h-screen inset-0 rounded-b-3xl ">
              <h1 className="text-[24px] font-bold text-center text-orange-600">{selectedRoom}</h1>
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Section: Time In */}
                <div>
                  <h3 className="text-[16px] font-bold text-center text-[#203864] mb-2">Time in</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 ml-3">
                    {datain.map((item, idx) => (
                      <StatCard key={idx} item={item} type="in" />
                    ))}
                  </div>
                </div>

                {/* Section: Time Out */}
                <div>
                  <h3 className="text-[16px] font-bold text-center text-[#203864] mb-2">Time out</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mr-3">
                    {dataout.map((item, idx) => (
                      <StatCard key={idx} item={item} type="out" />
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
          {/* HISTORY */}
          <div className="row-span-5">
            <div className="w-full pl-8 pt-4">
              <div className="mb-2 flex justify-between items-center gap-2 ">
                <h1 className='text-[20px] font-semibold text-[#FE6136]'>Total Student</h1>
                <button
                  className="mr-8 p-1.5 rounded-lg hover:bg-[#F5F5F5] transition-colors duration-200 group"
                  title="Export Excel"
                >
                  <FileSpreadsheet
                    size={22}
                    className="text-gray-500 group-hover:text-green-600 transition-colors"
                  />
                </button>

              </div>

              {/* Table Header */}
              <div className='p-3 max-h-65 overflow-y-auto custom-scrollbar'>
                <div className="grid grid-cols-4 px-4 text-[#FE6136] font-medium mr-8 mb-2">
                  <div>Name</div>
                  <div>Student Id</div>
                  <div className="text-center">Time in</div>
                  <div className="text-center">Time out</div>
                </div>

                {/* Table Body */}
                <div className="space-y-2">
                  {students.map((student, index) => (
                    <div
                      key={index}
                      className={`grid grid-cols-4 items-center px-4 py-3 rounded-lg mr-8
              ${index % 2 === 0 ? "bg-[#E0E6F2]" : "bg-white"}`}
                    >
                      <div className="font-medium text-slate-700">
                        {student.name}
                      </div>
                      <div className="text-slate-700">
                        {student.id}
                      </div>
                      <div className="text-center text-slate-700">
                        {student.in}
                      </div>
                      <div className="text-center text-slate-700">
                        {student.out}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-rows-7 h-full min-h-0 ">
          {/* CALENDAR */}
          <div className="row-span-3 p-3 pb-0.5 grid grid-rows-[auto_auto_1fr] min-h-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="ml-3 text-xl font-bold text-[#1e3a5f]">
                {format(currentMonth, 'MMMM yyyy')}
              </h3>
              {/* <div className="hidden">hidden</div> */}

              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <ChevronDown size={24} color='#757575' className={`transition-transform duration-300 rotate-90`} />
                </button>
                <button
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <ChevronDown size={24} color='#757575' className={`transition-transform duration-300 rotate-270`} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 overflow-hidden">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'].map((d) => (
                <div
                  key={d}
                  className="text-center text-xs font-semibold text-gray-400 uppercase"
                >
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 flex-1 min-h-0 items-center">
              {renderCalendarCells()}
            </div>
          </div>
          {/* PIE CHART */}
          <div className="row-span-4 grid grid-rows-[auto_1fr] h-full ">
            <div className="py-0.5 pl-4 pt-7 text-sm text-[#203864] text-start row-span-1 font-bold">
              {format(selectedDate, 'dd MMMM')}
            </div>
            <div className="grid grid-rows-2 gap-1 h-full ml-2 mr-2">
              <div className="rounded-3xl bg-[#E0E6F2] border border-[#D0D7E4] relative ">
                <div className='h-40 w-full absolute '>
                  <div className='absolute inset-0 flex justify-center pointer-events-none'>
                    <h1 className='font-bold text-[#203864]'>Time in</h1>
                  </div>
                  <div>
                    <ResponsiveContainer width="50%" height="100%" className="absolute">
                      <PieChart>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-white px-3 py-2 border rounded-xl shadow-md">
                                  <p className="text-xs font-bold text-[#203864]">
                                    {payload[0].name}
                                  </p>
                                  <p className="text-sm font-extrabold" style={{ color: payload[0].payload.fill }}>
                                    Total : {payload[0].value}
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Pie
                          data={datain.slice(1)}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          innerRadius={35}
                          outerRadius={65}
                          paddingAngle={0}
                          stroke="none"
                          strokeWidth={0}
                          activeShape={{ stroke: '#fff', strokeWidth: 2 }}
                        >
                          {datain.slice(1).map((_, index) => (
                            <Cell key={index} fill={COLORS[index]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-1/2 flex flex-col items-center gap-3 ml-40 mt-10">
                    {datain.slice(1).map((entry, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div
                          className="w-5 h-5 rounded-md"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-[12px] font-extrabold" style={{ color: COLORS[index % COLORS.length] }}>
                          {entry.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="rounded-3xl bg-[#FFE2DB] border border-[#F5C2C7] relative ">
                <div className='h-40 w-full absolute '>
                  <div className='absolute inset-0 flex justify-center pointer-events-none'>
                    <h1 className='font-bold text-[#203864]'>Time out</h1>
                  </div>
                  <div>
                    <ResponsiveContainer width="50%" height="100%" className="absolute">
                      <PieChart>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-white px-3 py-2 border rounded-xl shadow-md">
                                  <p className="text-xs font-bold text-[#203864]">
                                    {payload[0].name}
                                  </p>
                                  <p className="text-sm font-extrabold" style={{ color: payload[0].payload.fill }}>
                                    Total : {payload[0].value}
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Pie
                          data={dataout.slice(1)}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          innerRadius={35}
                          outerRadius={65}
                          paddingAngle={0}
                          stroke="none"
                          strokeWidth={0}
                          activeShape={{ stroke: '#fff', strokeWidth: 2 }}
                        >
                          {dataout.slice(1).map((_, index) => (
                            <Cell key={index} fill={COLORS[index]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-1/2 flex flex-col items-center gap-3 ml-40 mt-10">
                    {dataout.slice(1).map((entry, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div
                          className="w-5 h-5 rounded-md"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-[12px] font-extrabold" style={{ color: COLORS[index % COLORS.length] }}>
                          {entry.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
