"use client";
import { useModalData } from "@/lib/hooks/useModalData";
import React from "react";
import ReturnConfirmationModal from "../modals/return-confirmation-modal";
import LoadingOverlay from "./loading";
import { getReturnDate } from "@/utils/utils";

interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  available: boolean;
}

interface props {
  books: Book;
  borrowedDate: string;
}

const DashboardBorrowedBookSection = ({ books, borrowedDate }: props) => {
  const {
    toastMessage,
    setReturnConfirmModal,
    loading: UILoading,
  } = useModalData();

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-700/50 p-6 md:p-8 relative">
      <ReturnConfirmationModal />
      {UILoading && <LoadingOverlay />}
      {toastMessage.message && (
        <div
          className={`fixed bottom-4 right-4 ${
            toastMessage.type == "Error"
              ? "bg-red-500"
              : toastMessage.type == "Success"
              ? "bg-green-500"
              : "bg-amber-500"
          } py-3 px-6 rounded-lg shadow-xl z-[100] text-white font-medium animate-in slide-in-from-bottom-5`}
        >
          {toastMessage.message}
        </div>
      )}
      
      <div className="flex items-center justify-between mb-6 border-b border-gray-100 dark:border-zinc-700/50 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          Currently Borrowed
        </h2>
        <span className="px-3 py-1 rounded-full text-xs font-semibold shadow-sm bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
          1 Book
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Book Icon placeholder */}
        <div className="w-full md:w-32 aspect-[3/4] shrink-0 bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-zinc-700 dark:to-zinc-800 rounded-xl flex items-center justify-center border border-indigo-100 dark:border-zinc-700 overflow-hidden shadow-inner">
           <svg className="w-12 h-12 text-indigo-300 dark:text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
        </div>

        {/* Book Info */}
        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
            <div>
              <span className="text-xs font-mono text-gray-500 dark:text-zinc-400 mb-2 block">
                ID: {books.id}
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-tight mb-1">
                {books.title}
              </h3>
              <p className="text-gray-500 dark:text-zinc-400 font-medium">
                {books.author}
              </p>
            </div>
            
            <button
              onClick={() => setReturnConfirmModal(books)}
              className="w-full sm:w-auto px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 group shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
              Return Book
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-xl p-4 border border-gray-100 dark:border-zinc-700/50">
              <div className="text-sm text-gray-500 dark:text-zinc-400 mb-1">Borrowed Date</div>
              <div className="font-semibold text-gray-900 dark:text-zinc-200">{new Date(borrowedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-100 dark:border-blue-800/20">
              <div className="text-sm text-blue-600/70 dark:text-blue-400/70 mb-1 flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Return By
              </div>
              <div className="font-bold text-blue-700 dark:text-blue-300">{getReturnDate(borrowedDate)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardBorrowedBookSection;
