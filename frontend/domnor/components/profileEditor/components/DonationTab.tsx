import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { postJSON } from "@/https/https";
import Button from "../../ui/Button";
import { toast } from "react-toastify";
import getAxiosErrorMessage from "@/helpers/getAxiosErrorMessage";
import { AxiosError } from "axios";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function DonationTab() {
  const [amount, setAmount] = useState<string>("");
  const [qrData, setQrData] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const { mutate, isPending } = useMutation({
    mutationFn: (amount: number) =>
      postJSON<{ qrData: string }>("/user/generate-donation-khqr", {
        amount,
      }),
    onSuccess: (data) => {
      setQrData(data.qrData);
      setTimeLeft(300); // 5 minutes
      toast.success("QR Code generated successfully");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage = getAxiosErrorMessage(error);
      toast.error(errorMessage || "Failed to generate QR code");
    },
  });

  useEffect(() => {
    if (timeLeft <= 0) {
      if (qrData) {
        setQrData(null);
        toast.info("QR Code expired");
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, qrData]);

  const handleGenerate = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    mutate(numAmount);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2 text-primary">Donation</h2>
        <p className="text-sm text-primary/60">
          Generate a KHQR code for donations.
        </p>
      </div>

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
          />
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isPending}
          className="w-full flex justify-center items-center gap-2"
        >
          {isPending && <Loader2 className="animate-spin" size={16} />}
          Generate QR
        </Button>
      </div>

      {qrData && (
        <div className="flex flex-col items-center space-y-4 p-4 bg-white rounded-lg shadow-md">
          <div className="relative w-64 h-64">
            <Image
              src={qrData}
              alt="Donation QR Code"
              fill
              className="object-contain"
            />
          </div>
          <div className="text-lg font-bold text-red-500">
            Expires in: {formatTime(timeLeft)}
          </div>
        </div>
      )}
    </div>
  );
}
