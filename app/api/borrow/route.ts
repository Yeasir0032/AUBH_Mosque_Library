import { currentProfile } from "@/lib/currentProfile";
import { createClient } from "@/utils/supabase/client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

//In the request I have to pass userid, bookid
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

    //check if the user has already borrowed the book
    const supabase = createClient();
    const { data: BorrowedUserDetails, error: borrwedUserError } =
      await supabase
        .from("BorrowedBooks")
        .select("id")
        .eq("user_id", user_id)
        .eq("returned", false);
    if (borrwedUserError) return new NextResponse("API error", { status: 400 });
    if (BorrowedUserDetails.length) {
      return new NextResponse("You have already borrowed a book", {
        status: 400,
      });
    }
    //Check if book is available
    const { data: bookData, error: bookError } = await supabase
      .from("Books")
      .select("*")
      .eq("id", book_id)
      .eq("available", true);
    if (bookError) return new NextResponse("API error", { status: 400 });
    if (!bookData.length)
      return new NextResponse("Book is not available", { status: 400 });

    //Transactions starts
    // Change the availaibity of the book
    const { data: book, error: bookError2 } = await supabase
      .from("Books")
      .update({ available: false })
      .eq("id", book_id);
    if (bookError2) return new NextResponse("API error", { status: 400 });

    //Insert the book into the borrowed books table
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

    return NextResponse.json(borrowedBook);
  } catch (error) {
    return new NextResponse("API error", { status: 500 });
  }
}
