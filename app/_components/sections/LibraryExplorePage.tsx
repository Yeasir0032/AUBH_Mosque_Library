"use client";
import { useState, useEffect, useRef } from "react";
import BookCard1 from "./book-card1";
import BorrowModal from "../modals/BorrowModal";
import HeroSection from "./Hero";
import LoadingSection from "../pages/loading";
import { useModalData } from "@/lib/hooks/useModalData";
import BorrowCodeModal from "../modals/BorrowCodeModal";
import LoadingOverlay from "./loading";

/**
 * LibraryExplorePage Component
 * 
 * Main page for displaying and exploring the library catalog.
 * Fetches paginated book data from our custom API route and renders the book grid.
 * Fixes double-fetch duplicate keys via ID filtering.
 */
const LibraryExplorePage = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalBooks, setTotalBooks] = useState<number>(0);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  const booksPerPage = 12;
  const isFetching = useRef(false);

  // Global state for modals, toasts, and UI loading overlay
  const { toastMessage, loading: UILoading } = useModalData();
  // ----- Global Notice State -----
  const [globalNotice, setGlobalNotice] = useState<any>(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Reset page and clear books when search changes
  useEffect(() => {
    setPage(0);
    setBooks([]);
    setTotalBooks(0);
  }, [debouncedSearch]);

  useEffect(() => {
    // 1. Fetch Global Notice on mount
    const fetchNotice = async () => {
      try {
         const res = await fetch("/api/notices/global");
         if (res.ok) {
           const noticeData = await res.json();
           if (noticeData) setGlobalNotice(noticeData);
         }
      } catch (err) {
         console.error("Failed to fetch global notice");
      }
    };
    fetchNotice();
  }, []);

  /**
   * Fetches the next page of books from the API route.
   */
  const fetchBooks = async () => {
    // Basic debounce to prevent concurrent fetching that can cause duplicate issues
    if (isFetching.current) return;
    isFetching.current = true;
    
    try {
      setLoading(true);
      const res = await fetch(`/api/books?page=${page}&limit=${booksPerPage}&search=${encodeURIComponent(debouncedSearch)}`);
      if (!res.ok) throw new Error("Failed to fetch books");
      
      const { data, count, error: apiError } = await res.json();
      if (apiError) throw new Error(apiError);

      if (data) {
        setBooks((prevBooks) => {
          // If page is 0, we're doing a fresh search fetch
          if (page === 0) return data;
          
          // Otherwise, we're appending. Prevent duplicates explicitly
          const existingIds = new Set(prevBooks.map(b => b.id));
          const newBooks = data.filter((b: any) => !existingIds.has(b.id));
          return [...prevBooks, ...newBooks];
        });
        if (count !== null) setTotalBooks(count);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  // Re-fetch books whenever the page number or debounced search changes
  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-900 px-4">
        <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-sm text-center max-w-md w-full border border-gray-100 dark:border-zinc-700">
          <svg className="w-16 h-16 text-rose-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
           <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100 mb-2">Something went wrong</h2>
           <p className="text-gray-500 dark:text-zinc-400 mb-6">{error}</p>
           <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors w-full">
             Try Again
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-13 min-h-screen bg-slate-50 dark:bg-zinc-900 pb-12 pt-4 md:pt-8 px-4">
      {/* Toast Notification Container */}
      {toastMessage.message && (
        <div
          className={`fixed bottom-4 right-4 ${
            toastMessage.type == "Error"
              ? "bg-red-500"
              : toastMessage.type == "Success"
              ? "bg-green-500"
              : "bg-amber-500"
          } py-3 px-6 rounded-lg shadow-xl z-[60] text-white font-medium`}
        >
          {toastMessage.message}
        </div>
      )}
      
      {/* Global Loading Overlay */}
      {UILoading && <LoadingOverlay />}
      
      {/* Modals Container */}
      <div className="absolute flex items-center justify-center">
        <BorrowModal />
        <BorrowCodeModal />
      </div>
      
      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <HeroSection />
        </div>
        
        {/* Global Notice Area */}
        {globalNotice && (
          <div className={`mb-8 p-4 rounded-2xl border flex items-start gap-4 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500 ${
            globalNotice?.type === 'success' ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/30 text-green-800 dark:text-green-300' :
            globalNotice?.type === 'warning' ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/30 text-amber-800 dark:text-amber-300' :
            'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/30 text-blue-800 dark:text-blue-300'
          }`}>
             <div className="mt-0.5 shrink-0">
               {globalNotice?.type === 'success' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
               {globalNotice?.type === 'warning' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
               {globalNotice?.type === 'info' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
             </div>
             <div>
               <h3 className="font-bold text-lg mb-1">{globalNotice?.title}</h3>
               <p className="text-sm opacity-90 leading-relaxed">{globalNotice?.message}</p>
             </div>
          </div>
        )}
        
        {/* Books Meta Information / Header & Search */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm mb-8 p-4 flex flex-col md:flex-row items-center justify-between border border-gray-100 dark:border-zinc-700 gap-4">
          <div className="text-gray-700 dark:text-gray-300 font-medium text-lg min-w-max">
            Showing <span className="font-bold text-blue-600 dark:text-blue-400">{books.length}</span> of <span className="font-bold">{totalBooks}</span> books
          </div>
          
          <div className="w-full md:max-w-md relative text-gray-500 dark:text-zinc-400">
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search by title, author, or book code..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            />
          </div>
        </div>
        
        {/* Loading State for empty books check */}
        {loading && books.length === 0 ? (
          <LoadingSection />
        ) : books.length === 0 ? (
          <div className="text-center py-24 text-gray-500 dark:text-zinc-400 bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700">
            <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-zinc-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            <p className="text-xl font-semibold mb-2 text-gray-800 dark:text-zinc-200">No books found.</p>
            <p>Try adjusting your search criteria.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {books.map((book) => (
                <div key={book.id} className="transition-transform duration-300 hover:-translate-y-1">
                  <BookCard1 book={book} />
                </div>
              ))}
            </div>

            {/* Pagination Trigger */}
            <div className="flex justify-center mt-12 mb-8">
              {books.length < totalBooks && (
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <span>Load More Books</span>
                  )}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LibraryExplorePage;
