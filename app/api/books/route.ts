import { createClient } from "@/utils/supabase/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "0");
    const limit = parseInt(searchParams.get("limit") || "12");
    const query = searchParams.get("search") || "";

    const supabase = createClient();
    
    // Base query
    let baseQuery = supabase
      .from("Books")
      .select("*", { count: "exact" });
      
    // Apply search if provided
    if (query) {
      baseQuery = baseQuery.or(`title.ilike.%${query}%,author.ilike.%${query}%${!isNaN(Number(query)) ? `,id.eq.${query}` : ''}`);
    }

    // Fetch books with pagination
    const { data, error, count } = await baseQuery
      .order("id", { ascending: true })
      .range(page * limit, (page + 1) * limit - 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data, count });
  } catch (error: any) {
    return NextResponse.json({ error: "API error" }, { status: 500 });
  }
}
