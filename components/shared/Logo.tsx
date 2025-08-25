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
          src="/STI.jpg"
          alt={`${APP_CONFIG.shortName} logo`}
          width={size === "small" ? 44 : 64}
          height={size === "small" ? 44 : 64}
        />
      </div>
    </div>
  );
}
