export default function HistoryPage() {
  // mock user
  const user = {
    name: "Mr. Shadow Milk",
    studentId: "66200888",
    profileImage: "https://via.placeholder.com/150",
  };

  // mock history
  const history = [
    {
      date: "28 January 2569",
      room: "B218",
      type: "check-in",
      time: "17:02",
    },
    {
      date: "27 January 2569",
      room: "E107",
      type: "check-out",
      time: "16:12",
    },
    {
      date: "27 January 2569",
      room: "B107",
      type: "check-in",
      time: "13:31",
    },
  ];

  let lastDate = "";

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6 space-y-4">
      
      {/* Profile block */}
      <div className="bg-orange-400 rounded-xl p-4 flex items-center gap-4">
        <img
          src={user.profileImage}
          alt="profile"
          className="w-14 h-14 rounded-full object-cover"
        />
        <div className="text-white">
          <p className="font-semibold">{user.name}</p>
          <p className="text-sm opacity-90">
            Student ID: {user.studentId}
          </p>
        </div>
      </div>

      {/* History list */}
      <div className="bg-white rounded-xl p-4 space-y-3 shadow-sm">
        {history.map((item, index) => {
          const showDate = item.date !== lastDate;
          lastDate = item.date;

          return (
            <div key={index}>
              {showDate && (
                <p className="text-xs text-gray-400 mb-1">
                  {item.date}
                </p>
              )}

              <div className="flex justify-between items-center bg-gray-100 rounded-lg px-3 py-2 mb-2">
                <span className="font-medium text-black">{item.room}</span>

                <span
                  className={`text-sm font-semibold ${
                    item.type === "check-in"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {item.type === "check-in" ? "Check-in" : "Check-out"}
                </span>

                <span className="text-sm text-gray-600">
                  {item.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
