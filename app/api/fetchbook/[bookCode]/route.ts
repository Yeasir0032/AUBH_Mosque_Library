import { db } from "@/utils/firebase/admin";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: any) {
  try {
    const { bookCode } = await params;
    if (!bookCode) return new NextResponse("BAD Request", { status: 400 });
    
    const bookDoc = await db.collection("Books").doc(bookCode).get();
    
    if (!bookDoc.exists) {
      return new NextResponse("Book not found", { status: 404 });
    }
    
    return NextResponse.json({ id: bookDoc.id, ...bookDoc.data() });
  } catch (error) {
    return new NextResponse("API error", { status: 500 });
  }
}
