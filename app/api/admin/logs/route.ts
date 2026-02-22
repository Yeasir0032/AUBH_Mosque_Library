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

export async function GET(req: Request) {
  if (!(await isAdmin())) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const logsRef = db.collection("Logs");
    const snapshot = await logsRef
      .orderBy("created_at", "desc")
      .limit(100)
      .get();
      
    const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    return NextResponse.json(logs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch logs" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const logsRef = db.collection("Logs");
    const snapshot = await logsRef.get();
    
    if (snapshot.size === 0) {
      return NextResponse.json({ success: true, message: "Logs cleared successfully" });
    }

    // Delete documents in batches (batch max limit is 500)
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    
    return NextResponse.json({ success: true, message: "Logs cleared successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to clear logs" }, { status: 500 });
  }
}
