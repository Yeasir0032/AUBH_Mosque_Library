import SignUpPageDesign from "@/app/_components/pages/SignUpPage";
import { createClient } from "@/utils/supabase/client";
import { cookies } from "next/headers";

const SignUpPage = async () => {
  return <SignUpPageDesign />;
};

export default SignUpPage;
