import { db } from "@/utils/firebase/admin";
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
  const email = searchParams.get("email");

  if (!email) return new NextResponse("Email is required", { status: 400 });

  const usersRef = db.collection("Users");
  const snapshot = await usersRef.where("email", "==", email).limit(1).get();

  if (snapshot.empty) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const userData = snapshot.docs[0].data();
  const data = { id: snapshot.docs[0].id, name: userData.name, email: userData.email };

  return NextResponse.json(data);
}
