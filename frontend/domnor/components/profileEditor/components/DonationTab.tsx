import Image from "next/image";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useDonation } from "@/hooks/useDonation";
import Button from "../../ui/Button";
import { badges } from "@/config/supporterBadge";
import { ProfileData } from "@/types/profileData";
import { CheckCheck } from "lucide-react";

export default function DonationTab({
  currentDonationAmount,
}: {
  currentDonationAmount: number;
}) {
  const {
    amount,
    setAmount,
    paymentStatus,
    qrData,
    timeLeft,
    isPending,
    handleGenerate,
  } = useDonation();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="p-6 space-y-6 bg-white rounded-lg shadow-sm">
      <div>
        <h2 className="text-xl font-semibold mb-2 text-primary">Donation</h2>
        <p className="text-sm text-primary/60">
          Domnor is a free platform and will forever remain so. Your support
          will make it better over time.
        </p>
        <p className="text-sm text-primary/60">
          Total Donations Received: ${currentDonationAmount}
        </p>
        <div className="flex flex-col gap-2 mt-2 text-primary/60">
          {currentDonationAmount < 5 ? (
            <div className="flex flex-row items-center gap-2">
              <p>Unlock supporter badge at $5 </p>
              <Image
                src={badges.firstTierSupporterBadge}
                alt="Supporter Badge"
                width={24}
                height={24}
              />
            </div>
          ) : (
            <div className="flex flex-row items-center gap-2">
              <p className="inline-flex gap-2">
                Unlocked{<CheckCheck color="green" />}
              </p>
              <Image
                src={badges.firstTierSupporterBadge}
                alt="Supporter Badge"
                width={24}
                height={24}
              />
            </div>
          )}

          {currentDonationAmount < 20 ? (
            <div className="flex flex-row items-center gap-2">
              <p>Unlock supporter badge at $20 </p>
              <Image
                src={badges.goldTierSupporterBadge}
                alt="Supporter Badge"
                width={24}
                height={24}
              />
            </div>
          ) : (
            <div className="flex flex-row items-center gap-2">
              <p className="inline-flex gap-2">
                Unlocked{<CheckCheck color="green" />}
              </p>
              <Image
                src={badges.goldTierSupporterBadge}
                alt="Supporter Badge"
                width={24}
                height={24}
              />
            </div>
          )}
        </div>
      </div>

      {/* Input Section - Hide if paid to prevent confusion */}
      {paymentStatus !== "paid" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Amount (USD)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 rounded-md border border-primary/20 bg-foreground text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Enter amount"
              min="0"
              step="0.01"
              disabled={isPending || paymentStatus === "pending"}
            />
          </div>

          {/* Only show Generate button if not currently waiting for payment */}
          {paymentStatus !== "pending" && (
            <Button
              onClick={handleGenerate}
              disabled={isPending}
              className="w-full flex justify-center items-center gap-2"
            >
              {isPending && <Loader2 className="animate-spin" size={16} />}
              {paymentStatus === "expired" ? "Try Again" : "Generate QR"}
            </Button>
          )}
        </div>
      )}

      {/* 1. SUCCESS STATE */}
      {paymentStatus === "paid" && (
        <div className="flex flex-col items-center space-y-4 p-8 bg-green-50 rounded-lg animate-in fade-in zoom-in duration-300">
          <CheckCircle className="text-green-500 w-16 h-16" />
          <h3 className="text-2xl font-bold text-green-700">Thank You!</h3>
          <p className="text-green-600">
            Your donation of ${amount} was received. Your support will help make
            our platform better!
          </p>
        </div>
      )}

      {/* 2. PENDING QR STATE */}
      {paymentStatus === "pending" && qrData && (
        <div className="flex flex-col items-center space-y-4 p-4 bg-white rounded-lg shadow-inner border border-gray-100">
          <div className="relative w-64 h-64">
            <Image
              src={qrData}
              alt="Donation QR Code"
              fill
              className="object-contain"
            />
            {/* Overlay loader to show it's "live" */}
            <div className="absolute -top-2 -right-2">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
              </span>
            </div>
          </div>

          <div className="text-center space-y-1">
            <p className="text-sm text-gray-500">Scan with your banking app</p>
            <div
              className={`text-lg font-bold font-mono ${
                timeLeft < 60 ? "text-red-500" : "text-primary"
              }`}
            >
              Expires in: {formatTime(timeLeft)}
            </div>
          </div>

          {/* Manual Cancel Button */}
          {/* <button
            onClick={handleIdle}
            className="text-xs text-red-400 hover:text-red-600 underline"
          >
            Cancel Transaction
          </button> */}
        </div>
      )}

      {/* 3. EXPIRED STATE */}
      {paymentStatus === "expired" && (
        <div className="flex flex-col items-center p-4 text-center">
          <AlertCircle className="text-gray-400 w-10 h-10 mb-2" />
          <p className="text-gray-500">The QR Code has expired.</p>
        </div>
      )}
    </div>
  );
}
