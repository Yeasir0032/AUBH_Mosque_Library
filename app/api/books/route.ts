import { db } from "@/utils/firebase/admin";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "0");
    const limit = parseInt(searchParams.get("limit") || "12");
    const query = searchParams.get("search") || "";

    const booksRef = db.collection("Books");
    
    // Base query
    let baseQuery: FirebaseFirestore.Query = booksRef.orderBy("id", "asc");
      
    // Apply search if provided (Firestore doesn't have an exact 'ilike' equivalent, 
    // so this is a basic prefix search or exact match for simplicity)
    if (query) {
      if (!isNaN(Number(query))) {
         baseQuery = booksRef.where("id", "==", Number(query));
      } else {
         // Basic prefix search on title
         baseQuery = booksRef.where("title", ">=", query).where("title", "<=", query + '\uf8ff');
      }
    }

    // Fetch count
    const countSnapshot = await baseQuery.count().get();
    const count = countSnapshot.data().count;

    // Fetch books with pagination
    const snapshot = await baseQuery.offset(page * limit).limit(limit).get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ data, count });
  } catch (error: any) {
    return NextResponse.json({ error: "API error" }, { status: 500 });
  }
}
