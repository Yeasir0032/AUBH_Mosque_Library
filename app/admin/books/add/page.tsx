"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function AdminAddBookPage() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  // Usually this would be fetched from the DB `Subjects` list, keeping static for the skeleton
  const [subjectId, setSubjectId] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    try {
      const { data } = await axios.post("/api/admin/books", { title, author, isbn, subjectId });
      setFeedback({ type: "success", text: `Successfully added "${title}" to the catalog! (DB Code: ${data.data.id})` });
      setTitle(""); setAuthor(""); setIsbn(""); setSubjectId("");
    } catch (err: any) {
      setFeedback({ type: "error", text: err.response?.data?.error || err.message || "Failed to add book." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in py-4">
      <header className="mb-8">
        <Link href="/admin/books" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors mb-4">
           <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
           Back to Catalog
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-zinc-100 mb-2">Add New Book</h1>
        <p className="text-gray-500 dark:text-zinc-400">Enter the details of the new book to add it to the library inventory.</p>
      </header>

      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
           {feedback && (
             <div className={`p-4 rounded-xl text-sm font-medium ${feedback.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800/30' : 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400 border border-rose-200 dark:border-rose-800/30'}`}>
               {feedback.text}
             </div>
           )}

           <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Book Title <span className="text-rose-500">*</span></label>
             <input 
               required type="text" placeholder="e.g. Introduction to Algorithms"
               value={title} onChange={(e) => setTitle(e.target.value)}
               className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white outline-none transition-all"
             />
           </div>
           
           <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Author Name</label>
             <input 
               type="text" placeholder="e.g. Thomas H. Cormen"
               value={author} onChange={(e) => setAuthor(e.target.value)}
               className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white outline-none transition-all"
             />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">ISBN</label>
               <input 
                 type="text" placeholder="e.g. 9780262033848"
                 value={isbn} onChange={(e) => setIsbn(e.target.value)}
                 className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white outline-none transition-all font-mono text-sm"
               />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Subject ID</label>
               <input 
                 type="number" placeholder="DB Subject Relation ID (Optional)"
                 value={subjectId} onChange={(e) => setSubjectId(e.target.value)}
                 className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white outline-none transition-all"
               />
             </div>
           </div>

           <button type="submit" disabled={loading} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-all mt-6 disabled:opacity-70 disabled:cursor-not-allowed">
             {loading ? "Adding Book..." : "Add to Library Catalog"}
           </button>
        </form>
      </div>
    </div>
  );
}
