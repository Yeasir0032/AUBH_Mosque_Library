import { createClient } from "@/utils/supabase/client";
import { Database, Tables } from "@/utils/supabase/supabase-types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardBorrowedBookSection from "../_components/sections/dashboard-borrowed-book";

const UserDashboard = async () => {
  const fetchUserData = async () => {
    const cookieStore = await cookies();

    const userToken = cookieStore.get("authToken")?.value;
    if (!userToken) {
      redirect("/login");
    } else {
      const userData: Database["public"]["Tables"]["Users"]["Row"] =
        JSON.parse(userToken);
      return userData;
    }
  };
  const user = await fetchUserData();
  if (!user) {
    return <div>Login...</div>;
  }

  const fetchBorrowedBooks = async (user_id: number) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("BorrowedBooks")
      .select("borrowed_at,Books(*)")
      .eq("user_id", user_id)
      .eq("returned", false)
      .single();
    if (error) return null;
    return data;
  };
  const booksBorrowed: any = await fetchBorrowedBooks(user.id);
  return (
    <div className="md:p-6 max-w-7xl mx-auto mt-13">
      <div className="rounded-lg shadow-lg p-2 md:p-6">
        <div className="mb-3 md:mb-8">
          <div className="text-2xl font-bold">Welcome, {user.name}</div>
        </div>

        {booksBorrowed && (
          <DashboardBorrowedBookSection
            books={booksBorrowed.Books}
            borrowedDate={booksBorrowed.borrowed_at}
          />
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
