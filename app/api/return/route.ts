import { currentProfile } from "@/lib/currentProfile";
import { createClient } from "@/utils/supabase/client";
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

    const supabase = createClient();
    //Check if the book is being borrowed by the user and still not returned
    const { data: BorrowedUserDetails, error: borrwedUserError } =
      await supabase
        .from("BorrowedBooks")
        .select("*")
        .eq("user_id", user_id)
        .eq("book_id", book_id)
        .eq("returned", false);
    if (borrwedUserError)
      return new NextResponse("API error 1", { status: 400 });
    if (!BorrowedUserDetails.length) {
      return new NextResponse("You have not borrowed the book", {
        status: 400,
      });
    }
    //Change the returned state of the book and update the reutrned-at value

    const { data: book, error: bookError } = await supabase
      .from("BorrowedBooks")
      .update({ returned: true, returned_at: new Date().toISOString() })
      .eq("user_id", user_id)
      .eq("book_id", book_id)
      .eq("returned", false)
      .select()
      .single();
    if (bookError) return new NextResponse("API error 2", { status: 400 });

    //Change the availaibity of the book
    const { data: book2, error: bookError2 } = await supabase
      .from("Books")
      .update({ available: true })
      .eq("id", book_id);
    if (bookError2) return new NextResponse("API error 3", { status: 400 });
    return NextResponse.json(book);
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
