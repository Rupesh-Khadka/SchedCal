"use client";

import Image from "next/image";
import NylasLogo from "@/public/nylas-logo.png";
import NextjsLogo from "@/public/nextjs-logo.svg";
import VercelLogo from "@/public/vercel.svg";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Logos() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="py-10">
        <h2 className="text-center text-lg font-semibold leading-7">
          Trusted by the best companies in the world
        </h2>

        <div className="mt-10 grid max-w-lg mx-auto grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
          <Image
            src={NylasLogo}
            alt="Nylas Logo"
            className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
          />
          <Image
            src={NextjsLogo}
            alt="Next.js Logo"
            className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
          />
          <Image
            src={VercelLogo}
            alt="Vercel Logo"
            className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
          />
          <Image
            src={NylasLogo}
            alt="Nylas Logo"
            className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
          />
          <Image
            src={NextjsLogo}
            alt="Next.js Logo"
            className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
          />
        </div>
      </div>
    );
  }

  // After the component is mounted, use the theme to adjust styles
  return (
    <div className="py-10">
      <h2 className="text-center text-lg font-semibold leading-7">
        Trusted by the best companies in the world
      </h2>

      <div className="mt-10 grid max-w-lg mx-auto grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
        {/* Nylas Logo */}
        <Image
          src={NylasLogo}
          alt="Nylas Logo"
          className={`col-span-2 max-h-12 w-full object-contain lg:col-span-1 ${
            theme === "dark" ? "invert" : ""
          }`}
        />

        {/* Next.js Logo */}
        <Image
          src={NextjsLogo}
          alt="Next.js Logo"
          className={`col-span-2 max-h-12 w-full object-contain lg:col-span-1 ${
            theme === "dark" ? "invert" : ""
          }`}
        />

        {/* Vercel Logo */}
        <Image
          src={VercelLogo}
          alt="Vercel Logo"
          className={`col-span-2 max-h-12 w-full object-contain lg:col-span-1 ${
            theme === "dark" ? "invert" : ""
          }`}
        />

        {/* Repeat Nylas Logo */}
        <Image
          src={NylasLogo}
          alt="Nylas Logo"
          className={`col-span-2 max-h-12 w-full object-contain lg:col-span-1 ${
            theme === "dark" ? "invert" : ""
          }`}
        />

        {/* Repeat Next.js Logo */}
        <Image
          src={NextjsLogo}
          alt="Next.js Logo"
          className={`col-span-2 max-h-12 w-full object-contain lg:col-span-1 ${
            theme === "dark" ? "invert" : ""
          }`}
        />
      </div>
    </div>
  );
}
