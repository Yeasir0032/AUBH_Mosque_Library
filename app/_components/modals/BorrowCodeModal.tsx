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
  const { setCodeBorrowModal, setToastMessage, codeBorrowModal } =
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
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 dark:bg-black/60 bg-opacity-50 z-40"
        onClick={() => setCodeBorrowModal(false)}
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
          <div className="relative transform font-sans overflow-hidden rounded-lg bg-white dark:bg-zinc-800 shadow-xl transition-all w-full max-w-md">
            {/* Content */}
            <div className="p-6">
              <h3
                id="modal-title"
                className="text-xl font-medium leading-6 text-gray-900 dark:text-zinc-200 mb-2"
              >
                Enter the code of the book you want to borrow
              </h3>
              {/* Input field */}
              <div className="mb-2">
                <div className="my-1">
                  <input
                    id="code"
                    name="code"
                    title="(It can be found inside the front page of the book or you can
                search it from explore)"
                    type="number"
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Code of the book"
                    value={bookCode}
                    onChange={(e) => setBookCode(e.target.value)}
                  />
                </div>
                <div className="flex justify-end mb-2">
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    onClick={async () => {
                      try {
                        const url = `/api/fetchbook/${bookCode}`;
                        const { data }: { data: Book } = await axios.get(url);
                        setBook(data);
                      } catch (error: any) {
                        setToastMessage(error.response.data);
                      }
                    }}
                  >
                    Search
                  </button>
                </div>
                {book && (
                  <>
                    <BookDetails title={book.title} author={book.author} />

                    <div className="text-zinc-900 dark:text-zinc-100 mt-2 text-center">
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
                            const userData: { id: number } =
                              JSON.parse(userToken);
                            try {
                              const data = await axios.post("/api/borrow", {
                                body: JSON.stringify({
                                  user_id: userData.id,
                                  book_id: book.id,
                                }),
                              });
                              if (data) {
                                setCodeBorrowModal(false);
                                setBook(null);
                                setBookCode("");
                              }
                            } catch (error: any) {
                              setToastMessage(error.response.data);
                              setCodeBorrowModal(false);
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
                        onClick={() => setCodeBorrowModal(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BorrowCodeModal;
