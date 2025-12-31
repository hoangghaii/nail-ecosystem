import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";

const navigation = [
  { href: "/", name: "Trang Chủ" },
  { href: "/services", name: "Dịch Vụ" },
  { href: "/gallery", name: "Thư Viện" },
  { href: "/booking", name: "Đặt Lịch" },
  { href: "/contact", name: "Liên Hệ" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="font-serif text-2xl font-bold text-foreground transition-opacity hover:opacity-80"
          >
            Pink..
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden gap-8 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`font-sans text-base font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Link to="/booking">
              <Button size="sm">Đặt Lịch</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="rounded-[12px] border border-border p-2 text-muted-foreground transition-colors hover:text-foreground hover:border-foreground md:hidden focus-ring"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="space-y-1 px-4 pb-4 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block rounded-[12px] px-4 py-3 font-sans text-base font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/booking"
              className="block mt-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button className="w-full">Đặt Lịch Hẹn</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
