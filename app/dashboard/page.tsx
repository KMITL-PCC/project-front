"use client";

import React, { useState } from 'react';
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

const datain = [
  { name: '00:00 - 11:59', value: 7 },
  { name: '12:00 - 16:00', value: 7 },
  { name: '17:00 - 23:59', value: 10 },
];

const dataout = [
  { name: '00:00 - 11:59', value: 10 },
  { name: '12:00 - 16:00', value: 12 },
  { name: '17:00 - 23:59', value: 3 },
];

const COLORS = ['#66C975', '#FADB60', '#CE5353'];

export default function HomePage() {
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
      <div className="h-20 w-full flex justify-between items-center px-4 ">
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
        {/* CARD&HISTORY */}
        <div className="col-span-3 bg-blue-100" />

        <div className="grid grid-rows-7 h-full min-h-0 ">
          {/* CALENDAR */}
          <div className="row-span-3 p-3 pb-0.5 grid grid-rows-[auto_auto_1fr] min-h-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-bold text-[#1e3a5f]">
                {format(currentMonth, 'MMMM yyyy')}
              </h3>

              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <img src="arrow-icon.png" className='w-7 h-7' />
                </button>
                <button
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <img src="arrow-icon.png" className='w-7 h-7 rotate-180' />
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
                          data={datain}
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
                          {datain.map((_, index) => (
                            <Cell key={index} fill={COLORS[index]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-1/2 flex flex-col items-center gap-3 ml-40 mt-10">
                    {dataout.map((entry, index) => (
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
                          data={dataout}
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
                          {datain.map((_, index) => (
                            <Cell key={index} fill={COLORS[index]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-1/2 flex flex-col items-center gap-3 ml-40 mt-10">
                    {dataout.map((entry, index) => (
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
