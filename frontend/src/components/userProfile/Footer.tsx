import Link from "next/link";
import { useTranslations } from "next-intl";

interface FooterProps {
  theme?: {
    bg?: string;
    text?: string;
  };
  username: string;
}

export default function Footer({ theme, username }: FooterProps) {
  const t = useTranslations("footer");
  return (
    <footer
      className="w-full py-4 md:py-6 mt-6 md:mt-8 text-center border-t"
      style={{
        borderColor: theme?.text ? `${theme.text}20` : "rgba(0, 0, 0, 0.1)",
        color: theme?.text || "#666",
      }}
    >
      <div className="flex flex-col items-center gap-1.5 md:gap-2 px-4">
        <p className="text-xs md:text-sm opacity-70">
          {t("join")}{" "}
          <span className="font-semibold" style={{ color: theme?.text }}>
            {username}
          </span>{" "}
          {t("on")}
        </p>
        <Link
          href="/"
          className="font-bold text-base md:text-lg hover:opacity-80 transition-opacity"
          style={{ color: theme?.text }}
        >
          Khnhom
        </Link>
      </div>
    </footer>
  );
}
