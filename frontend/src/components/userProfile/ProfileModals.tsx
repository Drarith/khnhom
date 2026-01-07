"use client";

import { useState } from "react";
import { ProfileData } from "@/types/profileData";
import { QrCode, Share2, X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { SocialShare } from "../shareSocial/ShareSocial";

export default function ProfileModals({
  data,
  activeTheme,
}: {
  data: ProfileData;
  activeTheme?: { name: string; bg?: string; text?: string } | undefined;
}) {
  const t = useTranslations("userProfile");
  const [showQrModal, setShowQrModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const DOMAIN = process.env.NEXT_PUBLIC_FRONTEND_URL;

  return (
    <>
      <div className="absolute top-4 md:top-15 left-5 z-40 ">
        {data.paymentQrCodeUrl && (
          <button
            onClick={() => setShowQrModal(true)}
            className="p-3 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 backdrop-blur-sm animate-pulse"
            style={{
              backgroundColor: activeTheme?.bg
                ? `${activeTheme.bg}80`
                : "rgba(255,255,255,0.5)",
              color: activeTheme?.text,
              border: `1px solid ${activeTheme?.text}20`,
            }}
            aria-label="Show QR Code"
          >
            <QrCode size={25} />
          </button>
        )}
      </div>

      <div className="absolute top-4 md:top-15 right-4 z-40">
        <button
          onClick={() => setShowShareModal(true)}
          className="p-3 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 backdrop-blur-sm"
          style={{
            backgroundColor: activeTheme?.bg
              ? `${activeTheme.bg}80`
              : "rgba(255,255,255,0.5)",
            color: activeTheme?.text,
            border: `1px solid ${activeTheme?.text}20`,
          }}
          aria-label="Share Profile"
        >
          <Share2 size={25} />
        </button>
      </div>

      {/* QR Modal */}
      {showQrModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowQrModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute right-4 top-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center space-y-6 pt-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {t("scanToPay")}
              </h3>
              <p className="text-sm">
                {t("qrNote")} <br /> {t("openApp")}
              </p>

              <div className="flex flex-col items-center">
                <div className="w-64 bg-red-600 py-1 rounded-t-xl border border-b-0 border-red-600 flex items-center justify-center">
                  <Image
                    src={
                      "https://res.cloudinary.com/dosj9q3zb/image/upload/v1766044956/KHQR_Logo_fvvdmq.png"
                    }
                    alt="khqr logo"
                    width={60}
                    height={60}
                    className="w-16 h-16 object-contain brightness-0 invert"
                  />
                </div>

                <div className="relative w-64 h-64 bg-white rounded-b-xl overflow-hidden border border-gray-100 shadow-inner">
                  <Image
                    src={data.paymentQrCodeUrl}
                    alt="Payment QR Code"
                    fill
                    className="object-contain p-2"
                  />
                </div>
              </div>

              {data.paymentInfo && (
                <div className="w-full space-y-3">
                  <div className="text-center space-y-1 pb-3 border-b border-gray-100 dark:border-gray-800">
                    <p className="font-semibold text-lg text-gray-900 dark:text-white">
                      {data.paymentInfo.merchantName}
                    </p>
                    {data.paymentInfo.bakongAccountID && (
                      <p className="text-sm text-gray-500 font-mono">
                        {data.paymentInfo.bakongAccountID}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    {data.paymentInfo.amount && (
                      <div className="flex justify-between items-center px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-gray-600 dark:text-gray-400">
                          {t("amount")}
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {data.paymentInfo.currency || "KHR"}{" "}
                          {data.paymentInfo.amount.toLocaleString()}
                        </span>
                      </div>
                    )}

                    {data.paymentInfo.merchantCity && (
                      <div className="flex justify-between items-center px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-gray-600 dark:text-gray-400">
                          {t("city")}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {data.paymentInfo.merchantCity}
                        </span>
                      </div>
                    )}

                    {data.paymentInfo.purpose && (
                      <div className="flex justify-between items-center px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-gray-600 dark:text-gray-400">
                          {t("purpose")}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {data.paymentInfo.purpose}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <SocialShare
            url={`${DOMAIN}/${data.username}`}
            onClose={() => setShowShareModal(false)}
            scenario="profile"
          />
        </div>
      )}
    </>
  );
}
