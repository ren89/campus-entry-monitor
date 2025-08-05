import { APP_CONFIG } from "@/lib/constants";

export default function Logo() {
  return (
    <div className="flex justify-center">
      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
        <span className="text-white font-bold text-xl">
          {APP_CONFIG.shortName}
        </span>
      </div>
    </div>
  );
}
