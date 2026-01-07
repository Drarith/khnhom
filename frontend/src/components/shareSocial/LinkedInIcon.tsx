import React from "react";

export const LinkedInIcon = ({
  className,
  size = 20,
}: {
  className?: string;
  size?: number;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" fill="#0077B5" />
    <path
      d="M7 17V9h3v8H7zm1.5-9a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5.5 9v-4c0-1.1-.9-2-2-2s-2 .9-2 2v4h-3V9h3v1.5c.44-.77 1.5-1.5 2.5-1.5 1.93 0 3.5 1.57 3.5 3.5V17h-3z"
      fill="#fff"
    />
  </svg>
);
