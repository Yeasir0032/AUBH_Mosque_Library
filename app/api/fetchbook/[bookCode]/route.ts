import { createClient } from "@/utils/supabase/client";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { bookCode: number } }
) {
  try {
    const { bookCode } = await params;
    if (!bookCode) return new NextResponse("BAD Request", { status: 400 });
    const supabase = createClient();
    const { data, error } = await supabase
      .from("Books")
      .select("*")
      .eq("id", bookCode);
    if (error) return new NextResponse(error.message, { status: 400 });
    if (!data.length)
      return new NextResponse("Book not found", { status: 404 });
    return NextResponse.json(data[0]);
  } catch (error) {
    return new NextResponse("API error", { status: 500 });
  }
}
