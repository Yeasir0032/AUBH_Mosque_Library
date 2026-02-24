"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "../ui/LogoutButton";

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/admin", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { name: "Library Books", href: "/admin/books", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
    { name: "Active Borrows", href: "/admin/borrows", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { name: "Issue Book", href: "/admin/issue", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { name: "Broadcast Notices", href: "/admin/notices", icon: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" },
    { name: "System Logs", href: "/admin/logs", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" },
  ];

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-zinc-900 pt-6 transition-colors overflow-y-auto">
       <div className="px-6 mb-8">
        <h2 className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
          Admin Controls
        </h2>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                isActive
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 font-semibold"
                  : "text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50 hover:text-gray-900 dark:hover:text-zinc-100"
              }`}
            >
              <svg 
                className={`w-5 h-5 mr-3 shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-zinc-500'}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="px-4 mb-2 mt-auto">
        <LogoutButton />
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-zinc-800 m-4 rounded-xl bg-gray-50 dark:bg-zinc-800/30">
        <p className="text-xs text-gray-500 dark:text-zinc-500 leading-relaxed text-center">
          AUBH Library Management System
          <br/>v2.0
        </p>
      </div>
    </div>
  );
}
