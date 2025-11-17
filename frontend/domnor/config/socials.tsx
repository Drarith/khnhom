export const SOCIAL_PLATFORMS = [
  {
    key: "telegram",
    label: "Telegram",
    prefix: "https://t.me/",
    svg: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M22 4L2 12l5 2 2 6 3-4 4 3 6-15z" fill="#229ED9" />
      </svg>
    ),
  },
  {
    key: "x",
    label: "X (Twitter)",
    prefix: "https://x.com/",
    svg: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17.53 3H21L14.19 10.59 22 21h-7.07l-5.01-6.59L3 21h-3l7.47-8.09L2 3h7.07l4.99 6.59L21 3h-3.47z"
          fill="#000"
        />
      </svg>
    ),
  },
  {
    key: "instagram",
    label: "Instagram",
    prefix: "https://instagram.com/",
    svg: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" fill="#E1306C" />
        <circle cx="12" cy="12" r="5" fill="#fff" />
      </svg>
    ),
  },
  {
    key: "github",
    label: "GitHub",
    prefix: "https://github.com/",
    svg: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.66-.22.66-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.1-1.46-1.1-1.46-.9-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0112 6.8c.85.004 1.71.115 2.51.337 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85v2.74c0 .27.16.58.67.48A10.01 10.01 0 0022 12c0-5.52-4.48-10-10-10z"
          fill="#181717"
        />
      </svg>
    ),
  },
  {
    key: "tiktok",
    label: "TikTok",
    prefix: "https://tiktok.com/@",
    svg: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9 2v15a3 3 0 003 3c1.66 0 3-1.34 3-3V7h2V2h-8z" fill="#000" />
      </svg>
    ),
  },
  {
    key: "youtube",
    label: "YouTube",
    prefix: "https://youtube.com/",
    svg: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="2" y="6" width="20" height="12" rx="6" fill="#FF0000" />
        <polygon points="10,9 16,12 10,15" fill="#fff" />
      </svg>
    ),
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    prefix: "https://www.linkedin.com/in/",
    svg: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" fill="#0077B5" />
        <path
          d="M7 17V9h3v8H7zm1.5-9a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5.5 9v-4c0-1.1-.9-2-2-2s-2 .9-2 2v4h-3V9h3v1.5c.44-.77 1.5-1.5 2.5-1.5 1.93 0 3.5 1.57 3.5 3.5V17h-3z"
          fill="#fff"
        />
      </svg>
    ),
  },
  {
    key: "facebook",
    label: "Facebook",
    prefix: "https://facebook.com/",
    svg: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" fill="#1877F3" />
        <path
          d="M15 8h-2V6a1 1 0 00-1-1h-2a1 1 0 00-1 1v2H7v3h2v7h3v-7h2l1-3z"
          fill="#fff"
        />
      </svg>
    ),
  },
] as const;
