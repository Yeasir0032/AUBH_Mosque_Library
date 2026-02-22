import { db } from "@/utils/firebase/admin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { body } = await req.json();
    const { email, password } = JSON.parse(body);

    const adminsRef = db.collection("Admins");
    const snapshot = await adminsRef.where("email", "==", email).limit(1).get();

    if (snapshot.empty) {
      return new NextResponse("Admin not found", { status: 400 });
    }

    const data = snapshot.docs[0].data();

    // Check password
    if (!data.password) {
      return new NextResponse("Password not set", { status: 400 });
    }

    const isPasswordValid = await bcrypt.compare(password, data.password);
    if (!isPasswordValid) {
      return new NextResponse("Invalid credentials", { status: 401 });
    }

    // Set an authentication cookie. Add role: 'admin' to distinguish from regular users.
    const cookieStore = await cookies();
    const sessionData = { id: snapshot.docs[0].id, ...data, role: "admin" };
    
    cookieStore.set("authToken", JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 100,
    });

    return NextResponse.json(sessionData);
  } catch (error: any) {
    console.log(error);
    return new NextResponse(error.message, { status: 500 });
  }
}
