import { db } from "@/utils/firebase/admin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { body } = await req.json();
    const { email } = JSON.parse(body);

    const usersRef = db.collection("Users");
    const snapshot = await usersRef.where("email", "==", email).limit(1).get();

    if (snapshot.empty) {
      // User verified OTP successfully via Firebase Auth, but they don't have a profile yet.
      return NextResponse.json({ isExistingUser: false });
    }

    const userData = snapshot.docs[0].data();
    const data = { id: snapshot.docs[0].id, ...userData };

    // User exists. Set the custom application cookie
    const cookieStore = await cookies();
    cookieStore.set("authToken", JSON.stringify(data), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 100,
    });

    return NextResponse.json({ isExistingUser: true, data });
  } catch (error: any) {
    console.log(error);
    return new NextResponse(error.message, { status: 500 });
  }
}
