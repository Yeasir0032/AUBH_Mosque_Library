"use client";

import { useModalData } from "@/lib/hooks/useModalData";

interface Book {
  id: string;
  title: string;
  author: string;
  available: boolean;
  description?: string;
}

export default function BookBorrowButton({ book }: { book: Book }) {
  const { setConfirmBorrowModal } = useModalData();

  if (!book.available) {
    return (
      <p className="text-sm border border-rose-200 bg-rose-50 p-4 rounded-xl text-rose-500 dark:text-rose-400 dark:bg-rose-900/10 dark:border-rose-800/30 font-medium">
        This book is currently unavailable as it has been checked out by another user.
      </p>
    );
  }

  return (
    <button
      onClick={() => setConfirmBorrowModal(book)}
      className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-xl hover:shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
    >
      <svg className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
      Borrow Now
    </button>
  );
}
