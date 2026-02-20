import { createClient } from "@/utils/supabase/client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * PUT Handler for user login.
 * Expects a mobile number in the request body.
 * Checks if the user exists in the Supabase "Users" table.
 * If found, sets an HTTP-only cookie with the user data for session management.
 */
export async function PUT(req: Request) {
  try {
    // Parse the mobile number from the request body
    const { body } = await req.json();
    const { mobile } = JSON.parse(body);
    
    // Initialize Supabase client
    const supabase = createClient();
    
    // Query the database for a user with the provided mobile number
    const { data, error } = await supabase
      .from("Users")
      .select("*")
      .eq("mobile", mobile)
      .single();
      
    // Handle database errors
    if (error) return new NextResponse(error.message, { status: 400 });
    
    // Handle case where user does not exist
    if (!data) {
      return new NextResponse("User not found", { status: 400 });
    }
    
    console.log(data); // Log user data for debugging
    
    // Set an authentication cookie for the user sessions
    const cookieStore = await cookies();
    cookieStore.set("authToken", JSON.stringify(data), {
      httpOnly: true, // Prevent client-side JS from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      path: "/", // Available across the whole site
      maxAge: 60 * 60 * 24 * 100, // Cookie expires in 100 days
    });
    
    // Return the user data to the client
    return NextResponse.json(data);
  } catch (error: any) {
    console.log(error); // Log unexpected errors
    return new NextResponse(error.message, { status: 500 }); // Return internal server error
  }
}
