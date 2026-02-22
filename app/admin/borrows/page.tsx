import { db } from "@/utils/firebase/admin";
import ClientBorrowsTable from "./ClientBorrowsTable";

export default async function AdminBorrowsPage() {
  let borrowedBooks = [];
  try {
    const snapshot = await db.collection("BorrowedBooks")
      .where("returned", "==", false)
      .get();

    // Sort in memory to avoid Firestore requiring a composite index
    const sortedDocs = snapshot.docs.sort((a, b) => {
      const dateA = new Date(a.data().borrowed_at || 0).getTime();
      const dateB = new Date(b.data().borrowed_at || 0).getTime();
      return dateB - dateA;
    });

    // Map through borrows and fetch associated User and Book details
    borrowedBooks = await Promise.all(sortedDocs.map(async (doc) => {
      const data = doc.data();
      const userDoc = await db.collection("Users").doc(data.user_id?.toString()).get();
      const bookDoc = await db.collection("Books").doc(data.book_id?.toString()).get();
      
      return {
        id: doc.id,
        ...data,
        Users: userDoc.exists ? userDoc.data() : null,
        Books: bookDoc.exists ? bookDoc.data() : null
      };
    }));

  } catch (error) {
    console.log(error);
    return (
      <div className="p-8 text-center bg-red-50 text-red-600 rounded-2xl border border-red-100">
        Failed to load active borrows. Please check database permissions.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in py-4">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-zinc-100 mb-2">Active Borrows</h1>
          <p className="text-gray-500 dark:text-zinc-400">Monitor all books currently checked out by students.</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-xl font-medium text-sm border border-blue-100 dark:border-blue-800/30">
          {borrowedBooks?.length || 0} Total Active
        </div>
      </header>

      <ClientBorrowsTable borrowedBooks={borrowedBooks} />
    </div>
  );
}
