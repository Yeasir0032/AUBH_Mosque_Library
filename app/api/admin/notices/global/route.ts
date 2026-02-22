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
    const { title, message, type } = await req.json();

    if (!title || !message || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const noticesRef = db.collection("Notices");

    // Inactivate any old notices first
    const activeNotices = await noticesRef.where("is_active", "==", true).get();
    
    const batch = db.batch();
    activeNotices.docs.forEach((doc) => {
      batch.update(doc.ref, { is_active: false });
    });

    const newNoticeRef = noticesRef.doc();
    batch.set(newNoticeRef, {
      title,
      message,
      type,
      is_active: true,
      created_at: new Date().toISOString()
    });

    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Global Notice Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
