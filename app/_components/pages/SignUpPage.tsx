"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SignUpFormData {
  name: string;
  phoneNumber: string;
  roomNumber: string;
  department: string;
  isNotHosteler: boolean;
}

const SignUpPage = () => {
  const [formData, setFormData] = useState<SignUpFormData>({
    name: "",
    phoneNumber: "",
    roomNumber: "",
    department: "",
    isNotHosteler: false,
  });
  const [error, setError] = useState("");
  const router = useRouter();

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

    const phoneRegex = /^[1-9]\d{9}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      setError("Please enter a valid phone number");
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
    try {
      const data = await axios.post("/api/auth/signup", {
        body: JSON.stringify({
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          roomNumber: formData.roomNumber,
          department: formData.department,
        }),
      });
      // if (data)
      //FIXME: Check the data has no errors
      router.push("/");
    } catch (error) {
      console.log(error);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-4 bg-white p-8 rounded-lg shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-900 lg:text-3xl">
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
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          {/* Phone Number Input */}
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              required
              className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="1234567890"
              value={formData.phoneNumber}
              onChange={handleInputChange}
            />
          </div>

          {/* Department Selection */}
          <div>
            <label
              htmlFor="department"
              className="block text-sm font-medium text-gray-700"
            >
              Department
            </label>
            <input
              id="department"
              name="department"
              type="text"
              required
              className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              checked={formData.isNotHosteler}
              onChange={handleInputChange}
            />
            <label
              htmlFor="isNotHosteler"
              className="ml-2 block text-sm text-gray-900"
            >
              Not a hosteler
            </label>
          </div>

          {/* Room Number Input (Conditional) */}
          {!formData.isNotHosteler && (
            <div>
              <label
                htmlFor="roomNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Room Number
              </label>
              <input
                id="roomNumber"
                name="roomNumber"
                type="text"
                required
                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
        <div className="text-center">
          <Link className="text-sm text-gray-600" href="/login">
            Already have an account?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
