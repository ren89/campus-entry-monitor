import { Button } from "@/components/ui/button";
import { APP_CONFIG } from "@/lib/constants";
import Image from "next/image";
interface HeaderProps {
  variant?: "home" | "admin";
  onButtonClick?: () => void;
  showRfidStatus?: boolean;
}

export const Header = ({
  variant = "home",
  onButtonClick,
  showRfidStatus = true,
}: HeaderProps) => {
  const isAdmin = variant === "admin";

  return (
    <div className="bg-white shadow-sm border-b border-blue-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className= "w-8 h-8 rounded-full overflow-hidden mr-3">
              <Image
                 src="/STI.jpg"
                 alt="STI Logo"
                 width={32}
                 height={32}
                 className="object-cover w-full h-full"
                unoptimized
              />
            </div>
            <h1 className="text-xl font-bold text-blue-900">
              {APP_CONFIG.name}
            </h1>
            {showRfidStatus && !isAdmin && (
              <div className="ml-4 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-sm text-green-600 font-medium">
                  RFID Active
                </span>
              </div>
            )}
          </div>
          {onButtonClick && (
            <Button
              onClick={onButtonClick}
              className={`py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500`}
            >
              {isAdmin ? "Logout" : "Login"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
