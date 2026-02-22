import { db } from "@/utils/firebase/admin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const tokenStr = cookieStore.get("authToken")?.value;
    
    if (!tokenStr) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const sessionUser = JSON.parse(tokenStr);
    
    if (sessionUser.role !== 'admin' || !sessionUser.email) {
      return new NextResponse("Forbidden: Not an admin", { status: 403 });
    }

    const { body } = await req.json();
    const { currentPassword, newPassword } = JSON.parse(body);

    const adminsRef = db.collection("Admins");
    const snapshot = await adminsRef.where("email", "==", sessionUser.email).limit(1).get();

    if (snapshot.empty) {
      return new NextResponse("Admin profile not found", { status: 404 });
    }

    const adminDoc = snapshot.docs[0];
    const adminData = adminDoc.data();

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, adminData.password);
    if (!isPasswordValid) {
      return new NextResponse("Incorrect current password", { status: 401 });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);
    
    // Update password in the database
    await adminDoc.ref.update({ password: hashedNewPassword });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.log(error);
    return new NextResponse(error.message, { status: 500 });
  }
}
