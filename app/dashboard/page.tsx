import { createClient } from "@/utils/supabase/client";
import { Database, Tables } from "@/utils/supabase/supabase-types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardBorrowedBookSection from "../_components/sections/dashboard-borrowed-book";
import LogoutButton from "../_components/ui/LogoutButton";

const UserDashboard = async () => {
  const fetchUserData = async () => {
    const cookieStore = await cookies();

    const userToken = cookieStore.get("authToken")?.value;
    if (!userToken) {
      redirect("/login");
    } else {
      const userData: Database["public"]["Tables"]["Users"]["Row"] =
        JSON.parse(userToken);
      return userData;
    }
  };
  const user = await fetchUserData();
  if (!user) {
    return <div>Login...</div>;
  }

  const fetchBorrowedBooks = async (user_id: number) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("BorrowedBooks")
      .select("borrowed_at,Books(*)")
      .eq("user_id", user_id)
      .eq("returned", false)
      .single();
    if (error) return null;
    return data;
  };
  const fetchNotifications = async (user_id: number) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("Notifications")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });
    if (error) return null;
    return data;
  };
  
  const booksBorrowed = await fetchBorrowedBooks(user.id);
  const notifications = await fetchNotifications(user.id);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900 pb-12 pt-24 px-4 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
              Welcome back, <span className="text-blue-600 dark:text-blue-400">{user.name}</span>
            </h1>
            <p className="text-gray-500 dark:text-zinc-400 mt-2 text-lg">
              Manage your library account and currently borrowed books here.
            </p>
          </div>
          <div className="shrink-0">
            <LogoutButton variant="icon" className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-sm" />
          </div>
        </div>

        {booksBorrowed && booksBorrowed.Books ? (
          <DashboardBorrowedBookSection
            books={Array.isArray(booksBorrowed.Books) ? booksBorrowed.Books[0] : booksBorrowed.Books}
            borrowedDate={booksBorrowed.borrowed_at}
          />
        ) : (
          <div className="bg-white dark:bg-zinc-800 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-700/50 p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-zinc-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No active borrows</h2>
            <p className="text-gray-500 dark:text-zinc-400 mb-6 max-w-md mx-auto">
              You haven't borrowed any books at the moment. Explore the library to find something new to read!
            </p>
            <a href="/" className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-all">
              Go to Library
            </a>
          </div>
        )}

        {/* Notifications Section */}
        {notifications && notifications.length > 0 && (
          <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
            <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              Recent Notifications
            </h2>
            {notifications.map((note: any) => (
              <div key={note.id} className="bg-white dark:bg-zinc-800 rounded-2xl p-5 border border-emerald-100 dark:border-emerald-900/30 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                <div className="flex justify-between items-start mb-1 gap-4">
                  <h3 className="font-bold text-gray-900 dark:text-zinc-100">{note.title}</h3>
                  <span className="text-xs text-gray-500 dark:text-zinc-400 whitespace-nowrap">
                    {new Date(note.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-zinc-300 leading-relaxed">{note.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
