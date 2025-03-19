"use client";
import { useModalData } from "@/lib/hooks/useModalData";
import ChevronDown from "@/lib/icons/chevron-down";
import axios from "axios";
import React, { useState } from "react";

interface props {
  books: Book;
  borrowedDate: string;
}
const DashboardBorrowedBookSection = ({ books, borrowedDate }: props) => {
  const [toggleDetails, setToggleDetails] = useState(false);
  const { setToastMessage, toastMessage } = useModalData();
  return (
    <div className="bg-gray-50 text-gray-700 rounded-lg p-2 md:p-4">
      {toastMessage && (
        <div className="fixed bottom-4 right-2 bg-red-500 p-3 rounded-md z-50 text-white toast toast-exit">
          {toastMessage}
        </div>
      )}
      <h2 className="text-xl font-semibold mb-1">Borrowed Books</h2>
      <div className="">
        <div
          className="bg-zinc-200 rounded-md p-2 md:p-5 flex justify-between text-zinc-800"
          onClick={() => setToggleDetails(!toggleDetails)}
        >
          <div>
            <div className="text-lg md:text-xl font-bold">{books.title}</div>
            <div className="text-sm">{books.author}</div>
          </div>
          <ChevronDown
            className="transition-transform duration-300 ease-in-out cursor-pointer"
            style={{
              transform: `${toggleDetails ? "rotate(180deg)" : "rotate(0deg)"}`,
            }}
          />
        </div>
        {toggleDetails && (
          <div>
            <div className="bg-zinc-300 flex flex-col  p-2 md:p-5 text-zinc-800">
              <div className="bg-green-300 rounded-md mr-auto px-1">
                Book Code: <span className="text-sm">{books.id}</span>
              </div>
              <div>
                <div className="font-bold">
                  Borrowed Date:{" "}
                  <span className="text-sm font-medium">{borrowedDate}</span>
                </div>
              </div>
              <div>
                <div className="font-bold">
                  Return Date:{" "}
                  <span className="text-sm font-medium">{borrowedDate}</span>
                </div>
              </div>
              <button
                className="inline-flex mt-4 ml-auto justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                onClick={async () => {
                  try {
                    const data = await axios.patch("/api/return", {
                      book_id: books.id,
                    });
                  } catch (error: any) {
                    setToastMessage(error.response.data);
                    setTimeout(() => {
                      setToastMessage("");
                    }, 3000);
                  }
                }}
              >
                Return
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardBorrowedBookSection;
