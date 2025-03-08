const LibraryExplorePage = () => {
  const books = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      isbn: "978-0743273565",
      available: true,
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      isbn: "978-0446310789",
      available: false,
    },
    {
      id: 3,
      title: "1984",
      author: "George Orwell",
      isbn: "978-0451524935",
      available: true,
    },
    {
      id: 4,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      isbn: "978-0141439518",
      available: true,
    },
    {
      id: 5,
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      isbn: "978-0316769488",
      available: false,
    },
  ];

  const handleBorrow = (bookId: number) => {
    // Handle borrow logic here
    console.log(`Borrowing book with ID: ${bookId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Library Collection
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {book.title}
              </h2>
              <p className="text-gray-600 mb-2">{book.author}</p>
              <div className="flex items-center justify-between mt-4">
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    book.available
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {book.available ? "Available" : "Borrowed"}
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default LibraryExplorePage;
