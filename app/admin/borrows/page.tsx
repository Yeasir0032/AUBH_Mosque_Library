import { createClient } from "@/utils/supabase/client";
import { getReturnDate } from "@/utils/utils";

export default async function AdminBorrowsPage() {
  const supabase = await createClient();

  // Fetch all currently borrowed books
  // We use the same relation mapping: borrowed_at, Users(name, mobile, room_number), Books(title, id)
  const { data: borrowedBooks, error } = await supabase
    .from("BorrowedBooks")
    .select("id, borrowed_at, user_id, book_id, Users(name, mobile, room_number), Books(title)")
    .eq("returned", false)
    .order("borrowed_at", { ascending: false });

  if (error) {
    console.log(error)
    return (
      <div className="p-8 text-center bg-red-50 text-red-600 rounded-2xl border border-red-100">
        Failed to load active borrows. Please check database permissions.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in py-4">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-zinc-100 mb-2">Active Borrows</h1>
          <p className="text-gray-500 dark:text-zinc-400">Monitor all books currently checked out by students.</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-xl font-medium text-sm border border-blue-100 dark:border-blue-800/30">
          {borrowedBooks?.length || 0} Total Active
        </div>
      </header>

      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 dark:text-zinc-400">
            <thead className="bg-gray-50 dark:bg-zinc-800/50 text-gray-900 dark:text-zinc-300 font-semibold border-b border-gray-100 dark:border-zinc-800">
              <tr>
                <th scope="col" className="px-6 py-4">Book Details</th>
                <th scope="col" className="px-6 py-4">Student Info</th>
                <th scope="col" className="px-6 py-4">Borrow Date</th>
                <th scope="col" className="px-6 py-4">Return By</th>
                <th scope="col" className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
              {borrowedBooks?.map((borrow: any) => {
                const bookInfo = Array.isArray(borrow.Books) ? borrow.Books[0] : borrow.Books;
                const userInfo = Array.isArray(borrow.Users) ? borrow.Users[0] : borrow.Users;
                const returnDateStr = borrow.borrowed_at ? getReturnDate(borrow.borrowed_at) : 'N/A';
                
                // Note: Simple check to see if overdue (comparing return date object with now)
                const isOverdue = borrow.borrowed_at ? new Date(new Date(borrow.borrowed_at).getTime() + 14 * 24 * 60 * 60 * 1000) < new Date() : false;

                return (
                  <tr key={borrow.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-zinc-100 mb-1">{bookInfo?.title || 'Unknown Book'}</div>
                      <div className="text-xs font-mono text-gray-500">ID: {borrow.book_id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-zinc-100 mb-1">{userInfo?.name || 'Unknown User'}</div>
                      <div className="flex flex-col text-xs space-y-1">
                        <span>📱 {userInfo?.mobile || 'No mobile'}</span>
                        {userInfo?.room_number && <span>🏠 Rm {userInfo.room_number}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {borrow.borrowed_at ? new Date(borrow.borrowed_at).toLocaleDateString() : 'Unknown'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${isOverdue ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800/30' : 'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300'}`}>
                        {returnDateStr}
                      </span>
                      {isOverdue && <div className="text-xs text-rose-500 font-semibold mt-1 flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Overdue</div>}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm transition-colors py-1 px-3 border border-blue-200 dark:border-blue-900/50 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 mr-2">
                         Notify
                       </button>
                       {/* Note: Full manual force return API will be connected here if desired in the future */}
                    </td>
                  </tr>
                );
              })}
              {(!borrowedBooks || borrowedBooks.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-zinc-400">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 text-gray-300 dark:text-zinc-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
                      <p className="text-lg font-medium text-gray-900 dark:text-zinc-200">All caught up!</p>
                      <p>There are currently no active book borrows in the system.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
