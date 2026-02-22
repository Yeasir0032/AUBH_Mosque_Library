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
    const { title, author, isbn, subjectId } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Book title is required" }, { status: 400 });
    }

    const booksRef = db.collection("Books");
    
    // Auto-generate numeric ID by querying the max ID and incrementing - simple approach for this app
    const maxIdSnapshot = await booksRef.orderBy("id", "desc").limit(1).get();
    let newId = 1;
    if (!maxIdSnapshot.empty) {
      newId = maxIdSnapshot.docs[0].data().id + 1;
    }

    const insertData: any = {
      id: newId,
      title,
      author: author || null,
      ISBN: isbn || null,
      available: true
    };
    
    if (subjectId) insertData["subject-id"] = parseInt(subjectId);

    await booksRef.doc(newId.toString()).set(insertData);

    // Create System Log
    await db.collection("Logs").add({
      action: "Book Added",
      details: `Admin added new Book "${title}" (ID: ${newId}) to catalog.`,
      created_at: new Date().toISOString()
    });

    return NextResponse.json({ success: true, data: insertData });
  } catch (error: any) {
    console.error("Add Book Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
