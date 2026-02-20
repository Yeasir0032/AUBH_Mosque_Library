"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/admin/logs");
      setLogs(data);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || "Error fetching logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleClearLogs = async () => {
    if (!window.confirm("Are you sure you want to completely clear the system logs? This cannot be undone.")) return;
    
    setClearing(true);
    try {
      await axios.delete("/api/admin/logs");
      setLogs([]);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || "Error clearing logs");
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in py-4">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-zinc-100 mb-2">System Logs</h1>
          <p className="text-gray-500 dark:text-zinc-400">Monitor library system activity.</p>
        </div>
        
        <button 
          onClick={handleClearLogs}
          disabled={clearing || logs.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 dark:bg-rose-900/20 dark:text-rose-400 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-800/30 font-medium rounded-xl shadow-sm transition-all text-sm shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {clearing ? (
             <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          ) : (
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          )}
          <span>Clear All Logs</span>
        </button>
      </header>

      {errorMsg && (
         <div className="p-4 rounded-xl text-sm font-medium bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400 border border-rose-200 dark:border-rose-800/30">
           {errorMsg}
         </div>
      )}

      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
           <div className="p-12 text-center text-gray-500 flex justify-center">
              <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
           </div>
        ) : logs.length === 0 ? (
           <div className="px-6 py-12 text-center text-gray-500 dark:text-zinc-400 flex flex-col items-center">
             <svg className="w-12 h-12 text-gray-300 dark:text-zinc-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
             <p className="text-lg font-medium text-gray-900 dark:text-zinc-200">No logs found.</p>
             <p>The system is clean.</p>
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 dark:text-zinc-400">
              <thead className="bg-gray-50 dark:bg-zinc-800/50 text-gray-900 dark:text-zinc-300 font-semibold border-b border-gray-100 dark:border-zinc-800">
                <tr>
                  <th scope="col" className="px-6 py-4">Timeline</th>
                  <th scope="col" className="px-6 py-4">Action</th>
                  <th scope="col" className="px-6 py-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-zinc-100">
                      {log.action}
                    </td>
                    <td className="px-6 py-4">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
