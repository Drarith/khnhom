"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { usePathname } from "next/navigation";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import "./nav.css";

export default function Nav() {
  const container = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { locale } = useParams();
  const pathname = usePathname();

  const menuLinks = [
    { path: `/${locale}`, label: "Home" },
    { path: `/${locale}/about`, label: "About" },
    { path: `/${locale}/contact`, label: "Contact" },
  ];

  const isControlledPath = menuLinks.some((link) => link.path === pathname);

  const tl = useRef<gsap.core.Timeline | null>(null);

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
    if (!tl.current) return;
    if (isMenuOpen) {
      tl.current.play();
    } else {
      tl.current.reverse();
    }
  }, [isMenuOpen]);

  return isControlledPath ? (
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
                <a href="https://github.com/Drarith">Github &#8599;</a>
                <a href="#">LinkedIn &#8599;</a>
                <a href="#">Behance &#8599;</a>
                <a href="#">Dribble &#8599;</a>
              </div>
              <div className="menu-info-col">
                <p>sarindararith@gmail.com</p>
                <p>070 35 70 71</p>
              </div>
            </div>
          </div>
          <div className="menu-preview">
            <p>View Showreel</p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div></div>
  );
}
