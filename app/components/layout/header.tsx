"use client";

import { MainNav } from "./main-nav";
import { Button } from "@/components/ui/button";
import { PlusIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

interface HeaderProps {
  onAddTodo: () => void;
}

export function Header({ onAddTodo }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // useEffect only runs on the client, so now we can safely show the UI
  // avoiding hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <h1 className="text-xl font-bold">Ultimate ToDo</h1>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <MainNav />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={toggleTheme}
            >
              {mounted && theme === "dark" ? (
                <SunIcon className="h-4 w-4" />
              ) : (
                <MoonIcon className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button onClick={onAddTodo} size="sm" className="gap-1">
              <PlusIcon className="h-4 w-4" />
              <span className="hidden sm:inline-block">New Task</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
