"use client";

import { useState } from "react";
import AdminSidebar from "../_components/sections/AdminSidebar";
import AdminNavbar from "../_components/sections/AdminNavbar";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col pt-16">
      <AdminNavbar />
      
      {/* Mobile hamburger button */}
      <button
        className="md:hidden fixed top-3 left-4 z-40 p-2 text-white hover:bg-slate-800 rounded-md transition-colors"
        onClick={() => setDrawerOpen(true)}
        aria-label="Open admin navigation"
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for desktop */}
      <div className="hidden md:flex flex-col w-64 border-r border-gray-200 dark:border-zinc-800 h-[calc(100vh-64px)] sticky top-16 z-10 shrink-0">
        <AdminSidebar />
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-30 flex">
          <div className="bg-white dark:bg-zinc-900 w-64 h-full shadow-lg overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-zinc-800">
              <span className="font-semibold text-lg">Admin</span>
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close admin navigation"
                className="text-gray-800 dark:text-gray-200"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <AdminSidebar />
          </div>
          {/* Overlay to close drawer when clicking outside */}
          <div
            className="flex-1 bg-black/30 w-full h-full"
            onClick={() => setDrawerOpen(false)}
          />
        </div>
      )}

      <main className="flex-1 w-full p-4 md:p-8 overflow-y-auto min-w-0">
        {children}
      </main>
      </div>
    </div>
  );
}
