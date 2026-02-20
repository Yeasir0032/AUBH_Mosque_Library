import { createClient } from "@/utils/supabase/client";
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

    const supabase = await createClient();

    // 1. Check if Book exists and is available
    const { data: book, error: bookError } = await supabase
      .from("Books")
      .select("available")
      .eq("id", bookId)
      .single();

    if (bookError || !book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    if (!book.available) {
      return NextResponse.json({ error: "Book is already checked out" }, { status: 400 });
    }

    // 2. Mark book as unavailable
    await supabase.from("Books").update({ available: false }).eq("id", bookId);

    // 3. Create Borrow Record
    const { error: borrowError } = await supabase.from("BorrowedBooks").insert({
      user_id: userId,
      book_id: bookId,
      returned: false,
    });

    if (borrowError) {
      // Revert book availability if borrow fails
      await supabase.from("Books").update({ available: true }).eq("id", bookId);
      throw borrowError;
    }

    // 4. Send notification to the user
    await supabase.from("Notifications").insert({
      user_id: userId,
      title: "Book Issued",
      message: `An admin has manually issued Book ID ${bookId} to your account.`,
      read: false
    });

    // 5. Create System Log
    await supabase.from("Logs").insert({
      action: "Book Issued (Admin)",
      details: `Admin issued Book ID ${bookId} to User ID ${userId}`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Issue Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
