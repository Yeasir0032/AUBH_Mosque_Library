import { useModalData } from "@/lib/hooks/useModalData";
import axios from "axios";
import React, { useEffect } from "react";

const ReturnConfirmationModal = () => {
  const {
    setReturnConfirmModal,
    returnConfirmModal: book,
    setToastMessage,
    setLoading,
  } = useModalData();
  useEffect(() => {
    // Prevent scrolling when modal is open
    if (book) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [book]);

  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setReturnConfirmModal(null);
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [setReturnConfirmModal]);

  if (!book) return null;
  
  return (
    <div className="relative z-50">
      <div
        className="fixed inset-0 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setReturnConfirmModal(null)}
        aria-hidden="true"
      />
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
              
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 mb-5">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-3 3m0 0l-3-3m3 3V9m0-6a9 9 0 110 18 9 9 0 010-18z" />
                </svg>
              </div>

              <div className="text-center mb-6">
                <h3
                  id="modal-title"
                  className="text-xl font-bold leading-6 text-gray-900 dark:text-zinc-100 mb-2"
                >
                  Return Book
                </h3>
                <p className="text-sm text-gray-500 dark:text-zinc-400">
                  Are you sure you want to return this book to the library?
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-gray-100 dark:border-zinc-700/50 mb-8 border-l-4 border-l-blue-500">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-zinc-200 mb-1 leading-tight">
                  {book.title}
                </h4>
                <div className="text-sm font-medium text-gray-600 dark:text-zinc-400 mb-3">
                  By {book.author}
                </div>
                <div className="text-xs font-mono font-medium rounded-md bg-white dark:bg-zinc-800 px-2.5 py-1 text-gray-500 dark:text-zinc-400 border border-gray-200 dark:border-zinc-700/80 inline-block">
                  Code: {book.id}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-center sm:flex-row-reverse">
                <button
                  type="button"
                  title="Return book"
                  className="inline-flex w-full sm:w-auto justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all active:scale-95"
                  onClick={async () => {
                    setLoading(true);
                    try {
                      const data = await axios.patch("/api/return", {
                        book_id: book.id,
                      });
                      setReturnConfirmModal(null);
                      setLoading(false);
                      setToastMessage("Book returned successfully", "Success");
                      setTimeout(() => {
                        setToastMessage("", "Null");
                      }, 3000);
                    } catch (error: any) {
                      setToastMessage(error?.response?.data || "An error occurred", "Error");
                      setLoading(false);
                      setReturnConfirmModal(null);
                      setTimeout(() => {
                        setToastMessage("", "Null");
                      }, 3000);
                    }
                  }}
                >
                  Confirm Return
                </button>
                <button
                  type="button"
                  className="inline-flex w-full sm:w-auto justify-center rounded-xl bg-white dark:bg-zinc-800 px-5 py-2.5 text-sm font-semibold text-gray-900 dark:text-zinc-300 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-all active:scale-95 mt-3 sm:mt-0"
                  onClick={() => setReturnConfirmModal(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnConfirmationModal;
