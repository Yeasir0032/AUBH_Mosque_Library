"use client";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handlePhoneNumberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //Phone number validation
    const phoneRegex = /^[1-9]\d{9}$/;

    if (!phoneRegex.test(phoneNumber)) {
      setError("Please enter a valid phone number");
      return;
    }
    const supabase = createClient();
    const { data, error } = await supabase
      .from("Users")
      .select("*")
      .eq("mobile", phoneNumber);
    if (error) setError(error.message);
    if (data?.length) {
      localStorage.setItem("user-token", JSON.stringify(data[0]));
      router.push("/");
    } else {
      setError("No data found for this mobile number");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handlePhoneNumberSubmit}>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <div className="mt-1">
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="+1234567890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </div>
        </form>
        <div className="text-center">
          <Link className="text-sm text-gray-600" href="/signup">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
