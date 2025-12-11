"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { useNavAnimation } from "@/gsap/nav";
import path from "path";

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
  const navRef = useNavAnimation(isMenuOpen);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className="flex flex-row z-50 fixed top-5 left-0 right-0 justify-between px-4 items-center">
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
        ref={navRef}
        id="nav"
        className="z-40 bg-accent fixed inset-0 min-h-screen w-screen"
        // starting position
        style={{ transform: "translateY(-100%)" }}
      >
        <div className="flex flex-col mt-20 items-center">
          {paths.map((path) => (
            <Link
              key={path.label}
              href={path.path}
              className="nav-link hover:underline text-7xl font-light"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)", outline:"2px solid red" }}
              replace
            >
              {path.label.toUpperCase()}
            </Link>
          ))}
        </div>
      </div>
    </>

    // <div className="nav fixed top-5 left-0 right-0 z-50 flex justify-center px-4">
    //   <nav
    //     id="nav"
    //     className="w-full max-w-4xl h-12 bg-foreground rounded-3xl grid grid-cols-4 place-items-center text-primary"
    //   >
    //     {sections.map((section) => (
    //       <Link
    //         key={section}
    //         href={`#${section.toLowerCase()}`}
    //         className="hover:underline "
    //         // Optional: prevents adding every scroll click to browser history
    //         replace
    //       >
    //         {section}
    //       </Link>
    //     ))}
    //   </nav>
    // </div>
  );
}
