"use client";
import { GoogleLoginButtonProps } from "@/types/google";
import { GoogleIcon } from "@/config/googleIcon";
import Link from "next/link";
import "./googleSpin.css"

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
      className={`group relative inline-flex items-center gap-3 rounded-full cursor-pointer bg-white px-8 py-4 text-base font-semibold text-gray-800 shadow-lg transition-all duration-300
    hover:bg-gray-50 hover:shadow-xl hover:-translate-y-0.5 hover:scale-105 active:scale-95 active:translate-y-0
    focus:outline-none focus:ring-4 focus:ring-blue-500/30
    aria-disabled:cursor-not-allowed aria-disabled:opacity-60 selected-spin
    ${fullWidth ? "w-full justify-center" : ""}
    ${className}`}
    >
      <span className="flex h-6 w-6 items-center justify-center transition-transform duration-300 group-hover:rotate-12">
        <GoogleIcon />
      </span>
      <span className="whitespace-nowrap tracking-wide">{label}</span>

      {/* Shine effect */}
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-full">
        <div className="absolute -left-full top-0 h-full w-full bg-linear-to-r from-transparent via-white/40 to-transparent transition-all duration-1000 group-hover:left-full" />
      </div>
    </Link>
  );
}
