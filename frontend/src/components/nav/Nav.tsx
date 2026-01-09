"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { usePathname } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { logout } from "@/https/https";
import { useRouter } from "next/navigation";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import "./nav.css";
import { useTranslations } from "next-intl";
import { LanguageToggle } from "../ui/languageSwitchpill";

export default function Nav() {
  const container = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { locale } = useParams();
  const pathname = usePathname();
  const t = useTranslations("nav");

  const menuLinks = [
    { path: `/${locale}`, label: t("home") },
    { path: `/${locale}/about`, label: t("about") },
    { path: `/${locale}/contact`, label: t("contact") },
  ];

  const isControlledPath = menuLinks.some((link) => link.path === pathname);

  const { mutate: logoutMutation } = useMutation({
    mutationFn: () => {
      return logout();
    },
    onSuccess: () => {
      window.location.href = "/";
    },
  });

  const onLogout = () => {
    logoutMutation();
  };

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

  return (
    <div className="menu-container" ref={container}>
      <div
        className={
          isControlledPath ? "menu-bar" : "menu-bar-login max-w-5xl mx-auto"
        }
      >
        <div className="menu-logo">
          <LanguageToggle />
        </div>
        <div className="menu-open" onClick={toggleMenu}>
          <p>{t("menu")}</p>
        </div>
      </div>

      <div className="menu-overlay">
        <div className="menu-overlay-bar ">
          <div className="menu-logo">
            <Link href={"/"}>KHNHOM</Link>
          </div>
          <div className="menu-close" onClick={toggleMenu}>
            <p>{t("close")}</p>
          </div>
        </div>
        <div className="menu-overlay-content">
          <div className="menu-copy">
            <div className="menu-links mx-auto">
              {menuLinks?.map((link, index) => (
                <div className="menu-link-item" key={index}>
                  <div className="menu-link-item-holder" onClick={toggleMenu}>
                    <Link href={link.path} className="menu-link">
                      {link.label.toUpperCase()}
                    </Link>
                  </div>
                </div>
              ))}
              {/* logout */}
              {!isControlledPath && (
                <>
                  <div className="menu-link-item mt-25">
                    <div className="menu-link-item-holder" onClick={onLogout}>
                      <a className="menu-link hover:cursor-pointer">
                        {t("logout")}
                      </a>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="menu-info">
              <div className="menu-info-col">
                <a href="https://github.com/Drarith">{t("github")}</a>
              </div>
              <div className="menu-info-col">
                <p>khnhomofficial@gmail.com</p>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
