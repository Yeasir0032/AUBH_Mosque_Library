import { createClient } from "@/utils/supabase/client";

export const currentProfile = async (userid: number) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Users")
    .select()
    .eq("id", userid)
    .single();
  if (error) return null;
  if (data) return data;
};
