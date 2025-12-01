"use client";

import useSmsAutoFill from "@/hooks/useSmsAutoFill";
import { useEffect, useRef, useState } from "react";

type Props = {};

export default function OtpTest({}: Props) {

  const inputRef = useRef<HTMLInputElement>(null);

  const { otp, setOtp } = useSmsAutoFill();



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
      <input
        ref={inputRef}
        id="otp"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="one-time-code"
        value={otp}
        onChange={handleChange}
        placeholder="Enter 6-digit code"
        className="w-full px-4 py-3 text-center text-2xl font-semibold tracking-widest border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
        maxLength={6}
      />
    </div>
  );
}
