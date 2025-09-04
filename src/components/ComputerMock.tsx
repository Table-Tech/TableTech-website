export default function ComputerMock() {
  return (
    <div className="relative w-[1200px] h-[768px] rounded-t-2xl overflow-hidden shadow-2xl border-4 border-black bg-white flex flex-col font-sans">
      <div className="w-full h-full bg-black rounded-t-2xl p-2">
        <div className="w-full h-full bg-gray-50 rounded-xl overflow-hidden flex flex-col relative">
          {/* Browser bar */}
          <div className="bg-white border-b flex items-center justify-between px-4 py-2 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex-1 mx-6">
              <div className="bg-gray-50 rounded-lg px-4 py-2 text-sm text-gray-600 flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                tabletech.app/dashboard
              </div>
            </div>
          </div>

          {/* Dashboard image */}
          <div className="flex-1 overflow-hidden bg-gray-100">
            <img 
              src="/images/backgrounds/preview (17).jpg" 
              alt="TableTech Dashboard" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* Laptop bottom */}
      <div className="w-[1600px] h-5 bg-gray-400 rounded-b-2xl -mt-1 shadow-lg mx-auto"></div>
      <div className="w-[1700px] h-3 bg-gray-500 rounded-full -mt-1 shadow-xl mx-auto"></div>
    </div>
  );
}