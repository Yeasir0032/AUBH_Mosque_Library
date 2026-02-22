import { db } from "@/utils/firebase/admin";

/**
 * Fetches the current user's profile data from the Firestore "Users" collection.
 * 
 * @param userid - The ID of the user to fetch.
 * @returns The user's profile data if found, otherwise null.
 */
export const currentProfile = async (userid: number) => {
  // Query the "Users" collection for the specified user ID
  const snapshot = await db.collection("Users").where("id", "==", userid).limit(1).get();
    
  // Return the user data if successful
  if (!snapshot.empty) return snapshot.docs[0].data();

  // If there's an error during fetch, return null
  return null;
};
