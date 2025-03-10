"use client";

import { useModalData } from "@/lib/hooks/useModalData";

interface props {
  book: Book;
}

const BookCard1 = ({ book }: props) => {
  const { setConfirmBorrowModal } = useModalData();
  return (
    <div
      key={book.id}
      className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg shadow-green-600/20 hover:shadow-xl transition-shadow duration-300 p-3 flex flex-col justify-between"
    >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-zinc-100 mb-2 font-serif">
        {book.title}
      </h2>
      <p className="text-gray-600 dark:text-zinc-400 mb-2 font-serif">
        {book.author}
      </p>
      <div className="flex items-center justify-between mt-4">
        <span
          className={`px-2 py-1 rounded-full text-sm bg-green-200 text-green-800`}
        >
          Code - {book.id}
        </span>
        <button
          onClick={() => setConfirmBorrowModal(book)}
          disabled={!book.available}
          className={`px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition-colors duration-200 
                    ${
                      book.available
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
        >
          {book.available ? "Borrow" : "Unavailable"}
        </button>
      </div>
    </div>
  );
};

export default BookCard1;
