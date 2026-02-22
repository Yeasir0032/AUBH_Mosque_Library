import { db } from "@/utils/firebase/admin";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const userToken = cookieStore.get("authToken")?.value;
  
  if (!userToken) {
    redirect("/login");
  }

  const user = JSON.parse(userToken);
  if (user.role !== "admin") {
    redirect("/");
  }

  // Fetch basic overview stats using Firebase Admin SDK count aggregations
  const booksCountSnapshot = await db.collection("Books").count().get();
  const booksCount = booksCountSnapshot.data().count;

  const borrowedCountSnapshot = await db.collection("BorrowedBooks").where("returned", "==", false).count().get();
  const borrowedCount = borrowedCountSnapshot.data().count;

  const usersCountSnapshot = await db.collection("Users").count().get();
  const usersCount = usersCountSnapshot.data().count;


  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-zinc-100 mb-2">Admin Dashboard</h1>
        <p className="text-gray-500 dark:text-zinc-400">Welcome back, {user.name}. Here's an overview of the library system.</p>
      </header>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Books Metric */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 p-3 rounded-xl transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
          </div>
          <h3 className="text-gray-500 dark:text-zinc-400 text-sm font-medium transition-colors">Total Books</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1 transition-colors">{booksCount || 0}</p>
        </div>

        {/* Borrowed Metric */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400 p-3 rounded-xl transition-colors">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
          <h3 className="text-gray-500 dark:text-zinc-400 text-sm font-medium transition-colors">Active Borrows</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1 transition-colors">{borrowedCount || 0}</p>
        </div>

        {/* Users Metric */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400 p-3 rounded-xl transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
          </div>
          <h3 className="text-gray-500 dark:text-zinc-400 text-sm font-medium transition-colors">Registered Users</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1 transition-colors">{usersCount || 0}</p>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-gray-900 dark:text-zinc-100 mb-4">Quick Actions</h2>
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <a href="/admin/issue" className="flex items-center justify-center gap-2 p-4 bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all font-medium text-gray-700 dark:text-zinc-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Issue Book
            </a>
            <a href="/admin/notices" className="flex items-center justify-center gap-2 p-4 bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all font-medium text-gray-700 dark:text-zinc-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
               Broadcast Notice
            </a>
         </div>
      </div>
    </div>
  );
}
