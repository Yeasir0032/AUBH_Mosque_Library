import { createClient } from "@/utils/supabase/client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const { body } = await req.json();
    const { mobile } = JSON.parse(body);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("Users")
      .select("*")
      .eq("mobile", mobile)
      .single();
    if (error) return new NextResponse(error.message, { status: 400 });
    if (!data) {
      return new NextResponse("User not found", { status: 400 });
    }
    console.log(data);
    const cookieStore = await cookies();
    cookieStore.set("authToken", JSON.stringify(data), {
      httpOnly: true,
      secure: false, //FIXME: Change it to secure
      path: "/",
      maxAge: 60 * 60 * 24 * 100,
    });
    return NextResponse.json(data);
  } catch (error: any) {
    console.log(error);
    return new NextResponse(error.message, { status: 500 });
  }
}
