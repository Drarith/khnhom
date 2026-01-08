export const runtime = "edge";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { postJSON } from "@/https/https";
import { toast } from "react-toastify";
import getAxiosErrorMessage from "@/helpers/getAxiosErrorMessage";
import { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";

interface GenerateQRResponse {
  qrData: string;
  md5: string;
}

type PaymentStatus = "idle" | "pending" | "paid" | "expired";

const getSavedDonation = () => {
  try {
    const saved = localStorage.getItem("donationState");
    if (!saved) return null;

    const parsed = JSON.parse(saved);
    const now = new Date().getTime();

    if (now < parsed.timerEndTime) {
      return {
        ...parsed,
        remaining: Math.round((parsed.timerEndTime - now) / 1000),
      };
    }
    localStorage.removeItem("donationState");
  } catch {
    localStorage.removeItem("donationState");
  }
  return null;
};

const DURATION = 180;

export function useDonation() {
  const queryClient = useQueryClient();
  const saved = getSavedDonation();
  // Initialize states directly
  const [amount, setAmount] = useState(saved?.amount?.toString() || "");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    saved?.paymentStatus || "idle"
  );
  const [qrData, setQrData] = useState(saved?.qrData || "");
  const [timeLeft, setTimeLeft] = useState(saved?.remaining || 0);

  const [md5, setMd5] = useState(saved?.md5);

  const { mutate, isPending } = useMutation({
    mutationFn: (amount: number) =>
      postJSON("/user/generate-donation-khqr", {
        amount,
      }) as Promise<GenerateQRResponse>,
    onSuccess: (data) => {
      setQrData(data.qrData);
      setMd5(data.md5);
      setPaymentStatus("pending");
      const duration = DURATION;
      setTimeLeft(duration);

      const timerEndTime = new Date().getTime() + duration * 1000;

      localStorage.setItem(
        "donationState",
        JSON.stringify({
          paymentStatus: "pending",
          qrData: data.qrData,
          md5: data.md5,
          timerEndTime,
          amount,
        })
      );

      toast.success("QR Code generated. Waiting for payment...");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage = getAxiosErrorMessage(error);
      toast.error(errorMessage || "Failed to generate QR code");
    },
  });

  // Polling for payment status
  useEffect(() => {
    if (!md5 || paymentStatus !== "pending") {
      return;
    }

    const checkStatus = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}/payment/status/${md5}`
        );
        const data = await response.json();

        if (data.status === "PAID") {
          setPaymentStatus("paid");
          setQrData("");
          setMd5(null); 
          toast.success("Donation received! Thank you.");
          localStorage.removeItem("donationState");
          queryClient.invalidateQueries({ queryKey: ["profile"] });
        } else if (data.status === "EXPIRED") {
          setPaymentStatus("expired");
          setMd5(null); 
          toast.info("QR Code expired");
          localStorage.removeItem("donationState");
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    };

    // Poll every 6 seconds
    const pollInterval = setInterval(checkStatus, 6000);

    return () => {
      clearInterval(pollInterval);
    };
  }, [md5, paymentStatus, queryClient]);

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft > 0 && paymentStatus === "pending") {
      const timer = setInterval(() => {
        setTimeLeft((prev: number) => {
          if (prev <= 1) {
            clearInterval(timer);
            setPaymentStatus("expired");
            setQrData("");
            setMd5(null);
            localStorage.removeItem("donationState");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, paymentStatus]);

  const handleGenerate = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 0.1) {
      toast.error("Please enter a valid amount");
      return;
    }

    // Reset state before generating a new QR
    setPaymentStatus("idle");
    setMd5(null);
    localStorage.removeItem("donationState");

    mutate(numAmount);
  };

  const handleIdle = () => {
    setPaymentStatus("idle");
    setQrData("");
    setMd5(null);
    localStorage.removeItem("donationState");
  };

  return {
    amount,
    setAmount,
    paymentStatus,
    qrData,
    timeLeft,
    isPending,
    handleGenerate,
    handleIdle,
  };
}
