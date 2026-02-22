import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/utils/firebase/admin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { body } = await req.json();
    const { book_id } = JSON.parse(body);
    
    const cookieStore = await cookies();
    const userToken = cookieStore.get("authToken");
    
    if (!userToken) return new NextResponse("Unauthorized", { status: 401 });
    
    const user_id = JSON.parse(userToken.value).id;
    const userData = await currentProfile(user_id);

    if (!userData) return new NextResponse("Unauthorized", { status: 401 });
    if (!book_id) return new NextResponse("Missing bookid", { status: 400 });

    const borrowedBooksRef = db.collection("BorrowedBooks");
    const booksRef = db.collection("Books");
    const logsRef = db.collection("Logs");

    // Validation 1: Check if the user has already borrowed a book
    const borrowedUserSnapshot = await borrowedBooksRef
      .where("user_id", "==", user_id)
      .where("returned", "==", false)
      .limit(1)
      .get();
        
    if (!borrowedUserSnapshot.empty) {
      return new NextResponse("You have already borrowed a book", { status: 400 });
    }

    // Book ref path (assuming book_id maps to doc id, usually they are numeric)
    const bookDocRef = booksRef.doc(book_id.toString());
    
    let borrowedBookData = null;

    // Transaction to safely check availability and borrow
    await db.runTransaction(async (transaction) => {
      const bookDoc = await transaction.get(bookDocRef);
      
      if (!bookDoc.exists) {
        throw new Error("Book is not available");
      }
      
      const bookData = bookDoc.data();
      if (!bookData?.available) {
        throw new Error("Book is not available");
      }

      // Step 1: Update the book to mark it as unavailable
      transaction.update(bookDocRef, { available: false });

      // Step 2: Insert a new record into the BorrowedBooks table logging the action
      const newBorrowedBookRef = borrowedBooksRef.doc();
      borrowedBookData = {
        user_id: user_id,
        book_id: book_id,
        returned: false,
        borrowed_at: new Date().toISOString()
      };
      transaction.set(newBorrowedBookRef, borrowedBookData);

      // Step 3: Create System Log
      const logRef = logsRef.doc();
      transaction.set(logRef, {
        action: "Book Borrowed",
        details: `User ID ${user_id} borrowed Book ID ${book_id}`,
        created_at: new Date().toISOString()
      });
    });

    return NextResponse.json([borrowedBookData]); // Returning array to match prev struct mostly
  } catch (error: any) {
    if (error.message === "Book is not available") {
         return new NextResponse("Book is not available", { status: 400 });
    }
    return new NextResponse("API error", { status: 500 });
  }
}
