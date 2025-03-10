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
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 dark:bg-black/60 bg-opacity-50 z-40"
        onClick={() => setConfirmBorrowModal(null)}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="fixed inset-0 z-50 overflow-y-auto modal"
      >
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative transform font-serif overflow-hidden rounded-lg bg-white dark:bg-zinc-800 shadow-xl transition-all w-full max-w-md">
            {/* Content */}
            <div className="p-6">
              <h3
                id="modal-title"
                className="text-2xl font-medium leading-6 text-gray-900 dark:text-zinc-200 mb-2"
              >
                {book.title}
              </h3>
              <div
                id="modal-sub-title"
                className="text-lg font-medium leading-6 text-gray-700 dark:text-zinc-400 mb-4"
              >
                {book.author}
              </div>
              <div className="absolute right-1 top-1">
                <div className="text-md rounded-md ml-auto font-[400] leading-6 bg-green-200 w-fit p-1 text-green-700">
                  Code - {book.id}
                </div>
              </div>

              <div className="text-zinc-900 dark:text-zinc-100">
                You have to return the book within{" "}
                {new Date(
                  new Date().getTime() + 14 * 24 * 60 * 60 * 1000
                ).toLocaleDateString()}
              </div>

              <div className="mt-6 flex gap-4 font-sans">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={async () => {
                    const userToken = localStorage.getItem("user-token");
                    if (userToken) {
                      const userData: { id: number } = JSON.parse(userToken);
                      try {
                        const data = await axios.post("/api/borrow", {
                          body: JSON.stringify({
                            user_id: userData.id,
                            book_id: book.id,
                          }),
                        });
                        if (data) setConfirmBorrowModal(null);
                      } catch (error: any) {
                        setToastMessage(error.response.data);
                        setConfirmBorrowModal(null);
                        setTimeout(() => {
                          setToastMessage("");
                        }, 3000);
                      }
                    } else {
                      router.push("/login");
                    }
                  }}
                >
                  Confirm Borrow
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => setConfirmBorrowModal(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BorrowModal;
