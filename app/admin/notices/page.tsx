"use client";

import { useState } from "react";
import axios from "axios";

export default function AdminNoticesPage() {
  const [globalTitle, setGlobalTitle] = useState("");
  const [globalMessage, setGlobalMessage] = useState("");
  const [globalType, setGlobalType] = useState("info");

  const [personalMobile, setPersonalMobile] = useState("");
  const [personalTitle, setPersonalTitle] = useState("");
  const [personalMessage, setPersonalMessage] = useState("");

  const [loadingGlobal, setLoadingGlobal] = useState(false);
  const [loadingPersonal, setLoadingPersonal] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleGlobalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingGlobal(true);
    setFeedback(null);
    try {
      await axios.post("/api/admin/notices/global", { title: globalTitle, message: globalMessage, type: globalType });
      setFeedback({ type: "success", text: "Global notice broadcasted successfully to the Explore page." });
      setGlobalTitle(""); setGlobalMessage(""); setGlobalType("info");
    } catch (err: any) {
      setFeedback({ type: "error", text: "Failed to broadcast global notice." });
    } finally {
      setLoadingGlobal(false);
    }
  };

  const handlePersonalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingPersonal(true);
    setFeedback(null);
    try {
      // 1. Resolve user mobile to ID
      const { data: userData } = await axios.get(`/api/admin/resolve-user?mobile=${personalMobile}`);
      if (!userData?.id) throw new Error("User not found");

      // 2. Send distinct notification
      await axios.post("/api/admin/notices/personal", { userId: userData.id, title: personalTitle, message: personalMessage });
      
      setFeedback({ type: "success", text: `Personal notification sent successfully to ${userData.name}.` });
      setPersonalMobile(""); setPersonalTitle(""); setPersonalMessage("");
    } catch (err: any) {
      setFeedback({ type: "error", text: err.response?.data?.error || err.message || "Failed to send notification." });
    } finally {
      setLoadingPersonal(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in py-4">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-zinc-100 mb-2">Communications Center</h1>
        <p className="text-gray-500 dark:text-zinc-400">Broadcast global notices to all users or send direct dashboard notifications to individuals.</p>
      </header>

      {feedback && (
         <div className={`p-4 rounded-xl text-sm font-medium ${feedback.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800/30' : 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400 border border-rose-200 dark:border-rose-800/30'}`}>
           {feedback.text}
         </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Global Notices Form */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm p-8">
          <div className="mb-6 pb-6 border-b border-gray-100 dark:border-zinc-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
              Global Notices
            </h2>
            <p className="text-sm text-gray-500 mt-1">These will appear at the top of the Explore page for all visiting users.</p>
          </div>
          
          <form onSubmit={handleGlobalSubmit} className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Notice Type (Color)</label>
               <select 
                 value={globalType} 
                 onChange={(e) => setGlobalType(e.target.value)}
                 className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white outline-none transition-all"
               >
                 <option value="info">Information (Blue)</option>
                 <option value="success">Success (Green)</option>
                 <option value="warning">Warning/Alert (Amber/Red)</option>
               </select>
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Notice Title</label>
               <input 
                 required type="text"
                 value={globalTitle} onChange={(e) => setGlobalTitle(e.target.value)}
                 className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white outline-none transition-all"
               />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Message Body</label>
               <textarea 
                 required rows={3}
                 value={globalMessage} onChange={(e) => setGlobalMessage(e.target.value)}
                 className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white outline-none transition-all resize-none"
               />
             </div>
             <button type="submit" disabled={loadingGlobal} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm transition-all mt-4">
               {loadingGlobal ? "Broadcasting..." : "Broadcast Global Notice"}
             </button>
          </form>
        </div>


        {/* Individual Notifications Form */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm p-8">
          <div className="mb-6 pb-6 border-b border-gray-100 dark:border-zinc-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
              <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              Direct Message
            </h2>
            <p className="text-sm text-gray-500 mt-1">Send a direct dashboard notification to a specific user via their mobile number.</p>
          </div>
          
          <form onSubmit={handlePersonalSubmit} className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Target User Mobile</label>
               <input 
                 required type="tel"
                 value={personalMobile} onChange={(e) => setPersonalMobile(e.target.value)}
                 className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white outline-none transition-all"
               />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Notification Title</label>
               <input 
                 required type="text"
                 value={personalTitle} onChange={(e) => setPersonalTitle(e.target.value)}
                 className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white outline-none transition-all"
               />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Message Content</label>
               <textarea 
                 required rows={3}
                 value={personalMessage} onChange={(e) => setPersonalMessage(e.target.value)}
                 className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white outline-none transition-all resize-none"
               />
             </div>
             <button type="submit" disabled={loadingPersonal} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl shadow-sm transition-all mt-4">
               {loadingPersonal ? "Sending..." : "Send Direct Message"}
             </button>
          </form>
        </div>

      </div>
    </div>
  );
}
