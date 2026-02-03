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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6">
      
      {/* Card Container (Frame)
         - เอา overflow-y-auto ออก
         - ใส่ overflow-hidden แทน (เพื่อให้ content ไม่ล้นมุมโค้ง)
         - เอา p-8 ออก (ย้ายไปข้างใน)
         - เพิ่ม flex flex-col เพื่อจัดการ layout
      */}
      <div className="relative w-full max-w-[440px] max-h-[90vh] bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Close Button: ปล่อยไว้ที่เดิม (Absolute) แต่อยู่ในกรอบนอก มันจะไม่เลื่อนตามเนื้อหา (Fixed position) */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-gray-500 z-20"
        >
          <X size={24} />
        </button>

        {/* Scrollable Content Wrapper 
           - ย้าย overflow-y-auto มาไว้ตรงนี้
           - ย้าย p-8 มาไว้ตรงนี้
           - ใช้ w-full h-full เพื่อให้ขยายเต็มกรอบ
           - เพิ่ม custom css หรือ class เพื่อซ่อน scrollbar หากต้องการ
        */}
        <div className="w-full h-full overflow-y-auto p-8 scrollbar-hide">
          
          <div className="flex flex-col items-center">
            {/* Header Section: Illustration */}
            <div className="relative mb-6 mt-2 shrink-0">
              <div className="w-36 h-36 bg-orange-50 rounded-full flex items-center justify-center relative">
                <span className="text-7xl">🎉</span>
                <div className="absolute top-0 right-0 text-orange-500 animate-pulse">
                  <Sparkles size={28} fill="currentColor" />
                </div>
                <div className="absolute bottom-1 left-1 bg-orange-600 rounded-full p-1.5 border-[5px] border-white shadow-sm">
                  <div className="w-5 h-5 text-white flex items-center justify-center font-bold text-sm">😊</div>
                </div>
              </div>
            </div>

            {/* Title & Description */}
            <h1 className="text-4xl font-black text-black mb-3 text-center">Great Job !</h1>
            <p className="text-gray-500 text-lg mb-8 text-center px-4">Your check-out is complete.</p>

            {/* QR Code Section */}
            <div className="w-full bg-orange-50/80 rounded-[2rem] p-6 mb-6 flex flex-col items-center border border-orange-100">
              <QrCode size={80} className="text-orange-900 mb-4 opacity-80" strokeWidth={1.5} />
              <p className="text-orange-900 text-center text-base font-medium leading-tight">
                Please scan the QR code again to<br />start a new session.
              </p>
            </div>

            {/* Session Summary Card */}
            <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-6">
              <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4 ml-1">Session Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                  <span className="text-gray-500 font-medium">User</span>
                  <span className="text-black font-bold text-right truncate ml-2">Mr. Shadow Milk</span>
                </div>

                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                  <span className="text-gray-500 font-medium">Room</span>
                  <span className="text-black font-bold">{room}</span>
                </div>

                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                  <span className="text-green-600 font-bold">Check-in</span>
                  <span className="text-black font-bold font-mono">{checkInTime}</span>
                </div>

                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                  <span className="text-red-500 font-bold">Check-out</span>
                  <span className="text-black font-bold font-mono">{checkOutTime}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;