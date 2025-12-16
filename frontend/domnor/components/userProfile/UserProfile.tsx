import { ProfileData } from "@/types/profileData";
import { templates } from "@/registry/templateRegistry";
import { themes } from "@/config/theme";
import { useState, useEffect } from "react";
import { QrCode, Share2, X, Copy, Check } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";

export default function UserProfile({ data }: { data: ProfileData }) {
  // Get the template based on selectedTemplate field
  const templateKey = data.selectedTemplate || "default";
  const TemplateComponent =
    templates[templateKey]?.component || templates.default.component;

  const activeTheme = themes.find((theme) => theme.name === data.theme);

  const [showQrModal, setShowQrModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pageUrl, setPageUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPageUrl(window.location.href);
    }
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Link copied!");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center overflow-x-hidden relative"
      style={{ backgroundColor: activeTheme?.bg, color: activeTheme?.text }}
    >
      <div className="w-full max-w-lg h-full min-h-screen md:py-10 relative">
        {/* Universal Buttons */}
        <div className="absolute top-4 md:top-15 left-4 z-40">
          {data.paymentQrCodeUrl && (
            <button
              onClick={() => setShowQrModal(true)}
              className="p-3 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 backdrop-blur-sm"
              style={{
                backgroundColor: activeTheme?.bg
                  ? `${activeTheme.bg}80`
                  : "rgba(255,255,255,0.5)",
                color: activeTheme?.text,
                border: `1px solid ${activeTheme?.text}20`,
              }}
              aria-label="Show QR Code"
            >
              <QrCode size={20} />
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
            <Share2 size={20} />
          </button>
        </div>

        <TemplateComponent data={data} />
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
                Scan to Pay
              </h3>

              <div className="relative w-64 h-64 bg-white rounded-xl overflow-hidden border border-gray-100 shadow-inner">
                <Image
                  src={data.paymentQrCodeUrl}
                  alt="Payment QR Code"
                  fill
                  className="object-contain p-2"
                />
              </div>

              {data.paymentInfo && (
                <div className="text-center space-y-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {data.paymentInfo.merchantName}
                  </p>
                  {data.paymentInfo.bakongAccountID && (
                    <p className="text-sm text-gray-500">
                      {data.paymentInfo.bakongAccountID}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-2xl w-full max-w-sm p-6 space-y-6 shadow-2xl animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Share Profile
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500 ml-1">
                  Profile Link
                </p>
                <div className="flex items-center gap-2 p-2 pr-2 pl-4 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm text-gray-600 dark:text-gray-300 font-medium">
                      {pageUrl}
                    </p>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      copied
                        ? "bg-green-500 text-white shadow-green-200"
                        : "bg-black dark:bg-white text-white dark:text-black hover:opacity-90"
                    }`}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
