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
    const { userId, title, message } = await req.json();

    if (!userId || !title || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = await createClient();

    const { error } = await supabase.from("Notifications").insert({
      user_id: userId,
      title,
      message,
      read: false
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Personal Notice Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
