import { db } from "@/utils/firebase/admin";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const isAdmin = async () => {
   const cookieStore = await cookies();
   const userToken = cookieStore.get("authToken")?.value;
   if (!userToken) return false;
   try {
     const user = JSON.parse(userToken);
     return user.role === "admin";
   } catch {
     return false;
   }
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { userId, bookId } = await req.json();

    if (!userId || !bookId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const booksRef = db.collection("Books");
    const bookDocRef = booksRef.doc(bookId.toString());
    const borrowedBooksRef = db.collection("BorrowedBooks");
    const notificationsRef = db.collection("Notifications");
    const logsRef = db.collection("Logs");

    await db.runTransaction(async (transaction) => {
      // 1. Check if Book exists and is available
      const bookDoc = await transaction.get(bookDocRef);

      if (!bookDoc.exists) {
        throw new Error("Book not found");
      }

      const bookData = bookDoc.data();
      if (!bookData?.available) {
        throw new Error("Book is already checked out");
      }

      // 2. Mark book as unavailable
      transaction.update(bookDocRef, { available: false });

      // 3. Create Borrow Record
      const newBorrowedBookRef = borrowedBooksRef.doc();
      transaction.set(newBorrowedBookRef, {
        user_id: userId,
        book_id: bookId,
        returned: false,
        borrowed_at: new Date().toISOString()
      });

      // 4. Send notification to the user
      const newNotificationRef = notificationsRef.doc();
      transaction.set(newNotificationRef, {
        user_id: userId,
        title: "Book Issued",
        message: `An admin has manually issued Book ID ${bookId} to your account.`,
        read: false,
        created_at: new Date().toISOString()
      });

      // 5. Create System Log
      const newLogRef = logsRef.doc();
      transaction.set(newLogRef, {
        action: "Book Issued (Admin)",
        details: `Admin issued Book ID ${bookId} to User ID ${userId}`,
        created_at: new Date().toISOString()
      });
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Issue Error:", error);
    if (error.message === "Book not found") {
        return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }
    if (error.message === "Book is already checked out") {
        return NextResponse.json({ error: "Book is already checked out" }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
