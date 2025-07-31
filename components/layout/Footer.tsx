import { APP_CONFIG } from "@/lib/constants";

export const Footer = () => {
  return (
    <div className="text-center mt-8">
      <p className="text-xs text-blue-600">{APP_CONFIG.copyright}</p>
    </div>
  );
};
