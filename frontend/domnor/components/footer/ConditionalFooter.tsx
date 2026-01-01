"use client";
import { usePathname } from "next/navigation";
import Footer from "./Footer";

interface Props {
  locale: string;
}

const ConditionalFooter = ({ locale }: Props) => {
  const pathname = usePathname();

  if (pathname === `/${locale}`) {
    return <Footer />;
  }

  return null;
};

export default ConditionalFooter;
