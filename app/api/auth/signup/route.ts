import { createClient } from "@/utils/supabase/client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { body } = await req.json();
    const { name, phoneNumber, roomNumber, department } = JSON.parse(body);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("Users")
      .insert([
        {
          name: name,
          mobile: phoneNumber,
          room_number: roomNumber,
          department: department,
        },
      ])
      .select();
    if (error) return new NextResponse(error.message, { status: 400 });
    const cookieStore = await cookies();
    cookieStore.set("authToken", JSON.stringify(data), {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 100,
    });
    return NextResponse.json(data);
  } catch (error: any) {
    console.log(error);
    return new NextResponse(error.message, { status: 500 });
  }
}
