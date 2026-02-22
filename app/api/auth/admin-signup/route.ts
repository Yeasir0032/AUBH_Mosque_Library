import { db } from "@/utils/firebase/admin";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { body } = await req.json();
    const { name, email, phoneNumber, password } = JSON.parse(body);

    if (!name || !email || !password || !phoneNumber) {
      return new NextResponse("Missing highly required fields", { status: 400 });
    }

    const adminsRef = db.collection("Admins");
    
    // Check if an admin already exists with this email
    const snapshot = await adminsRef.where("email", "==", email).limit(1).get();
    
    if (!snapshot.empty) {
      return new NextResponse("An admin account already exists with this email address", { status: 400 });
    }

    // Hash the password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = {
      name: name,
      email: email,
      mobile: phoneNumber,
      password: hashedPassword,
      created_at: new Date().toISOString(),
    };

    const docRef = await adminsRef.add(newAdmin);

    return NextResponse.json({ id: docRef.id, name: name, email: email, role: "admin" });
  } catch (error: any) {
    console.log(error);
    return new NextResponse(error.message, { status: 500 });
  }
}
