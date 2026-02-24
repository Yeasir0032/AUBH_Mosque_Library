import React from "react";

const AdminLoading = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-950 transition-colors">
      <div className="relative flex justify-center items-center">
        {/* Outer pulsing ring */}
        <div className="absolute inset-0 w-24 h-24 border-4 border-indigo-200 dark:border-indigo-900/50 rounded-full"></div>
        {/* Inner spinning ring */}
        <div className="w-24 h-24 border-4 border-transparent border-t-indigo-600 dark:border-t-indigo-500 border-r-indigo-600 dark:border-r-indigo-500 rounded-full animate-spin"></div>
        {/* Center icon */}
        <div className="absolute flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
        </div>
      </div>
      <p className="mt-6 text-sm font-medium text-gray-500 dark:text-zinc-400 animate-pulse">Loading Admin Data...</p>
    </div>
  );
};

export default AdminLoading;
