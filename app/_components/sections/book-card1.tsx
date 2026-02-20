"use client";

import { useModalData } from "@/lib/hooks/useModalData";
import Link from "next/link";

interface props {
  book: Book;
}

const BookCard1 = ({ book }: props) => {
  const { setConfirmBorrowModal } = useModalData();
  
  return (
    <Link 
      href={`/book/${book.id}`}
      className="group bg-white dark:bg-zinc-800 rounded-2xl shadow-sm hover:shadow-xl dark:shadow-none dark:border dark:border-zinc-700 transition-all duration-300 p-5 flex flex-col h-full ring-1 ring-zinc-100 dark:ring-zinc-700 hover:ring-blue-500/50"
    >
      {/* Book Cover / Icon Placeholder */}
      <div className="w-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-700 dark:to-zinc-800 rounded-xl mb-5 flex items-center justify-center aspect-[4/3] group-hover:scale-[1.02] transition-transform duration-300 overflow-hidden relative">
        <svg 
          className="w-16 h-16 text-blue-500/50 dark:text-zinc-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        
        {/* Availability Badge inside the image box */}
        <div className="absolute top-3 right-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm backdrop-blur-md ${book.available ? 'bg-green-500/90 text-white' : 'bg-rose-500/90 text-white'}`}>
            {book.available ? "Available" : "Borrowed"}
          </span>
        </div>
      </div>

      <div className="flex-grow flex flex-col">
        {/* Book Title & Author */}
        <h2 className="text-xl font-bold text-gray-800 dark:text-zinc-100 mb-1 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
          {book.title}
        </h2>
        <p className="text-sm font-medium text-gray-500 dark:text-zinc-400 mb-4 line-clamp-1">
          {book.author}
        </p>

        {/* Bottom Actions Footer */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 dark:border-zinc-700/50">
          <span className="text-xs font-mono text-gray-500 dark:text-zinc-400 bg-gray-100 dark:bg-zinc-700/50 px-2 py-1 rounded-md">
            ID: {book.id}
          </span>
          
          <button
            onClick={(e) => {
              e.preventDefault(); // Prevent Navigation when clicking borrow
              e.stopPropagation();
              setConfirmBorrowModal(book);
            }}
            disabled={!book.available}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95 flex items-center gap-1.5
                      ${
                        book.available
                          ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md hover:shadow-blue-500/20"
                          : "bg-gray-100 dark:bg-zinc-700 text-gray-400 dark:text-zinc-500 cursor-not-allowed"
                      }`}
          >
            {book.available ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                Borrow
              </>
            ) : "Unavailable"}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default BookCard1;
