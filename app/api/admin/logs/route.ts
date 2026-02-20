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

export async function GET(req: Request) {
  if (!(await isAdmin())) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const supabase = await createClient();
    const { data: logs, error } = await supabase
      .from("Logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100); // Last 100 Logs

    if (error) throw error;
    
    return NextResponse.json(logs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch logs" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const supabase = await createClient();
    // This removes all rows in the Logs table
    const { error } = await supabase.from("Logs").delete().neq("id", -1);
    
    if (error) throw error;
    
    return NextResponse.json({ success: true, message: "Logs cleared successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to clear logs" }, { status: 500 });
  }
}
