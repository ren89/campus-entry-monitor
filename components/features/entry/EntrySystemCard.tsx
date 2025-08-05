export const EntrySystemCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-auto">
      <div className="mb-6">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-10 h-10 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {/* TODO: use Icon */}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Campus Entry System
        </h2>
        <p className="text-gray-600">Tap your RFID card to register entry</p>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-600 font-medium">
            RFID Scanner Active
          </span>
        </div>
      </div>
    </div>
  );
};
