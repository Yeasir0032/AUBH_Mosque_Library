import React from "react";

interface BookDetailsProps {
  title: string;
  author: string;
}

const BookDetails = ({ title, author }: BookDetailsProps) => {
  return (
    <div className="p-2 bg-zinc-900 rounded-lg shadow-md font-serif">
      <h2 className="text-lg font-semibold mb-2 line-clamp-2">{title}</h2>
      <p className="text-sm">by {author}</p>
    </div>
  );
};

export default BookDetails;
