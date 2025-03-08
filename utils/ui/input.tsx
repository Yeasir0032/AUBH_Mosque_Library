import React from "react";

interface props {
  value: any;
  setter: () => void;
  label: string;
  type: string;
  name: string;
  placeholder?: string;
}
const Input = () => {
  return (
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
          //   value={phoneNumber}
          //   onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Input;
