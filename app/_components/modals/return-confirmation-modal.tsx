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
    <div>
      <div
        className="fixed inset-0 bg-black/40 dark:bg-black/60 bg-opacity-50 z-10"
        onClick={() => setReturnConfirmModal(null)}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="fixed inset-0 z-20 overflow-y-auto modal"
      >
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative transform font-sans overflow-hidden rounded-lg bg-white dark:bg-zinc-800 shadow-xl transition-all w-full max-w-md">
            {/* Content */}
            <div className="p-6">
              <h3
                id="modal-title"
                className="text-xl font-medium leading-6 text-gray-900 dark:text-zinc-200 mb-2"
              >
                Are you sure you want to return this book?
              </h3>
              <div className="py-2">
                <h3
                  id="modal-title"
                  className="text-2xl font-medium font-serif leading-6 text-gray-900 dark:text-zinc-200 mb-2"
                >
                  {book.title}
                </h3>
                <div
                  id="modal-sub-title"
                  className="text-md font-serif font-medium leading-6 text-gray-700 dark:text-zinc-400 mb-4"
                >
                  {book.author}
                </div>
                <div className="text-md rounded-md mr-auto font-[400] leading-6 bg-green-200 w-fit p-1 text-green-700">
                  Code - {book.id}
                </div>
              </div>
              {/* Input field */}
              <div className="flex justify-end mb-2">
                <button
                  type="button"
                  title="Return book"
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
                      setToastMessage(error.response.data, "Error");
                      setLoading(false);
                      setReturnConfirmModal(null);
                      setTimeout(() => {
                        setToastMessage("", "Null");
                      }, 3000);
                    }
                  }}
                >
                  Confirm
                </button>
                <button
                  type="button"
                  className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors ml-2"
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
