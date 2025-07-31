"use client";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface EntryToastProps {
  isVisible: boolean;
  rfidId: string;
  fullName?: string;
  room?: string;
  avatarUrl?: string;
  isError?: boolean;
  errorMessage?: string;
  onClose: () => void;
}

export const EntryToast = ({
  isVisible,
  rfidId,
  fullName = "John Doe",
  room = "A-101",
  avatarUrl,
  isError = false,
  errorMessage,
  onClose,
}: EntryToastProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: -100 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
              type: "spring",
              damping: 20,
              stiffness: 300,
              duration: 0.6,
            },
          }}
          exit={{
            opacity: 0,
            scale: 0.8,
            y: -50,
            transition: {
              duration: 0.3,
              ease: "easeInOut",
            },
          }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div
            className={`bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border relative ${
              isError ? "border-red-200" : "border-green-200"
            }`}
          >
            {/* Success/Error Icon */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{
                  scale: 1,
                  transition: { delay: 0.2, type: "spring", damping: 15 },
                }}
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  isError ? "bg-red-100" : "bg-green-100"
                }`}
              >
                {isError ? (
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.3 },
                }}
                className={`text-2xl font-bold mb-2 ${
                  isError ? "text-red-600" : "text-green-600"
                }`}
              >
                {isError ? "Error!" : "Entry Recorded!"}
              </motion.h2>
            </div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: 0.4 },
              }}
              className="bg-gray-50 rounded-xl p-4"
            >
              {isError ? (
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Failed to process RFID
                  </p>
                  <p className="text-sm text-gray-600 mb-1">ID: {rfidId}</p>
                  {errorMessage && (
                    <p className="text-xs text-red-500">{errorMessage}</p>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  {/* Avatar */}
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="User Avatar"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">👤</span>
                    )}
                  </div>

                  {/* User Details */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {fullName}
                    </h3>
                    <p className="text-lg text-gray-600 mb-1">Room: {room}</p>
                    <p className="text-sm text-gray-500">ID: {rfidId}</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Timestamp */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { delay: 0.5 },
              }}
              className="text-center mt-4"
            >
              <p className="text-sm text-gray-500">
                {new Date().toLocaleString()}
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
