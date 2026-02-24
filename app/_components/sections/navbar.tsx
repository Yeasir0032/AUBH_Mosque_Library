"use client";
import { useRouter } from "next/navigation";

const UserNavbar = () => {
  const router = useRouter();
  return (
    <nav className="fixed top-0 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800 z-30 px-6 py-3 h-16 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-full">
        <div className="flex items-center">
          <h1
            className="text-xl font-bold text-gray-900 dark:text-zinc-100 cursor-pointer"
            onClick={() => router.push("/")}
          >
            AUBH Mosque
          </h1>
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-4">

          {/* User Button */}
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors text-gray-700 dark:text-zinc-300 font-medium text-sm"
            aria-label="User Dashboard"
            onClick={() => router.push("/dashboard")}
          >
            <span className="hidden sm:block">Dashboard</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;
