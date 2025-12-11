"use client";
import Link from "next/link";
import { useNavAnimation } from "@/gsap/nav";

export default function Nav() {
  useNavAnimation();
  const sections = ["About", "Services", "Contact", "Sign Up"];

  return (
    <div className="nav flex flex-row justify-center sticky top-5 z-50">
      {" "}
      <nav
        id="nav"
        className="w-100 h-12 bg-foreground rounded-3xl grid grid-cols-4 place-items-center text-primary "
      >
        {sections.map((section) => (
          <Link
            key={section}
            href={`#${section.toLowerCase()}`}
            className="hover:underline "
            // Optional: prevents adding every scroll click to browser history
            replace
          >
            {section}
          </Link>
        ))}
      </nav>
    </div>
  );
}
