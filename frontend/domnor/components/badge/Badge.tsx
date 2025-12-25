import Image from "next/image";
import { useState } from "react";
import { badges } from "@/config/supporterBadge";

export default function Badge({
  username,
  isSupporter,
  isGoldSupporter,
}: {
  username: string;
  isSupporter: boolean;
  isGoldSupporter: boolean;
}) {
  const [showBadgeText, setShowBadgeText] = useState(false);
  const [showGoldBadgeText, setShowGoldBadgeText] = useState(false);
  return (
    <>
      {" "}
      <div className="block pt-2">
        <h4 className="font-bold text-lg inline-block bg-black text-white px-2 py-0.5">
          @{username}
        </h4>
        {isSupporter && !isGoldSupporter && (
          <span
            onClick={() => setShowBadgeText((v) => !v)}
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
            onClick={() => setShowGoldBadgeText((v) => !v)}
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
        <span className="left-8 top-1 bg-white border border-black px-2 py-1 rounded shadow text-xs z-10">
          {username.charAt(0).toUpperCase() + username.slice(1)} is a Supporter
          of Domnor!
        </span>
      )}
      {showGoldBadgeText && (
        <span className="left-8 top-1 bg-white border border-black px-2 py-1 rounded shadow text-xs z-10">
          {username.charAt(0).toUpperCase() + username.slice(1)} is a Gold
          Supporter of Domnor!
        </span>
      )}
    </>
  );
}
