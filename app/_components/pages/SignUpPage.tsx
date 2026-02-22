"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { auth } from "@/utils/firebase/client";
import { createUserWithEmailAndPassword } from "firebase/auth";

interface SignUpFormData {
  name: string;
  email: string;
  phoneNumber: string;
  password?: string;
  roomNumber: string;
  department: string;
  isNotHosteler: boolean;
}

const SignUpPage = () => {
  const [formData, setFormData] = useState<SignUpFormData>({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    roomNumber: "",
    department: "",
    isNotHosteler: false,
  });
  const [error, setError] = useState("");
  const router = useRouter();
  
  // Try to pre-fill the email from the url (if passed from login)
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setFormData(prev => ({ ...prev, email: emailParam }));
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const validateForm = async () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    const phoneRegex = /^(?:\+91|91)?[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      setError("Please enter a valid phone number");
      return false;
    }

    if (!formData.password || formData.password.length < 6) {
       setError("Password must be at least 6 characters");
       return false;
    }

    const roomNumberRegex = /^(0?[1-9]|1[0-9])-(0?[1-9]|1[0-8])$/;
    if (!roomNumberRegex.test(formData.roomNumber)) {
      setError("Please enter a valid room number");
      return false;
    }
    if (!formData.isNotHosteler && !formData.roomNumber.trim()) {
      setError("Room number is required for hostelers");
      return false;
    }

    if (!formData.department) {
      setError("Please select a department");
      return false;
    }
    
    setError("");
    try {
      // 1. Create auth user in Firebase
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);

      // 2. Create profile in Firestore
      const data = await axios.post("/api/auth/signup", {
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          roomNumber: formData.roomNumber,
          department: formData.department,
        }),
      });
      router.push("/");
    } catch (error: any) {
      console.log(error);
      setError(error.message || "Failed to sign up.");
    }
    // const supabase = createClient();
    // const { data, error } = await supabase
    //   .from("Users")
    //   .insert([
    //     {
    //       name: formData.name,
    //       mobile: formData.phoneNumber,
    //       room_number: formData.roomNumber,
    //       department: formData.department,
    //     },
    //   ])
    //   .select();
    // if (error) {
    //   setError(error.message);
    //   return false;
    // }
    // if (data) {
    //   // cookies().set("")
    //   localStorage.setItem("user-token", JSON.stringify(data[0]));
    //   //Add a route
    //   router.push("/");
    //   return true;
    // }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900 transition-colors py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-4 bg-white dark:bg-zinc-800 p-8 rounded-lg shadow-xl border border-transparent dark:border-zinc-700">
        <div>
          <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-900 dark:text-zinc-100 lg:text-3xl">
            Create your account
          </h2>
        </div>

        <form
          className="mt-8 space-y-4 lg:space-y-6"
          onSubmit={handleSignUpSubmit}
        >
          {/* Name Input */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-zinc-300"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 bg-white dark:bg-zinc-800/50 border border-gray-300 dark:border-zinc-700 placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-zinc-300"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 bg-white dark:bg-zinc-800/50 border border-gray-300 dark:border-zinc-700 placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
              placeholder="student@example.com"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          {/* Phone Number Input */}
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 dark:text-zinc-300"
            >
              Phone Number
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              required
              className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 bg-white dark:bg-zinc-800/50 border border-gray-300 dark:border-zinc-700 placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
              placeholder="9876543210"
              value={formData.phoneNumber}
              onChange={handleInputChange}
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-zinc-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 bg-white dark:bg-zinc-800/50 border border-gray-300 dark:border-zinc-700 placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>

          {/* Department Selection */}
          <div>
            <label
              htmlFor="department"
              className="block text-sm font-medium text-gray-700 dark:text-zinc-300"
            >
              Department
            </label>
            <input
              id="department"
              name="department"
              type="text"
              required
              className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 bg-white dark:bg-zinc-800/50 border border-gray-300 dark:border-zinc-700 placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
              placeholder="BTech-CSE-3rd"
              value={formData.department}
              onChange={handleInputChange}
            />
          </div>

          {/* Hosteler Checkbox */}
          <div className="flex items-center">
            <input
              id="isNotHosteler"
              name="isNotHosteler"
              title="isNotHosteler"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 rounded transition-colors"
              checked={formData.isNotHosteler}
              onChange={handleInputChange}
            />
            <label
              htmlFor="isNotHosteler"
              className="ml-2 block text-sm text-gray-900 dark:text-zinc-300"
            >
              Not a hosteler
            </label>
          </div>

          {/* Room Number Input (Conditional) */}
          {!formData.isNotHosteler && (
            <div>
              <label
                htmlFor="roomNumber"
                className="block text-sm font-medium text-gray-700 dark:text-zinc-300"
              >
                Room Number
              </label>
              <input
                id="roomNumber"
                name="roomNumber"
                type="text"
                required
                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 bg-white dark:bg-zinc-800/50 border border-gray-300 dark:border-zinc-700 placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                placeholder="04-15"
                value={formData.roomNumber}
                onChange={handleInputChange}
              />
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign Up
            </button>
          </div>
        </form>
        {/* Add a link for already have an accoumt */}
        <div className="text-center mt-6">
          <Link className="text-sm text-gray-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 font-medium" href="/login">
            Already have an account?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
