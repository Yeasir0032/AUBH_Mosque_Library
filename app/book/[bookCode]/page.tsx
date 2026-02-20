import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import BookBorrowButton from "@/app/_components/sections/BookBorrowButton";
import BorrowModal from "@/app/_components/modals/BorrowModal";

interface Book {
  id: string;
  title: string;
  author: string;
  available: boolean;
  description?: string;
}

export default async function BookDetailPage({ params }: any) {
  const { bookCode } = await params;
  
  if (!bookCode) {
    notFound();
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("Books")
    .select("*")
    .eq("id", bookCode)
    .single();

  if (error || !data) {
    notFound();
  }

  const book: Book = data;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900 pb-12 pt-24 px-4">
      <div className="max-w-4xl mx-auto relative">
        {/* Borrow Modal container at root of page elements */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-[100]">
           <BorrowModal />
        </div>

        {/* Breadcrumb Navigation */}
        <nav className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Library
          </Link>
        </nav>

        <div className="bg-white dark:bg-zinc-800 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-700/50 overflow-hidden relative">
          
          <div className="flex flex-col md:flex-row">
            
            {/* Left Column: Book Preview Image/Icon */}
            <div className="w-full md:w-2/5 md:min-h-[400px] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center p-12">
              <svg 
                className="w-32 h-32 text-blue-500/40 dark:text-zinc-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>

            {/* Right Column: Book Details */}
            <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
              
              <div className="flex items-center justify-between mb-4">
                 <span className="text-sm font-mono text-gray-500 dark:text-zinc-400 bg-gray-100 dark:bg-zinc-700/50 px-3 py-1 rounded-md">
                  Book Code: {book.id}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold shadow-sm ${book.available ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                  {book.available ? "Available" : "Checked Out"}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                {book.title}
              </h1>
              <p className="text-xl text-gray-600 dark:text-zinc-300 font-medium mb-8">
                By {book.author}
              </p>

              <div className="prose prose-sm dark:prose-invert text-gray-500 dark:text-zinc-400 mb-10 max-w-none">
                <p>
                  {book.description || "No description available for this book. This fascinating piece of literature by " + book.author + " explores compelling themes and insights perfect for any avid reader."}
                </p>
              </div>

              <div className="mt-auto">
                <BookBorrowButton book={book} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
