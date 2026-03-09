import LogoutButton from '../components/dashboard/LogoutButton'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100 relative p-6">
      
      {/* Logout มุมขวาบน */}
      <div className="absolute top-4 right-4">
        <LogoutButton />
      </div>

      {/* เนื้อหา */}
      <div className="flex items-center justify-center h-full">
        <h1 className="text-3xl font-semibold text-gray-700">
          แสร้งว่า Dashboard
        </h1>
      </div>
    </div>
  )
}
