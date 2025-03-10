import { useModalData } from "@/lib/hooks/useModalData";
import React from "react";

const HeroSection = () => {
  const { setCodeBorrowModal } = useModalData();
  return (
    <section className="min-h-[25vh] rounded-md  mb-2 flex flex-col justify-center items-center text-center p-4 md:p-8 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-zinc-100">
      <blockquote className="text-xl md:text-3xl italic mb-8 max-w-3xl">
        "Whoever travels a path in search of knowledge, Allah will make easy for
        him a path to Paradise"
      </blockquote>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 cursor-pointer"
          onClick={() => setCodeBorrowModal(true)}
        >
          Borrow a Book
        </button>
        <button
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition duration-300 cursor-pointer"
          onClick={() => {}}
        >
          Return a book
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
