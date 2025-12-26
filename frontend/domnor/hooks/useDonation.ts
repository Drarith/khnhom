import { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { postJSON } from "@/https/https";
import { toast } from "react-toastify";
import getAxiosErrorMessage from "@/helpers/getAxiosErrorMessage";
import { AxiosError } from "axios";

interface GenerateQRResponse {
  qrData: string;
  md5: string;
  subscribeUrl: string;
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
  } catch (e) {
    localStorage.removeItem("donationState");
  }
  return null;
};

const DURATION = 180

export function useDonation() {
  const saved = getSavedDonation();
  // Initialize states directly
  const [amount, setAmount] = useState(saved?.amount?.toString() || "");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    saved?.paymentStatus || "idle"
  );
  const [qrData, setQrData] = useState(saved?.qrData || "");
  const [timeLeft, setTimeLeft] = useState(saved?.remaining || 0);

  const [subscribeUrl, setSubscribeUrl] = useState<string | null>(null);


  const eventSourceRef = useRef<EventSource | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: (amount: number) =>
      postJSON("/user/generate-donation-khqr", {
        amount,
      }) as Promise<GenerateQRResponse>,
    onSuccess: (data) => {
      setQrData(data.qrData);
      setSubscribeUrl(data.subscribeUrl);
      setPaymentStatus("pending");
      const duration = DURATION 
      setTimeLeft(duration);

      const timerEndTime = new Date().getTime() + duration * 1000;

      localStorage.setItem(
        "donationState",
        JSON.stringify({
          paymentStatus: "pending",
          qrData: data.qrData,
          subscribeUrl: data.subscribeUrl,
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


  // SSE for listening to payment status
  useEffect(() => {
    if (!subscribeUrl || paymentStatus !== "pending") {
      if (eventSourceRef.current) {
        console.log("🔌 Disconnecting radio due to status change");
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      return;
    }

    const fullUrl = `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
    }${subscribeUrl}`;

    console.log("🔌 Tuning radio to:", fullUrl);
    const eventSource = new EventSource(fullUrl);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📨 Signal received:", data);

      if (data.status === "PAID") {
        setPaymentStatus("paid");
        setQrData(null);
        toast.success("Donation received! Thank you.");
        localStorage.removeItem("donationState");
        eventSource.close();
      } else if (data.status === "EXPIRED") {
        setPaymentStatus("expired");
        toast.info("QR Code expired");
        localStorage.removeItem("donationState");
        eventSource.close();
      }
    };

    eventSource.onerror = (err) => {
      console.error("Radio interference (SSE Error):", err);
      // Optional: Don't close on all errors, some might be temporary
    };

    return () => {
      if (eventSource && eventSource.readyState !== EventSource.CLOSED) {
        console.log("🔌 Disconnecting radio on cleanup");
        eventSource.close();
      }
    };
  }, [subscribeUrl, paymentStatus]);

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft > 0 && paymentStatus === "pending") {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setPaymentStatus("expired");
            setQrData(null);
            setSubscribeUrl(null);
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
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    // Reset state before generating a new QR
    setPaymentStatus("idle");
    setSubscribeUrl(null);
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    localStorage.removeItem("donationState");

    mutate(numAmount);
  };

  const handleIdle = () => {
    setPaymentStatus("idle");
    setQrData(null);
    setSubscribeUrl(null);
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
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
