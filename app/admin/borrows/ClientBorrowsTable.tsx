"use client";

import { useState } from "react";
import { getReturnDate } from "@/utils/utils";

export default function ClientBorrowsTable({ borrowedBooks }: { borrowedBooks: any[] }) {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedBook, setSelectedBook] = useState<any>(null);

  const openUserModal = (user: any) => {
    setSelectedUser(user);
    setSelectedBook(null); // Close book if it's open
  };

  const closeUserModal = () => {
    setSelectedUser(null);
  };

  const openBookModal = (book: any) => {
    setSelectedBook(book);
    setSelectedUser(null); // Close user if it's open
  };

  const closeBookModal = () => {
    setSelectedBook(null);
  };

  return (
    <>
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 dark:text-zinc-400">
            <thead className="bg-gray-50 dark:bg-zinc-800/50 text-gray-900 dark:text-zinc-300 font-semibold border-b border-gray-100 dark:border-zinc-800 transition-colors">
              <tr>
                <th scope="col" className="px-6 py-4">Book Details</th>
                <th scope="col" className="px-6 py-4">Student Info</th>
                <th scope="col" className="px-6 py-4">Borrow Date</th>
                <th scope="col" className="px-6 py-4">Return By</th>
                <th scope="col" className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 transition-colors">
              {borrowedBooks?.map((borrow: any) => {
                const bookInfo = Array.isArray(borrow.Books) ? borrow.Books[0] : borrow.Books;
                const userInfo = Array.isArray(borrow.Users) ? borrow.Users[0] : borrow.Users;
                const returnDateStr = borrow.borrowed_at ? getReturnDate(borrow.borrowed_at) : 'N/A';
                
                // Note: Simple check to see if overdue (comparing return date object with now)
                const isOverdue = borrow.borrowed_at ? new Date(new Date(borrow.borrowed_at).getTime() + 14 * 24 * 60 * 60 * 1000) < new Date() : false;

                return (
                  <tr key={borrow.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                     <td className="px-6 py-4">
                      <button 
                        onClick={() => openBookModal(bookInfo)}
                        className="font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors text-left mb-1"
                      >
                        {bookInfo?.title || 'Unknown Book'}
                      </button>
                      <div className="text-xs font-mono text-gray-500 hidden sm:block">ID: {borrow.book_id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => openUserModal(userInfo)}
                        className="font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors text-left"
                      >
                        {userInfo?.name || 'Unknown User'}
                      </button>
                      <div className="flex flex-col text-xs space-y-1 mt-1 text-gray-500 dark:text-zinc-400">
                        <span>✉️ {userInfo?.email || 'No email'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap suppressHydrationWarning">
                      {borrow.borrowed_at ? new Date(borrow.borrowed_at).toLocaleDateString('en-GB') : 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${isOverdue ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800/30' : 'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300'} transition-colors`}>
                        {returnDateStr}
                      </span>
                      {isOverdue && <div className="text-xs text-rose-500 font-semibold mt-1 flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Overdue</div>}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm transition-colors py-1 px-3 border border-blue-200 dark:border-blue-900/50 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 mr-2">
                         Notify
                       </button>
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

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 dark:bg-zinc-950/80 backdrop-blur-sm transition-opacity">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all border border-gray-100 dark:border-zinc-800">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50 dark:bg-zinc-800/50">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">Student Details</h3>
              <button onClick={closeUserModal} className="text-gray-400 hover:text-gray-500 dark:hover:text-zinc-300 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium">Full Name</p>
                <p className="text-base text-gray-900 dark:text-zinc-100 font-semibold">{selectedUser.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium">Email Address</p>
                <p className="text-base text-gray-900 dark:text-zinc-100">{selectedUser.email || 'N/A'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium">Phone / Mobile</p>
                    <p className="text-base text-gray-900 dark:text-zinc-100">{selectedUser.mobile || selectedUser.phoneNumber || 'N/A'}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium">Role</p>
                    <p className="text-base text-gray-900 dark:text-zinc-100 capitalize">{selectedUser.role || 'Student'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium">Department</p>
                    <p className="text-base text-gray-900 dark:text-zinc-100">{selectedUser.department || 'N/A'}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium">Room</p>
                    <p className="text-base text-gray-900 dark:text-zinc-100">{selectedUser.room_number || 'N/A'}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium">Account Created</p>
                <p className="text-base text-gray-900 dark:text-zinc-100 suppressHydrationWarning">{selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleString('en-GB') : 'N/A'}</p>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-zinc-800/50 border-t border-gray-100 dark:border-zinc-800 flex justify-end transition-colors">
              <button 
                onClick={closeUserModal}
                className="px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Book Details Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 dark:bg-zinc-950/80 backdrop-blur-sm transition-opacity">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all border border-gray-100 dark:border-zinc-800">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50 dark:bg-zinc-800/50 transition-colors">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-100 transition-colors">Book Details</h3>
              <button onClick={closeBookModal} className="text-gray-400 hover:text-gray-500 dark:hover:text-zinc-300 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium transition-colors">Title</p>
                <p className="text-base text-gray-900 dark:text-zinc-100 font-semibold transition-colors">{selectedBook.title || 'N/A'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium transition-colors">Author(s)</p>
                   <p className="text-base text-gray-900 dark:text-zinc-100 transition-colors">{Array.isArray(selectedBook.authors) ? selectedBook.authors.join(', ') : (selectedBook.authors || 'N/A')}</p>
                </div>
                <div>
                   <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium transition-colors">Category</p>
                   <p className="text-base text-gray-900 dark:text-zinc-100 transition-colors">{selectedBook.category || 'N/A'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium transition-colors">Quantity Owned</p>
                  <p className="text-base text-gray-900 dark:text-zinc-100 transition-colors">{selectedBook.qty !== undefined ? selectedBook.qty : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium transition-colors">Location Array</p>
                  <p className="text-base text-gray-900 dark:text-zinc-100 transition-colors">{selectedBook.location || 'N/A'}</p>
                </div>
              </div>
               <div>
                <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium transition-colors">Description / Subtitle</p>
                <p className="text-sm text-gray-700 dark:text-zinc-300 transition-colors line-clamp-3">{selectedBook.subtitle || selectedBook.description || 'No description available for this book.'}</p>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-zinc-800/50 border-t border-gray-100 dark:border-zinc-800 flex justify-end transition-colors">
              <button 
                onClick={closeBookModal}
                className="px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
