"use client";

import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ROUTES } from "@/lib/constants";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const isLoginPage = pathname === ROUTES.LOGIN;
  const isAdminPage = pathname === ROUTES.ADMIN;
  const shouldShow = !isLoginPage;

  const handleLoginButton = async () => {
    router.push(ROUTES.LOGIN);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
      {shouldShow && (
        <Header
          variant={isAdminPage ? "admin" : "home"}
          onButtonClick={isAdminPage ? undefined : handleLoginButton}
          showRfidStatus={!isAdminPage}
        />
      )}
      <div className={`flex-1 ${shouldShow ? "" : "min-h-screen"}`}>
        {children}
      </div>
      {shouldShow && <Footer />}
    </div>
  );
};
