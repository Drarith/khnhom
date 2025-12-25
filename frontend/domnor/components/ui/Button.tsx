import type { ButtonProps } from "@/types/ui";

export default function Button({
  variant = "primary",
  children,
  isLoading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    "px-6 py-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";

  const variantClasses = {
    primary: "bg-primary text-foreground hover:bg-primary/90",
    secondary: "border border-primary/20 text-primary hover:bg-primary/5",
    ghost: "text-primary hover:bg-primary/5",
  };

  return (
    <button
      type="button"
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}
