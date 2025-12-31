import {
  Calendar,
  Image,
  Images,
  LayoutDashboard,
  MessageSquare,
  Scissors,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/" },
  { icon: Image, label: "Banners", to: "/banners" },
  { icon: Scissors, label: "Services", to: "/services" },
  { icon: Images, label: "Gallery", to: "/gallery" },
  { icon: Calendar, label: "Bookings", to: "/bookings" },
  { icon: MessageSquare, label: "Contacts", to: "/contacts" },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card">
      <div className="flex h-16 items-center border-b border-border px-6">
        <h1 className="text-2xl font-bold text-primary">Pink Nail Admin</h1>
      </div>

      <nav className="space-y-1 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
