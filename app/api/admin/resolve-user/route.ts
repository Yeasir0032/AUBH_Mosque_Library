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

  const { searchParams } = new URL(req.url);
  const mobile = searchParams.get("mobile");

  if (!mobile) return new NextResponse("Mobile is required", { status: 400 });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("Users")
    .select("id, name, mobile")
    .eq("mobile", mobile)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
