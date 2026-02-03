import React from 'react';
import { QrCode, Sparkles, X } from 'lucide-react';

interface CheckoutSuccessProps {
  isOpen: boolean;
  onClose: () => void;
  room: string;
  checkInTime: string;
  checkOutTime: string;
}

const CheckoutSuccess: React.FC<CheckoutSuccessProps> = ({ 
  isOpen, 
  onClose, 
  room, 
  checkInTime, 
  checkOutTime 
}) => {
  // ถ้า isOpen เป็น false ไม่ต้องแสดงผลอะไรเลย
  if (!isOpen) return null;

  return (
    // Overlay: พื้นหลังสีดำโปร่งแสง คลุมทั้งหน้าจอ
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      
      {/* Card Container */}
      <div className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 p-8 flex flex-col items-center animate-in fade-in zoom-in duration-300">
        
        {/* Close Button: ปุ่มปิดมุมขวาบน */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-gray-500"
        >
          <X size={20} />
        </button>

        {/* Header Section: Illustration */}
        <div className="relative mb-6 mt-2">
          <div className="w-32 h-32 bg-orange-50 rounded-full flex items-center justify-center relative">
            {/* Cone Icon */}
            <span className="text-6xl">🎉</span>
            {/* Floating Stars */}
            <div className="absolute -top-2 -right-2 text-orange-500">
               <Sparkles size={24} fill="currentColor" />
            </div>
            {/* Smile Icon */}
            <div className="absolute bottom-0 left-0 bg-orange-600 rounded-full p-1 border-4 border-white">
               <div className="w-4 h-4 text-white flex items-center justify-center font-bold text-xs">😊</div>
            </div>
          </div>
        </div>

        {/* Title & Description */}
        <h1 className="text-3xl font-black text-black mb-2">Great Job !</h1>
        <p className="text-gray-500 text-lg mb-8">Your check-out is complete.</p>

        {/* QR Code Section */}
        <div className="w-full bg-orange-100 rounded-[2rem] p-6 mb-6 flex flex-col items-center border border-orange-200">
          <QrCode size={64} className="text-orange-900 mb-4 opacity-80" strokeWidth={1.5} />
          <p className="text-orange-900 text-center text-sm font-medium leading-tight">
            Please scan the QR code again to<br />start a new session.
          </p>
        </div>

        {/* Session Summary Card */}
        <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Session Summary</h2>
          
          <div className="space-y-3">
            {/* Row: User */}
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl">
              <span className="text-gray-500 font-medium">User</span>
              <span className="text-black font-bold">Mr. Shadow Milk</span>
            </div>

            {/* Row: Room */}
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl">
              <span className="text-gray-500 font-medium">Room</span>
              <span className="text-black font-bold">{room}</span>
            </div>

            {/* Row: Check-in */}
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl">
              <span className="text-green-600 font-bold">Check-in</span>
              <span className="text-black font-bold">{checkInTime}</span>
            </div>

            {/* Row: Check-out */}
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl">
              <span className="text-red-500 font-bold">Check-out</span>
              <span className="text-black font-bold">{checkOutTime}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutSuccess;