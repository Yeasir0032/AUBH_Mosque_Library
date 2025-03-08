"use client";
interface props {
  book: {
    id: number;
    title: string;
    author: string;
    available: boolean;
  };
}

const BookCard1 = ({ book }: props) => {
  return (
    <div
      key={book.id}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-3"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{book.title}</h2>
      <p className="text-gray-600 mb-2">{book.author}</p>
      <div className="flex items-center justify-between mt-4">
        <span
          className={`px-2 py-1 rounded-full text-sm bg-green-200 text-green-800`}
        >
          Code - {book.id}
        </span>
        <button
          // onClick={() => handleBorrow(book.id)}
          disabled={!book.available}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 
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
