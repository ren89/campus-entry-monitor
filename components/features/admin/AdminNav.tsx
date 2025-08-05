import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export type NavItem = {
  label: string;
  screen: string;
};

function NavItems({
  onItemClick,
  navItems,
  activeScreen,
  onScreenChange,
}: {
  onItemClick?: () => void;
  navItems: NavItem[];
  activeScreen: string;
  onScreenChange: (screen: string) => void;
}) {
  return (
    <ul className="flex-1 py-4 space-y-1">
      {navItems.map((item) => (
        <li key={item.label} className="px-3">
          <button
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg",
              "transition-colors duration-150 text-sm font-medium",
              "focus:outline-none focus:ring-2 focus:ring-sidebar-ring focus:ring-offset-2 focus:ring-offset-sidebar",
              activeScreen === item.screen
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
            onClick={() => {
              onScreenChange(item.screen);
              onItemClick?.();
            }}
          >
            <span className="truncate">{item.label}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export default function AdminNav({
  navItems,
  activeScreen,
  onScreenChange,
}: {
  navItems: NavItem[];
  activeScreen: string;
  onScreenChange: (screen: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push(ROUTES.HOME);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Drawer direction="left" open={menuOpen} onOpenChange={setMenuOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm border-border shadow-sm"
        >
          <span className="sr-only">Toggle menu</span>☰
        </Button>
      </DrawerTrigger>

      <DrawerContent
        className={cn(
          "h-full fixed left-0 top-0 bg-sidebar border-r border-sidebar-border",
          "w-80 sm:w-80 lg:w-80"
        )}
      >
        <DrawerHeader className="border-b border-sidebar-border bg-sidebar">
          <DrawerTitle className="text-sidebar-foreground text-lg font-semibold">
            Admin Panel
          </DrawerTitle>
          <DrawerDescription className="text-sidebar-foreground/60">
            Manage your campus entry monitoring system
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col h-full bg-sidebar">
          <NavItems
            onItemClick={() => setMenuOpen(false)}
            navItems={navItems}
            activeScreen={activeScreen}
            onScreenChange={onScreenChange}
          />

          <div className="p-4 border-t border-sidebar-border mt-auto space-y-3">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start text-sidebar-foreground hover:bg-red-500/10 hover:text-red-600 transition-colors"
            >
              Logout
            </Button>

            <p className="text-xs text-sidebar-foreground/60 text-center">
              STI Campus Monitor
            </p>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
