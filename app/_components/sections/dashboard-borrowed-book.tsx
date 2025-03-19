"use client";
import { useModalData } from "@/lib/hooks/useModalData";
import ChevronDown from "@/lib/icons/chevron-down";
import axios from "axios";
import React, { useState } from "react";
import ReturnConfirmationModal from "../modals/return-confirmation-modal";
import LoadingOverlay from "./loading";
import { getReturnDate } from "@/utils/utils";

interface props {
  books: Book;
  borrowedDate: string;
}
const DashboardBorrowedBookSection = ({ books, borrowedDate }: props) => {
  const [toggleDetails, setToggleDetails] = useState(false);
  const {
    toastMessage,
    setReturnConfirmModal,
    loading: UILoading,
  } = useModalData();
  return (
    <div className="bg-gray-50 text-gray-700 rounded-lg p-2 md:p-4">
      <ReturnConfirmationModal />
      {UILoading && <LoadingOverlay />}
      {toastMessage.message && (
        <div
          className={`fixed bottom-4 right-2 ${
            toastMessage.type == "Error"
              ? "bg-red-500"
              : toastMessage.type == "Success"
              ? "bg-green-500"
              : "bg-amber-500"
          } p-3 rounded-md z-50 text-white toast toast-exit`}
        >
          {toastMessage.message}
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
                  Return Date: {/*Add two weeks to the borrowed date  */}
                  <span className="text-sm font-medium">
                    {getReturnDate(borrowedDate)}
                  </span>
                </div>
              </div>
              <button
                className="inline-flex mt-4 ml-auto justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                onClick={async () => {
                  setReturnConfirmModal(books);
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
