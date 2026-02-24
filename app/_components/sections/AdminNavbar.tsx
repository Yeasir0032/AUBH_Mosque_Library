"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserCircleIcon } from "@heroicons/react/24/outline";

const AdminNavbar = () => {
  const router = useRouter();
  
  return (
    <nav className="fixed top-0 w-full bg-slate-900 border-b border-slate-800 z-30 px-4 py-3 h-16 flex items-center justify-between transition-colors">
      <div className="flex items-center pl-10 md:pl-0">
         {/* Title area (mobile padding leaves room for hamburger) */}
        <h1
          className="text-xl font-bold text-white cursor-pointer"
          onClick={() => router.push("/admin")}
        >
          AU Library Admin
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <Link 
          href="/admin/settings"
          className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-800"
        >
          <span className="text-sm font-medium hidden sm:block">Admin Profile</span>
          <UserCircleIcon className="w-6 h-6" />
        </Link>
      </div>
    </nav>
  );
};

export default AdminNavbar;
