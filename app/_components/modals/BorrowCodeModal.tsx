import { useModalData } from "@/lib/hooks/useModalData";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BookDetails from "../sections/book-details";

interface Book {
  id: string;
  title: string;
  author: string;
}

const BorrowCodeModal = () => {
  const router = useRouter();
  const [bookCode, setBookCode] = useState("");
  const [book, setBook] = useState<Book | null>(null);
  const { setCodeBorrowModal, setToastMessage, codeBorrowModal, setLoading } =
    useModalData();
  useEffect(() => {
    // Prevent scrolling when modal is open
    if (codeBorrowModal) {
      setBook(null);
      setBookCode("");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [codeBorrowModal]);

  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCodeBorrowModal(false);
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [setCodeBorrowModal]);

  if (!codeBorrowModal) return null;

  return (
    <div className="relative z-50">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setCodeBorrowModal(false)}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="fixed inset-0 overflow-y-auto pointer-events-none"
      >
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <div className="relative transform font-sans overflow-hidden rounded-2xl bg-white dark:bg-zinc-800 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md pointer-events-auto border border-zinc-100 dark:border-zinc-700/50">
            {/* Content */}
            <div className="p-6 sm:p-8">
              <h3
                id="modal-title"
                className="text-2xl font-bold leading-6 text-gray-900 dark:text-zinc-100 mb-2"
              >
                Find & Borrow
              </h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400 mb-6">
                Enter the code found inside the physical book or on the explore page.
              </p>
              
              {/* Input field */}
              <div className="mb-6">
                <div className="relative mt-2 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="code"
                    name="code"
                    type="number"
                    className="block w-full rounded-xl border-0 py-3 pl-10 ring-1 ring-inset ring-gray-300 dark:ring-zinc-600 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-zinc-900/50 dark:text-white transition-all placeholder:text-gray-400"
                    placeholder="Enter Book Code (e.g., 102)"
                    value={bookCode}
                    onChange={(e) => setBookCode(e.target.value)}
                  />
                </div>
                
                <div className="flex justify-end mt-4">
                  <button
                    className="inline-flex w-full sm:w-auto justify-center items-center rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-all active:scale-95"
                    onClick={async () => {
                      if (bookCode == "") {
                        setToastMessage("Please enter a code", "Error");
                        return;
                      }
                      setLoading(true);
                      try {
                        const url = `/api/fetchbook/${bookCode}`;
                        const { data }: { data: Book } = await axios.get(url);
                        setBook(data);
                        setLoading(false);
                      } catch (error: any) {
                        setLoading(false);
                        setToastMessage(error?.response?.data || "Book not found", "Error");
                      }
                    }}
                  >
                    Search Book
                  </button>
                </div>
              </div>

              {book && (
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-zinc-700/50 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30 mb-6">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-zinc-100 mb-1 leading-tight">
                      {book.title}
                    </h4>
                    <div className="text-sm font-medium text-gray-600 dark:text-zinc-400 mb-3">
                      By {book.author}
                    </div>
                    
                    <div className="flex items-start mt-4 pt-4 border-t border-blue-200/50 dark:border-blue-800/50">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
                        Return by: {new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end sm:flex-row-reverse">
                    <button
                      type="button"
                      className="inline-flex w-full sm:w-auto justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all active:scale-95"
                      onClick={async () => {
                        setLoading(true);
                        try {
                          const data = await axios.post("/api/borrow", {
                            body: JSON.stringify({
                              book_id: book.id,
                            }),
                          });
                          if (data) {
                            setCodeBorrowModal(false);
                            setToastMessage("Book borrowed successfully", "Success");
                            setLoading(false);
                            setBook(null);
                            setBookCode("");
                          }
                        } catch (error: any) {
                          setToastMessage(error?.response?.data || "Failed to borrow book", "Error");
                          setCodeBorrowModal(false);
                          setLoading(false);
                          setTimeout(() => {
                            setToastMessage("", "Null");
                          }, 3000);
                        }
                      }}
                    >
                      Confirm Borrow
                    </button>
                    <button
                      type="button"
                      className="inline-flex w-full sm:w-auto justify-center rounded-xl bg-white dark:bg-zinc-800 px-5 py-2.5 text-sm font-semibold text-gray-900 dark:text-zinc-300 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-all active:scale-95 mt-3 sm:mt-0"
                      onClick={() => {
                         setCodeBorrowModal(false);
                         setBook(null);
                         setBookCode("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowCodeModal;
