"use client";
import { usePathname } from "next/navigation";
import Nav from "@/components/nav/Nav";
import type { Props } from "@/types/rootLayout";

type Locale = Pick<Props['params'], 'locale'>;

export default function MaybeNav({locale}: Locale) {
  const pathname = usePathname() || "";
  console.log("Current pathname:", pathname);
  const showNavPaths = [`/${locale}`, `/${locale}/about`, `/${locale}/contact`, `/${locale}/dashboard`];
  if (!showNavPaths.includes(pathname)) return null;
  return <Nav />;
}