import { db } from "@/utils/firebase/admin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { body } = await req.json();
    const { name, email, phoneNumber, roomNumber, department } = JSON.parse(body);

    const newId = Date.now(); // Using timestamp as a numeric ID equivalent

    const userData = {
      id: newId,
      name: name,
      email: email,
      mobile: phoneNumber || "",
      room_number: roomNumber,
      department: department,
    };

    await db.collection("Users").doc(newId.toString()).set(userData);

    const cookieStore = await cookies();
    cookieStore.set("authToken", JSON.stringify(userData), {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 100,
    });
    return NextResponse.json(userData);
  } catch (error: any) {
    console.log(error);
    return new NextResponse(error.message, { status: 500 });
  }
}
