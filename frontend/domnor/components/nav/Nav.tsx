"use client";
import Link from "next/link";
import { useState } from "react";
import { useNavAnimation } from "@/gsap/nav";

const paths = [
  {
    path: "/",
    label: "Home",
  },
  {
    path: "/about",
    label: "About",
  },
  {
    path: "/services",
    label: "Services",
  },
];

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useNavAnimation(isMenuOpen);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className="flex flex-row z-50 fixed top-5 left-0 right-0 justify-between px-5 items-center">
        <div>DOMNOR</div>
        <button
          type="button"
          className="hover:cursor-pointer hover:underline"
          onClick={toggleMenu}
        >
          {isMenuOpen ? "CLOSE" : "MENU"}
        </button>
      </div>

      <div
        ref={containerRef}
        id="nav"
        className="z-40 bg-accent fixed inset-0 min-h-screen w-screen pointer-events-none"
        // starting position
        style={{ transform: "translateY(-100%)" }}
      >
        <div className="flex flex-col mt-20 items-center pointer-events-auto">
          {paths.map((path) => (
            <Link
              key={path.label}
              href={path.path}
              onClick={toggleMenu}
              className="nav-link hover:underline text-7xl font-light"
              style={{
                clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
              }}
              replace
            >
              {path.label.toUpperCase()}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
