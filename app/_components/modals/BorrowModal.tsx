"use client";

import { useModalData } from "@/lib/hooks/useModalData";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Book {
  id: string;
  title: string;
  author: string;
}

const BorrowModal = () => {
  const router = useRouter();
  const {
    setConfirmBorrowModal,
    setToastMessage,
    confirmBorrowModal: book,
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
        setConfirmBorrowModal(null);
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [setConfirmBorrowModal]);

  if (!book) return null;

  return (
    <div className="relative z-40">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setConfirmBorrowModal(null)}
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
          <div className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-800 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md pointer-events-auto border border-zinc-100 dark:border-zinc-700/50">
            {/* Content */}
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3
                    id="modal-title"
                    className="text-2xl font-bold leading-tg text-gray-900 dark:text-zinc-100"
                  >
                    {book.title}
                  </h3>
                  <div
                    id="modal-sub-title"
                    className="text-md font-medium text-gray-500 dark:text-zinc-400 mt-1"
                  >
                    By {book.author}
                  </div>
                </div>
                <div className="text-xs font-mono font-medium rounded-lg bg-green-50 dark:bg-green-900/30 px-3 py-1.5 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50 whitespace-nowrap ml-4 flex-shrink-0">
                  ID: {book.id}
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30 mb-8">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    If borrowed today, you must return this book by{" "}
                    <span className="font-bold">
                      {new Date(
                        new Date().getTime() + 14 * 24 * 60 * 60 * 1000
                      ).toLocaleDateString()}
                    </span>
                    .
                  </p>
                </div>
              </div>

              <div className="flex gap-3 justify-end sm:flex-row-reverse">
                <button
                  type="button"
                  className="inline-flex w-full sm:w-auto justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-offset-2 transition-all active:scale-95"
                  onClick={async () => {
                    setLoading(true);
                    try {
                      const data = await axios.post("/api/borrow", {
                        body: JSON.stringify({
                          book_id: book.id,
                        }),
                      });
                      if (data) {
                        setLoading(false);
                        setToastMessage(
                          "Book borrowed successfully",
                          "Success"
                        );
                        setConfirmBorrowModal(null);
                        setTimeout(() => {
                          setToastMessage("", "Null");
                        }, 3000);
                      }
                    } catch (error: any) {
                      setLoading(false);
                      if (error.status == 401) {
                        router.push("/login");
                      }
                      setToastMessage(error?.response?.data || "An error occurred", "Error");
                      setConfirmBorrowModal(null);
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
                  onClick={() => setConfirmBorrowModal(null)}
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

export default BorrowModal;
