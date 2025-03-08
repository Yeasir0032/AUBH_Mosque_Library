// BorrowModal.tsx
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Book {
  id: string;
  title: string;
  author: string;
}

interface BorrowModalProps {
  closeModal: () => void;
  book: Book | null;
}

const BorrowModal = ({ closeModal, book }: BorrowModalProps) => {
  const router = useRouter();
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
        closeModal();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [closeModal]);

  if (!book) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 bg-opacity-50 z-40"
        onClick={closeModal}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all w-full max-w-md">
            {/* Content */}
            <div className="p-6">
              <h3
                id="modal-title"
                className="text-2xl font-medium leading-6 text-gray-900 mb-2"
              >
                {book.title}
              </h3>
              <div
                id="modal-sub-title"
                className="text-lg font-medium leading-6 text-gray-700 mb-4"
              >
                {book.author}
              </div>
              <div className="absolute right-1 top-1">
                <div className="text-md rounded-md ml-auto font-[400] leading-6 bg-green-200 w-fit p-1 text-green-700">
                  Code - {book.id}
                </div>
              </div>
              <div className="text-zinc-900">
                You have return the book within{" "}
                {new Date(
                  new Date().getTime() + 14 * 24 * 60 * 60 * 1000
                ).toLocaleDateString()}
              </div>

              {/* <div className="mt-2">
                <p className="text-sm text-gray-600">
                  Are you sure you want to borrow "{book.title}" by{" "}
                  {book.author}?
                </p>
              </div> */}

              <div className="mt-6 flex gap-4">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={async () => {
                    const supabase = createClient();
                    const userToken = localStorage.getItem("user-token");
                    if (userToken) {
                      const userData: { id: number } = JSON.parse(userToken);

                      const { data, error } = await supabase
                        .from("BorrowedBooks")
                        .insert([
                          {
                            user_id: userData.id,
                            book_id: book.id,
                            returned: false,
                          },
                        ])
                        .select();
                      if (error) {
                        console.log(error);
                      }
                      //TODO:Change the availibity status of the book
                      if (data) closeModal();
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
                  onClick={closeModal}
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
