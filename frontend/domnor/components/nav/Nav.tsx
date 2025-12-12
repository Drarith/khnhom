"use client";
// import Link from "next/link";
// import { useState } from "react";
// import { useNavAnimation } from "@/gsap/nav";

// const paths = [
//   {
//     path: "/",
//     label: "Home",
//   },
//   {
//     path: "/about",
//     label: "About",
//   },
//   {
//     path: "/sim",
//     label: "Sim",
//   },
//   {
//     path: "/SART",
//     label: "SART",
//   },
//   {
//     path: "/seces",
//     label: "Services",
//   },
// ];

// export default function Nav() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const containerRef = useNavAnimation(isMenuOpen);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   return (
//     <>
//       {/* <div className="flex flex-row z-50 fixed top-5 left-0 right-0 justify-between px-5 items-center">
//         <div>DOMNOR</div>
//         <button
//           type="button"
//           className="hover:cursor-pointer hover:underline"
//           onClick={toggleMenu}
//         >
//           {isMenuOpen ? "CLOSE" : "MENU"}
//         </button>
//       </div>

//       <div
//         ref={containerRef}
//         id="nav"
//         className="z-40 bg-accent fixed inset-0 min-h-screen w-screen pointer-events-none"
//         // starting position
//         style={{ transform: "translateY(-100%)" }}
//       >
//         <div className="flex flex-col mt-20 items-center pointer-events-auto">
//           {paths.map((path) => (
//             <Link
//               key={path.label}
//               href={path.path}
//               onClick={toggleMenu}
//               className="nav-link hover:underline text-7xl font-light"
//               style={{
//                 clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
//               }}
//               replace
//             >
//               {path.label.toUpperCase()}
//             </Link>
//           ))}
//         </div>
//       </div> */}
//       <div className="menu-container" ref={containerRef}>
//         <div className="menu-bar">
//           <div className="menu-logo">
//             <Link href={"/"}>DOMNOR</Link>
//           </div>
//           <p className="menu-open" onClick={toggleMenu}>
//             MENU
//           </p>
//         </div>
//       </div>
//       <div className="menu-overlay">
//         <div className="menu-overlay-bar">
//           {" "}
//           <div className="menu-logo">
//             <Link href={"/"}>DOMNOR</Link>
//           </div>
//           <div className="menu-close" onClick={toggleMenu}>
//             <p>CLOSE</p>
//           </div>
//         </div>

//         <div className="menu-close-icon">
//           <p>x</p>
//         </div>
//         <div className="menu-copy">
//           <div className="menu-links">
//             {paths.map((path) => (
//               <div key={path.label} className="menu-link-item">
//                 <div className="menu-link-item-holder ">
//                   {" "}
//                   <Link
//                     className="menu-link hover:underline hover:cursor-pointer"
//                     href={path.path}
//                   >
//                     {path.label}
//                   </Link>
//                 </div>
//               </div>
//             ))}
//             <div className="menu-info">
//               <div className="menu-info-col">
//                 <a href="#">X</a>
//                 <a href="#">dfasf</a>
//                 <a href="#">dfsfdfasdf</a>
//                 <a href="#">XX</a>
//                 <a href="#">derib</a>
//               </div>
//               <div className="menu-info-col">
//                 <p>info.cock</p>
//                 <p>453265324235</p>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="menu-preview">
//           <p>show cick</p>
//         </div>
//       </div>
//     </>
//   );
// }

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import "./nav.css";

const menuLinks = [
  { path: "/", label: "Home" },
  { path: "/work", label: "Work" },
  { path: "/about", label: "About" },
  { path: "/contact", label: "Contact" },
  { path: "/lab", label: "Lab" },
];

export default function Nav() {
  const container = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const tl = useRef();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useGSAP(
    () => {
      gsap.set(".menu-link-item-holder", {
        y: 75,
      });
      tl.current = gsap
        .timeline({ paused: true })
        .to(".menu-overlay", {
          duration: 1.25,
          clipPath: "polygon(0% 0%, 100% 0, 100% 100%, 0% 100%)",
          ease: "power4.inOut",
        })
        .to(".menu-link-item-holder", {
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power4.inOut",
          delay: -0.75,
        });
    },
    { scope: container }
  );

  useEffect(() => {
    if (isMenuOpen) {
      tl.current.play();
    } else {
      tl.current.reverse();
    }
  }, [isMenuOpen]);

  return (
    <div className="menu-container" ref={container}>
      <div className="menu-bar">
        <div className="menu-logo">
          <Link href={"/"}>DOMNOR</Link>
        </div>
        <div className="menu-open" onClick={toggleMenu}>
          <p>Menu</p>
        </div>
      </div>

      <div className="menu-overlay">
        <div className="menu-overlay-bar">
          <div className="menu-logo">
            <Link href={"/"}>DOMNOR</Link>
          </div>
          <div className="menu-close" onClick={toggleMenu}>
            <p>Close</p>
          </div>
        </div>
        <div className="menu-overlay-content">
          <div className="menu-close-icon" onClick={toggleMenu}>
            <p>&#x2715;</p>
          </div>
          <div className="menu-copy">
            <div className="menu-links">
              {menuLinks?.map((link, index) => (
                <div className="menu-link-item" key={index}>
                  <div className="menu-link-item-holder" onClick={toggleMenu}>
                    <Link href={link.path} className="menu-link">
                      {link.label.toUpperCase()}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="menu-info">
              <div className="menu-info-col">
                <a href="#">X &#8599;</a>
                <a href="#">Instagram &#8599;</a>
                <a href="#">LinkedIn &#8599;</a>
                <a href="#">Behance &#8599;</a>
                <a href="#">Dribble &#8599;</a>
              </div>
              <div className="menu-info-col">
                <p>info@innova code.com</p>
                <p>2342 232 343</p>
              </div>
            </div>
          </div>
          <div className="menu-preview">
            <p>View Showreel</p>
          </div>
        </div>
      </div>
    </div>
  );
}
