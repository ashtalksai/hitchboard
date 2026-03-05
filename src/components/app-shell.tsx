"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  CheckSquare,
  Users,
  Clock,
  LogOut,
  Menu,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
];

function weddingNav(weddingId: string) {
  return [
    { href: `/wedding/${weddingId}/timeline`, label: "Timeline", icon: Clock },
    { href: `/wedding/${weddingId}/tasks`, label: "Tasks", icon: CheckSquare },
    { href: `/wedding/${weddingId}/vendors`, label: "Vendors", icon: Users },
    { href: `/wedding/${weddingId}/guests`, label: "Guest Page", icon: Calendar },
  ];
}

export function AppShell({ children, weddingId }: { children: React.ReactNode; weddingId?: string }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.push("/auth/login");
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sage border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  const allNav = [...navItems, ...(weddingId ? weddingNav(weddingId) : [])];

  return (
    <div className="min-h-screen bg-cream">
      {/* Mobile header */}
      <header className="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur-sm lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/dashboard" className="font-heading text-xl font-bold text-sage-dark">
            Hitchboard
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <nav className="mt-8 flex flex-col gap-1">
                {allNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      pathname === item.href
                        ? "bg-sage text-white"
                        : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={() => { logout(); router.push("/"); }}
                  className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-secondary"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-border bg-white">
          <div className="flex h-14 items-center px-6 border-b border-border">
            <Link href="/dashboard" className="font-heading text-xl font-bold text-sage-dark">
              Hitchboard
            </Link>
          </div>
          <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
            {allNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  pathname === item.href
                    ? "bg-sage text-white"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-border p-3">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sage text-sm font-medium text-white">
                {user.name?.[0] || user.email[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{user.name || user.email}</p>
              </div>
              <button onClick={() => { logout(); router.push("/"); }}>
                <LogOut className="h-4 w-4 text-muted-foreground hover:text-destructive" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:ml-64">
          <div className="p-4 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
