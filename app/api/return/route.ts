import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/utils/firebase/admin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const { book_id } = await req.json();
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

    // Check if the book is being borrowed by the user and still not returned
    const borrowedUserSnapshot = await borrowedBooksRef
        .where("user_id", "==", user_id)
        .where("book_id", "==", book_id)
        .where("returned", "==", false)
        .limit(1)
        .get();

    if (borrowedUserSnapshot.empty) {
      return new NextResponse("You have not borrowed the book", { status: 400 });
    }

    const borrowedDocRef = borrowedUserSnapshot.docs[0].ref;
    const bookDocRef = booksRef.doc(book_id.toString());
    
    let returnedBookData = null;

    // Transaction to safely update both docs
    await db.runTransaction(async (transaction) => {
      // Change the returned state of the book and update the returned-at value
      returnedBookData = { 
        ...borrowedUserSnapshot.docs[0].data(),
        returned: true, 
        returned_at: new Date().toISOString() 
      };
      transaction.update(borrowedDocRef, { 
        returned: true, 
        returned_at: new Date().toISOString() 
      });

      // Change the availability of the book
      transaction.update(bookDocRef, { available: true });

      // Create System Log
      const logRef = logsRef.doc();
      transaction.set(logRef, {
        action: "Book Returned",
        details: `User ID ${user_id} returned Book ID ${book_id}`,
        created_at: new Date().toISOString()
      });
    });

    return NextResponse.json(returnedBookData);
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
