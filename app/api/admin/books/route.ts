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
    const { title, author, isbn, subjectId } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Book title is required" }, { status: 400 });
    }

    const supabase = await createClient();

    const insertData: any = {
      title,
      author: author || null,
      ISBN: isbn || null,
      available: true
    };
    
    if (subjectId) insertData["subject-id"] = parseInt(subjectId);

    const { data, error } = await supabase.from("Books").insert(insertData).select().single();

    if (error) throw error;

    // Create System Log
    await supabase.from("Logs").insert({
      action: "Book Added",
      details: `Admin added new Book "${title}" (ID: ${data.id}) to catalog.`,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Add Book Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
