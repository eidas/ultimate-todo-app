"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ListTodo, Tag, BarChart, CheckSquare, Settings } from "lucide-react";

export function MainNav() {
  const pathname = usePathname();

  const navItems = [
    {
      title: "Todo List",
      href: "/",
      icon: <ListTodo className="h-5 w-5" />,
    },
    {
      title: "Categories",
      href: "/categories",
      icon: <Tag className="h-5 w-5" />,
    },
    {
      title: "Statistics",
      href: "/statistics",
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      title: "Completed",
      href: "/completed",
      icon: <CheckSquare className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <nav className="flex space-x-4 lg:space-x-6">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-foreground",
            pathname === item.href
              ? "text-foreground"
              : "text-muted-foreground"
          )}
        >
          {item.icon}
          <span className="hidden md:inline-block">{item.title}</span>
        </Link>
      ))}
    </nav>
  );
}
