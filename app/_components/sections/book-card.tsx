import React from "react";

interface props {
  book: {
    id: number;
    name: string;
    author: string;
    availability: boolean;
  };
}

const BookCard = ({ book }: props) => {
  return (
    <div
      key={book.id}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
    >
      <div className="p-6">
        <div className="h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
          <svg
            className="w-16 h-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {book.name}
        </h2>
        <p className="text-gray-600 mb-2">{book.author}</p>
        <div className="mt-4 flex items-center justify-between">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              book.availability
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {book.availability ? "Available" : "Not Available"}
          </span>
          <button
            // onClick={() => handleBorrow(book.id)}
            disabled={!book.availability}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              book.availability
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Borrow
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
