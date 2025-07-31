"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-lg shadow-xl p-8 border-t-4 border-blue-600">
          {/* STI Logo placeholder */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">STI</span>
            </div>
          </div>

          <h2 className="text-center text-3xl font-extrabold text-blue-900 mb-2">
            Campus Entry Monitor
          </h2>
          <p className="text-center text-sm text-blue-600 mb-8">
            STI College Security System
          </p>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-center text-sm text-blue-800">
                Please log in to access the campus entry system
              </p>
            </div>
            <Button
              onClick={() => router.push("/login")}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Login to Continue
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-blue-600">
            © 2025 STI College. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
