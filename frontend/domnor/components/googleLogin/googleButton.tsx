import { GoogleLoginButtonProps } from "@/types/google/button";

export default function GoogleLoginButton({
  label = "Continue with Google",
  fullWidth = false,
  className = "",
}: GoogleLoginButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`group relative inline-flex items-center gap-3 rounded-xl cursor-pointer border-foreground bg-foreground px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition
                  hover:bg-gray-50 hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  disabled:cursor-not-allowed disabled:opacity-60
                  ${fullWidth ? "w-full justify-center" : ""}
                  ${className}`}
    >
      <span className="flex h-5 w-5 items-center justify-center">
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 24 24"
          className="h-5 w-5"
        >
          <path
            fill="#EA4335"
            d="M12 11.1v2.9h6.9c-.2 1.5-.8 2.6-1.8 3.4l2.9 2.3c1.7-1.6 2.7-4 2.7-6.9 0-.7-.1-1.4-.2-2H12z"
          />
          <path
            fill="#34A853"
            d="M5.3 14.3l-.8.6-2.3 1.8C4 20.4 7.7 22 12 22c3 0 5.5-1 7.3-2.7l-2.9-2.3c-1 .8-2.3 1.3-4.4 1.3-3.3 0-6.1-2.2-7.1-5.1z"
          />
          <path
            fill="#FBBC05"
            d="M2.2 6.9C1.4 8.3 1 9.9 1 11.5s.4 3.2 1.2 4.6c0 0 3.1-2.4 3.1-2.4-.4-.8-.6-1.7-.6-2.6s.2-1.8.6-2.6L2.2 6.9z"
          />
          <path
            fill="#4285F4"
            d="M12 5.8c1.7 0 3.2.6 4.4 1.8l3.2-3.2C17.5 2.1 15 1 12 1 7.7 1 4 3.6 2.2 6.9l3.7 2.9c1-2.9 3.8-4 6.1-4z"
          />
        </svg>
      </span>
      <span className="whitespace-nowrap">{label}</span>
      {/* Subtle disabled overlay */}
      <span className="pointer-events-none absolute inset-0 rounded-md bg-white/40 opacity-0 group-disabled:opacity-100" />
    </button>
  );
}
