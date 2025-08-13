import Image from "next/image";
import { APP_CONFIG } from "@/lib/constants";

export default function Logo(
  { size }: { size?: "small" | "large" } = { size: "small" }
) {
  const logoSize = size === "small" ? 12 : 64;
  return (
    <div className="flex justify-center">
      <div
        className={`w-${logoSize} h-${logoSize} bg-blue-600 rounded-full flex items-center justify-center overflow-hidden`}
      >
        <Image
          src="/STI.jpg" // Image should be in the /public folder
          alt={`${APP_CONFIG.shortName} logo`}
          width={64} // match w-16 (16 * 4px = 64px)
          height={64} // match h-16
        />
      </div>
    </div>
  );
}
