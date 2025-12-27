"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { badges } from "@/config/supporterBadge";

export default function Badge({
  username,
  isSupporter,
  isGoldSupporter,
  isVerified,
  isDev,
}: {
  username: string;
  isSupporter: boolean;
  isGoldSupporter: boolean;
  isVerified: boolean;
  isDev: boolean;
}) {
  const [showBadgeText, setShowBadgeText] = useState(false);
  const [showGoldBadgeText, setShowGoldBadgeText] = useState(false);
  const [showVerifiedText, setShowVerifiedText] = useState(false);
  const [showDevText, setShowDevText] = useState(false);

  const badgeTimerRef = useRef<number | null>(null);
  const goldBadgeTimerRef = useRef<number | null>(null);
  const verifiedTimerRef = useRef<number | null>(null);
  const devTimerRef = useRef<number | null>(null);

  const handleToggleBadge = () => {
    if (showBadgeText) {
      setShowBadgeText(false);
      if (badgeTimerRef.current) {
        clearTimeout(badgeTimerRef.current);
        badgeTimerRef.current = null;
      }
    } else {
      setShowBadgeText(true);
      if (badgeTimerRef.current) clearTimeout(badgeTimerRef.current);
      badgeTimerRef.current = window.setTimeout(() => {
        setShowBadgeText(false);
        badgeTimerRef.current = null;
      }, 3000);
    }
  };

  const handleToggleGoldBadge = () => {
    if (showGoldBadgeText) {
      setShowGoldBadgeText(false);
      if (goldBadgeTimerRef.current) {
        clearTimeout(goldBadgeTimerRef.current);
        goldBadgeTimerRef.current = null;
      }
    } else {
      setShowGoldBadgeText(true);
      if (goldBadgeTimerRef.current) clearTimeout(goldBadgeTimerRef.current);
      goldBadgeTimerRef.current = window.setTimeout(() => {
        setShowGoldBadgeText(false);
        goldBadgeTimerRef.current = null;
      }, 3000);
    }
  };

  const handleToggleVerified = () => {
    if (showVerifiedText) {
      setShowVerifiedText(false);
      if (verifiedTimerRef.current) {
        clearTimeout(verifiedTimerRef.current);
        verifiedTimerRef.current = null;
      }
    } else {
      setShowVerifiedText(true);
      if (verifiedTimerRef.current) clearTimeout(verifiedTimerRef.current);
      verifiedTimerRef.current = window.setTimeout(() => {
        setShowVerifiedText(false);
        verifiedTimerRef.current = null;
      }, 3000);
    }
  };

  const handleToggleDevBadge = () => {
    if (showDevText) {
      setShowDevText(false);
      if (devTimerRef.current) {
        clearTimeout(devTimerRef.current);
        devTimerRef.current = null;
      }
    } else {
      setShowDevText(true);
      if (devTimerRef.current) clearTimeout(devTimerRef.current);
      devTimerRef.current = window.setTimeout(() => {
        setShowDevText(false);
        devTimerRef.current = null;
      }, 3000);
    }
  };

  useEffect(() => {
    return () => {
      if (badgeTimerRef.current) clearTimeout(badgeTimerRef.current);
      if (goldBadgeTimerRef.current) clearTimeout(goldBadgeTimerRef.current);
      if (verifiedTimerRef.current) clearTimeout(verifiedTimerRef.current);
      if (devTimerRef.current) clearTimeout(devTimerRef.current);
    };
  }, []);
  return (
    <>
      {" "}
      <div className="block pt-2">
        <h4 className="font-bold text-lg inline-flex bg-black text-white px-2 py-0.5 gap-1">
          @{username}
          {isVerified && (
            <span
              className="bg-transparent cursor-pointer"
              onClick={handleToggleVerified}
            >
              <Image
                src={badges.verified}
                alt="Verified Badge"
                width={28}
                height={28}
              />
            </span>
          )}
        </h4>
        {isDev && (
          <span
            className="cursor-pointer ml-2 inline-block align-middle relative sweep-container overflow-hidden"
            onClick={handleToggleDevBadge}
          >
            <Image src={badges.dev} alt="Dev Badge" width={28} height={28} />
          </span>
        )}

        {isSupporter && !isGoldSupporter && (
          <span
            onClick={handleToggleBadge}
            className="cursor-pointer ml-2 inline-block align-middle relative sweep-container overflow-hidden "
          >
            <Image
              src={badges.firstTierSupporterBadge}
              alt="Supporter Badge"
              width={28}
              height={28}
            />
          </span>
        )}

        {isGoldSupporter && (
          <span
            onClick={handleToggleGoldBadge}
            className="cursor-pointer ml-2 inline-block align-middle relative sweep-container overflow-hidden "
          >
            <Image
              src={badges.goldTierSupporterBadge}
              alt="Supporter Badge"
              width={28}
              height={28}
            />
          </span>
        )}
      </div>
      {showBadgeText && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            role="dialog"
            aria-modal="true"
            onClick={handleToggleBadge}
            className="absolute inset-0 bg-black/40"
          />
          <div
            className="relative bg-white text-black border border-gray-200 rounded-lg shadow-lg w-full max-w-sm p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold flex items-center">
                  <span>Supporter</span>
                  <Image
                    src={badges.firstTierSupporterBadge}
                    alt="Supporter Badge"
                    width={28}
                    height={28}
                  />
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {username.charAt(0).toUpperCase() + username.slice(1)} ·
                  Contributor to Domnor
                </div>
              </div>
              <button
                aria-label="Close"
                onClick={handleToggleBadge}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
      {showGoldBadgeText && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            role="dialog"
            aria-modal="true"
            onClick={handleToggleGoldBadge}
            className="absolute inset-0 bg-black/40"
          />
          <div
            className="relative bg-white text-black border border-gray-200 rounded-lg shadow-lg w-full max-w-sm p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold flex items-center">
                  <span>Gold‑tier Supporter</span>{" "}
                  <Image
                    src={badges.goldTierSupporterBadge}
                    alt="Supporter Badge"
                    width={28}
                    height={28}
                  />
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {username.charAt(0).toUpperCase() + username.slice(1)} · Major
                  contributor to Domnor
                </div>
              </div>
              <button
                aria-label="Close"
                onClick={handleToggleGoldBadge}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
      {showVerifiedText && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            role="dialog"
            aria-modal="true"
            onClick={handleToggleVerified}
            className="absolute inset-0 bg-black/40"
          />
          <div
            className="relative bg-white text-black border border-gray-200 rounded-lg shadow-lg w-full max-w-sm p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold flex items-center">
                  <span> Verified</span>

                  <Image
                    src={badges.verified}
                    alt="Verified Badge"
                    width={28}
                    height={28}
                  />
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {username.charAt(0).toUpperCase() + username.slice(1)} ·
                  Verified account
                </div>
              </div>
              <button
                aria-label="Close"
                onClick={handleToggleVerified}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
      {showDevText && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            role="dialog"
            aria-modal="true"
            onClick={handleToggleDevBadge}
            className="absolute inset-0 bg-black/40"
          />
          <div
            className="relative bg-white text-black border border-gray-200 rounded-lg shadow-lg w-full max-w-sm p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold flex items-center">
                  <span>Developer</span>
                  <Image
                    src={badges.dev}
                    alt="Developer Badge"
                    width={28}
                    height={28}
                  />
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {username.charAt(0).toUpperCase() + username.slice(1)} · Site
                  developer
                </div>
              </div>
              <button
                aria-label="Close"
                onClick={handleToggleDevBadge}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
