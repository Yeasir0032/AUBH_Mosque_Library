import { createClient } from "@/utils/supabase/client";

/**
 * Fetches the current user's profile data from the Supabase "Users" table.
 * 
 * @param userid - The ID of the user to fetch.
 * @returns The user's profile data if found, otherwise null.
 */
export const currentProfile = async (userid: number) => {
  const supabase = createClient();
  
  // Query the "Users" table for the specified user ID
  const { data, error } = await supabase
    .from("Users")
    .select()
    .eq("id", userid)
    .single();
    
  // If there's an error during fetch, return null
  if (error) return null;
  
  // Return the user data if successful
  if (data) return data;
};
