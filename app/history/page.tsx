// import React from 'react';
// import { LogOut, LayoutDashboard, Building2, LogIn, LogOut as LogOutIcon } from 'lucide-react';

const AttendancePage = () => {
  return (
    <h1>Hello</h1>
    //     <div className="min-h-screen bg-gray-50 font-sans text-slate-700">
    //       {/* 1. Navbar */}
    //       <nav className="bg-white border-b px-6 py-3 flex justify-between items-center">
    //         <div className="flex items-center gap-2 font-bold text-blue-900 text-xl">
    //           <div className="bg-blue-800 p-1.5 rounded">
    //             <Building2 className="text-white w-6 h-6" />
    //           </div>
    //           EDUPORTAL
    //         </div>
    //         <div className="flex items-center gap-4">
    //           <div className="text-right text-xs">
    //             <p className="font-bold hidden sm:block">6620035555</p>
    //             <p className="text-gray-400 hidden sm:block">Student</p>
    //           </div>
    //           <button className="flex items-center justify-center gap-2 border rounded-md px-3 py-1.5 text-sm hover:bg-gray-200 transition cursor-pointer">
    //             <LogOut className="w-4 h-4" />
    //             <span className="hidden sm:inline">Log Out</span>
    //           </button>
    //         </div>
    //       </nav>

    //       <main className="max-w-4xl mx-auto p-6 space-y-6">

    //         {/* 2. Profile Card */}
    //         <section className="bg-white rounded-xl shadow-sm border p-8 flex flex-col items-center sm:items-start relative overflow-hidden">
    //           <div className="flex items-baseline gap-3 mb-2">
    //             <h1 className="text-3xl font-bold text-slate-800">Alexander Thompson</h1>
    //             {/* <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
    //               Active Student
    //             </span> */}
    //           </div>
    //           <div className="space-y-1 text-gray-500 text-sm">
    //             <p className="flex items-center gap-2 uppercase tracking-tight">
    //               🏢 ID: 2024-88421
    //             </p>
    //             <p className="flex items-center gap-2">
    //               👤 Computer Science & Engineering
    //             </p>
    //           </div>
    //         </section>

    //         {/* 3. Attendance History Header */}
    //         <div className="flex justify-between items-center pt-4">
    //           <h2 className="text-lg font-bold text-slate-800">Attendance History</h2>
    //           <div className="text-gray-400 text-xs flex items-center gap-2 uppercase">
    //             📅 Current Term 2024
    //           </div>
    //         </div>

    //         {/* 4. Logs List */}
    //         <div className="space-y-6">
    //           {/* Group: Thursday */}
    //           <div>
    //             <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
    //               Thursday, March 14, 2024
    //             </h3>
    //             <div className="space-y-3">
    //               <AttendanceItem
    //                 location="Building A, Room 302"
    //                 status="Successful"
    //                 time="09:00 AM"
    //                 type="ENTRY"
    //                 statusColor="text-emerald-500"
    //               />
    //               <AttendanceItem
    //                 location="Building A, Room 302"
    //                 status="Successful"
    //                 time="11:45 AM"
    //                 type="EXIT"
    //                 statusColor="text-emerald-500"
    //                 isExit
    //               />
    //             </div>
    //           </div>

    //           {/* Group: Wednesday */}
    //           <div>
    //             <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
    //               Wednesday, March 13, 2024
    //             </h3>
    //             <div className="space-y-3">
    //               <AttendanceItem
    //                 location="Innovation Center, Lab 04"
    //                 status="Successful"
    //                 time="01:30 PM"
    //                 type="ENTRY"
    //                 statusColor="text-emerald-500"
    //               />
    //               <AttendanceItem
    //                 location="Innovation Center, Lab 04"
    //                 status="Auto-Logged"
    //                 time="04:30 PM"
    //                 type="EXIT"
    //                 statusColor="text-orange-400"
    //                 isExit
    //               />
    //             </div>
    //           </div>
    //         </div>

    //         {/* 5. Footer Link */}
    //         <div className="text-center pt-6">
    //           <button className="text-blue-600 font-bold text-sm hover:underline">
    //             View All Historical Records
    //           </button>
    //         </div>
    //       </main>

    //       <footer className="text-center py-8 text-gray-400 text-xs">
    //         © 2024 EduPortal Integrated Systems. All rights reserved.
    //       </footer>
    //     </div>
  );
};

// // Sub-component สำหรับรายการการเข้างาน
// const AttendanceItem = ({ location, status, time, type, statusColor, isExit = false }) => (
//   <div className="bg-white border rounded-xl p-4 flex items-center justify-between shadow-sm">
//     <div className="flex items-center gap-4">
//       <div className="bg-blue-50 p-2.5 rounded-lg">
//         {isExit ? <LogOutIcon className="text-blue-300 w-5 h-5" /> : <Building2 className="text-blue-700 w-5 h-5" />}
//       </div>
//       <div>
//         <h4 className="font-bold text-slate-800 text-sm">{location}</h4>
//         <p className="text-[11px]">
//           <span className="text-gray-400">• Check-{isExit ? 'out' : 'in'} Status: </span>
//           <span className={`${statusColor} font-bold`}>{status}</span>
//         </p>
//       </div>
//     </div>
//     <div className="text-right">
//       <div className="text-xl font-bold text-slate-800">{time}</div>
//       <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{type} TIME</div>
//     </div>
//   </div>
// );

export default AttendancePage;
