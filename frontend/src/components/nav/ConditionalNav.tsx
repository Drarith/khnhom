"use client";
import { usePathname } from "next/navigation";
import Nav from "@/components/nav/Nav";
import type { Locale } from "@/types/rootLayout";


export default function MaybeNav({locale}: Locale) {
  const pathname = usePathname() || "";
  console.log("Current pathname:", pathname);
  const showNavPaths = [`/${locale}`, `/${locale}/about`, `/${locale}/contact`, `/${locale}/dashboard`];
  if (!showNavPaths.includes(pathname)) return null;
  return <Nav />;
}