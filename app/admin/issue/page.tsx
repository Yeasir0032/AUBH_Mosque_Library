"use client";

import { useState } from "react";
import axios from "axios";

export default function IssueBookPage() {
  const [email, setEmail] = useState("");
  const [bookCode, setBookCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleIssueBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      // Step 1: Resolve User ID from Email
      const { data: userData } = await axios.get(`/api/admin/resolve-user?email=${email}`);
      if (!userData || !userData.id) throw new Error("User not found with this email");

      // Step 2: Issue Book Call (we need to create this API endpoint)
      await axios.post("/api/admin/issue-book", {
        userId: userData.id,
        bookId: parseInt(bookCode)
      });
      
      setMessage({ type: "success", text: `Successfully issued Book ID ${bookCode} to ${userData.name}` });
      setEmail("");
      setBookCode("");
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.error || err.message || "Failed to issue book." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pt-12 animate-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-zinc-100 mb-2">Issue a Book</h1>
        <p className="text-gray-500 dark:text-zinc-400">Manually assign a book to a user account using their registered email address.</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-sm p-8 md:p-12">
        <form onSubmit={handleIssueBook} className="space-y-6">
          {message && (
             <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800/30' : 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400 border border-rose-200 dark:border-rose-800/30'}`}>
               {message.text}
             </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
              User Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. student@example.com"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white outline-none transition-all"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            </div>
          </div>

          <div>
            <label htmlFor="bookCode" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
              Book ID (Accession Code)
            </label>
            <div className="relative">
              <input
                id="bookCode"
                type="number"
                required
                value={bookCode}
                onChange={(e) => setBookCode(e.target.value)}
                placeholder="Enter DB Book ID"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white outline-none transition-all font-mono"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-xl hover:shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-8 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
               <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : "Confirm Assignment"}
          </button>
        </form>
      </div>
    </div>
  );
}
