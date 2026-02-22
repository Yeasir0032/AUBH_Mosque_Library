import { db } from "@/utils/firebase/admin";
import Link from "next/link";

export default async function AdminBooksPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  
  const page = searchParams?.page && typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 0;
  const limitCount = 20;
  const searchQuery = searchParams?.search && typeof searchParams.search === 'string' ? searchParams.search.toLowerCase() : "";

  let books = [];
  let totalCount = 0;

  try {
    const booksRef = db.collection("Books");

    if (searchQuery) {
       // Since Firestore doesn't support generic substring search via simple queries,
       // and this is a dashboard context, we'll fetch all and filter in memory if searching,
       // or use basic range queries if performance becomes an issue. Given this is a small library
       // app, memory filtering on title works best to mimic Supabase's ilike without using Algolia.
       const allBooksSnapshot = await booksRef.orderBy("id", "asc").get();
       const allDocs = allBooksSnapshot.docs;
       
       const filteredDocs = allDocs.filter(doc => {
         const data = doc.data();
         return (data.title?.toLowerCase().includes(searchQuery)) || 
                (data.author?.toLowerCase().includes(searchQuery)) ||
                (data.id?.toString() === searchQuery);
       });
       
       totalCount = filteredDocs.length;
       books = filteredDocs.slice(page * limitCount, (page + 1) * limitCount).map(doc => ({ id: doc.id, ...doc.data() }));

    } else {
       // Normal paginated request
       const countSnapshot = await booksRef.count().get();
       totalCount = countSnapshot.data().count;

       const snapshot = await booksRef
         .orderBy("id", "asc")
         .offset(page * limitCount)
         .limit(limitCount)
         .get();
       
       books = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

  } catch (error) {
    console.log(error);
    return <div className="p-8 text-center text-red-600 bg-red-50 rounded-xl">Error loading books.</div>;
  }

  const count = totalCount;
  const limit = limitCount;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in py-4">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-zinc-100 mb-2">Library Catalog</h1>
          <p className="text-gray-500 dark:text-zinc-400">Manage all books, add new inventory, or update details.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <form className="relative" action="/admin/books" method="GET">
             <input 
               type="text" 
               name="search"
               placeholder="Search title, author, ID..." 
               defaultValue={searchQuery}
               className="w-full md:w-64 pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm outline-none transition-all dark:text-zinc-100 placeholder-gray-400"
             />
             <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             {searchQuery && (
               <Link href="/admin/books" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
               </Link>
             )}
          </form>
          
          <Link href="/admin/books/add" className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm transition-all text-sm shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            <span className="hidden sm:inline">Add Book</span>
          </Link>
        </div>
      </header>

      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 dark:text-zinc-400">
            <thead className="bg-gray-50 dark:bg-zinc-800/50 text-gray-900 dark:text-zinc-300 font-semibold border-b border-gray-100 dark:border-zinc-800">
              <tr>
                <th scope="col" className="px-6 py-4">ID</th>
                <th scope="col" className="px-6 py-4">Title & Author</th>
                <th scope="col" className="px-6 py-4">Subject</th>
                <th scope="col" className="px-6 py-4">ISBN</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
              {books?.map((book: any) => (
                <tr key={book.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-zinc-500">
                    {book.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-zinc-100 mb-1 line-clamp-1">{book.title}</div>
                    <div className="text-xs text-gray-500 dark:text-zinc-400">{book.author || 'Unknown Author'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {book.Subjects?.name ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-zinc-300">
                        {book.Subjects.name}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic text-xs">None</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">
                    {book.ISBN || '—'}
                  </td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${book.available ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                        {book.available ? "Available" : "Checked Out"}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                     <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm transition-colors py-1 px-2 border border-blue-100 dark:border-blue-900/30 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
                       Edit
                     </button>
                  </td>
                </tr>
              ))}
              {(!books || books.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-zinc-400">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 text-gray-300 dark:text-zinc-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                      <p className="text-lg font-medium text-gray-900 dark:text-zinc-200">No books found.</p>
                      {searchQuery && <p>Clear search filters to see all books.</p>}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between text-sm">
           <span className="text-gray-500 dark:text-zinc-400">
             Showing <span className="font-semibold text-gray-900 dark:text-zinc-200">{books?.length || 0}</span> of <span className="font-semibold text-gray-900 dark:text-zinc-200">{count || 0}</span>
           </span>
           <div className="flex items-center gap-2">
              <Link 
                href={`/admin/books?page=${Math.max(0, page - 1)}${searchQuery ? `&search=${searchQuery}` : ''}`}
                className={`px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-700 font-medium transition-colors ${page === 0 ? 'text-gray-400 dark:text-zinc-600 pointer-events-none' : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800'}`}
              >
                Previous
              </Link>
              <Link 
                href={`/admin/books?page=${page + 1}${searchQuery ? `&search=${searchQuery}` : ''}`}
                className={`px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-700 font-medium transition-colors ${!books || books.length < limit ? 'text-gray-400 dark:text-zinc-600 pointer-events-none' : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800'}`}
              >
                Next
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
