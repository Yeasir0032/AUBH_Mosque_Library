import { currentProfile } from "@/lib/currentProfile";
import { createClient } from "@/utils/supabase/client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * POST Handler for borrowing a book.
 * Expects a requested `book_id` in the JSON request body.
 * Verifies user authentication, checks if the user has already borrowed a book,
 * and processes the borrowing transaction by updating the book's availability
 * and inserting a record into the BorrowedBooks table.
 */
// In the request I have to pass userid, bookid
export async function POST(req: Request) {
  try {
    // Parse the requested book_id from the body
    const { body } = await req.json();
    const { book_id } = JSON.parse(body);
    
    // Retrieve authentication token from cookies
    const cookieStore = await cookies();
    const userToken = cookieStore.get("authToken");
    
    // Ensure the user is authenticated
    if (!userToken) return new NextResponse("Unauthorized", { status: 401 });
    
    // Parse user ID and fetch the user profile to verify they exist
    const user_id = JSON.parse(userToken.value).id;
    const userData = await currentProfile(user_id);

    // Validate request inputs (User must exist, and book_id must be provided)
    if (!userData) return new NextResponse("Unauthorized", { status: 401 });
    if (!book_id) return new NextResponse("Missing bookid", { status: 400 });

    const supabase = createClient();
    
    // ----- Validation 1: Check if the user has already borrowed a book -----
    const { data: BorrowedUserDetails, error: borrwedUserError } =
      await supabase
        .from("BorrowedBooks")
        .select("id")
        .eq("user_id", user_id)
        .eq("returned", false); // Only look for active borrowings
        
    if (borrwedUserError) return new NextResponse("API error", { status: 400 });
    
    // Prevent borrowing if the user already has an unreturned book
    if (BorrowedUserDetails.length) {
      return new NextResponse("You have already borrowed a book", {
        status: 400,
      });
    }
    
    // ----- Validation 2: Check if the requested book is available -----
    const { data: bookData, error: bookError } = await supabase
      .from("Books")
      .select("*")
      .eq("id", book_id)
      .eq("available", true); // Ensure the book is currently marked as available
      
    if (bookError) return new NextResponse("API error", { status: 400 });
    if (!bookData.length)
      return new NextResponse("Book is not available", { status: 400 });

    // ----- Transaction Starts -----
    
    // Step 1: Update the book to mark it as unavailable
    const { data: book, error: bookError2 } = await supabase
      .from("Books")
      .update({ available: false })
      .eq("id", book_id);
    if (bookError2) return new NextResponse("API error", { status: 400 });

    // Step 2: Insert a new record into the BorrowedBooks table logging the action
    const { data: borrowedBook, error: borrowedBookError } = await supabase
      .from("BorrowedBooks")
      .insert([
        {
          user_id: user_id,
          book_id: book_id,
          returned: false,
        },
      ])
      .select();
    if (borrowedBookError)
      return new NextResponse("API error", { status: 400 });

    // Step 3: Create System Log
    await supabase.from("Logs").insert({
      action: "Book Borrowed",
      details: `User ID ${user_id} borrowed Book ID ${book_id}`,
    });

    // Return the inserted borrow record
    return NextResponse.json(borrowedBook);
  } catch (error) {
    return new NextResponse("API error", { status: 500 });
  }
}
