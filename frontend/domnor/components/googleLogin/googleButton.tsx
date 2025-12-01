"use client";
import { GoogleLoginButtonProps } from "@/types/google/button";
import { GoogleIcon } from "@/config/googleIcon";
import Link from "next/link";


export default function GoogleLoginButton({
  label = "Continue with Google",
  href,
  isLoading = false,
  fullWidth = false,
  className = "",
}: GoogleLoginButtonProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      aria-disabled={isLoading}
      tabIndex={isLoading ? -1 : undefined}
      className={`group relative inline-flex items-center gap-3 rounded-xl cursor-pointer border-foreground bg-foreground px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition
    hover:bg-gray-50 hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    aria-disabled:cursor-not-allowed aria-disabled:opacity-60
    ${fullWidth ? "w-full justify-center" : ""}
    ${className}`}
    >
      <span className="flex h-5 w-5 items-center justify-center">
        <GoogleIcon />
      </span>
      <span className="whitespace-nowrap">{label}</span>
      {/* Subtle disabled overlay */}
      <span className="pointer-events-none absolute inset-0 rounded-md bg-white/40 opacity-0 group-disabled:opacity-100" />
    </Link>
  );
}
