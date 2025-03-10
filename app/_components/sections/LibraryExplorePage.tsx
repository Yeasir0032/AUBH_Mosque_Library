"use client";
import { useState, useEffect } from "react";
import BookCard1 from "./book-card1";
import { createClient } from "@/utils/supabase/client";
import BorrowModal from "../modals/BorrowModal";
import HeroSection from "./Hero";
import LoadingSection from "../pages/loading";
import { useModalData } from "@/lib/hooks/useModalData";
import BorrowCodeModal from "../modals/BorrowCodeModal";
const LibraryExplorePage = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const booksPerPage = 10;

  const { toastMessage, setConfirmBorrowModal } = useModalData();

  const fetchBooks = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("Books")
        .select("*")
        .order("id", { ascending: true })
        .range(page * booksPerPage, (page + 1) * booksPerPage - 1);

      if (error) throw error;

      if (data) {
        setBooks((prevBooks) => [...prevBooks, ...data]);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [page]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  if (error) return <div>Error: {error}</div>;
  if (loading && books.length === 0) return <LoadingSection />;

  return (
    <div className="mt-13 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-black py-4 md:py-8 px-4">
      {toastMessage && (
        <div className="fixed bottom-4 right-2 bg-red-500 p-3 rounded-md z-50 text-white toast toast-exit">
          {toastMessage}
        </div>
      )}
      <div className="absolute flex items-center justify-center">
        <BorrowModal />
        <BorrowCodeModal />
      </div>
      <div className="max-w-7xl mx-auto">
        <HeroSection />
        <div className="bg-white rounded-lg shadow-sm mb-4 p-3 flex items-center justify-between">
          <div className="text-gray-600">
            Showing {books.length} books of 130
          </div>
          <div className="flex items-center space-x-2">
            {/* view toggle buttons */}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard1 book={book} key={book.id} />
          ))}
        </div>

        <div className="flex justify-center mt-8">
          {books.length < 130 && (
            <button
              onClick={handleLoadMore}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LibraryExplorePage;
