// Application routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  ADMIN: "/admin",
  API: {
    ENTRY_LOGS: "/api/entry-logs",
    AUTH: "/api/auth",
  },
} as const;

// Navigation items
export const NAV_ITEMS = [
  { label: "Home", href: ROUTES.HOME },
  { label: "Admin", href: ROUTES.ADMIN },
] as const;
