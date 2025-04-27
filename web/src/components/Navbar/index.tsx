/* eslint-disable @next/next/no-html-link-for-pages */
"use client";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { Book, Home, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/app/actions/auth";
import { useAuthContext } from "../providers/auth-provider";

export default function Navbar() {
  const pathname = usePathname();

  const { isLoggedIn } = useAuthContext();

  const routes = [
    {
      href: "/",
      label: "Home",
      icon: Home,
      active: pathname === "/",
    },
    {
      href: "/books",
      label: "Books",
      icon: Book,
      active: pathname === "/books",
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <a href="/" className="flex items-center gap-2 mx-4">
          <Book className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Trackr</span>
        </a>
        <nav className="ml-auto flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <div className="hidden md:flex items-center gap-6">
                {routes.map((route) => (
                  <a
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      route.active ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {route.label}
                  </a>
                ))}
              </div>
              <div className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <User className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {routes.map((route) => (
                      <DropdownMenuItem key={route.href} asChild>
                        <a
                          href={route.href}
                          className="flex items-center gap-2"
                        >
                          <route.icon className="h-4 w-4" />
                          {route.label}
                        </a>
                      </DropdownMenuItem>
                    ))}
                    <form action={logout} className="w-full">
                      <DropdownMenuItem className="text-red-500">
                        <Button
                          type="submit"
                          className="flex items-center w-full"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </DropdownMenuItem>
                    </form>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <form action={logout} className="hidden md:block">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden md:flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </form>
            </>
          ) : (
            <Button asChild variant="default">
              <a href="/auth">Login</a>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
