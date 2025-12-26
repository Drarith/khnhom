import { useState, useEffect, useRef, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { postJSON } from "@/https/https";
import { toast } from "react-toastify";

const STORAGE_KEYS = {
  STATUS: "don_status",
  QR: "don_qr",
  URL: "don_url",
  END: "don_end",
};

export const useDonation = () => {
  // Initialize state from Storage
  const [status, setStatus] = useState(() => localStorage.getItem(STORAGE_KEYS.STATUS) || "idle");
  const [qrData, setQrData] = useState(() => localStorage.getItem(STORAGE_KEYS.QR));
  const [url, setUrl] = useState(() => localStorage.getItem(STORAGE_KEYS.URL));
  const [timeLeft, setTimeLeft] = useState(0);

  const eventSourceRef = useRef<EventSource | null>(null);

  const reset = useCallback((newStatus = "idle") => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    if (eventSourceRef.current) eventSourceRef.current.close();
    setQrData(null);
    setUrl(null);
    setStatus(newStatus);
    setTimeLeft(0);
  }, []);

  const { mutate, isPending } = useMutation({
    mutationFn: (amount: number) => postJSON("/user/generate-donation-khqr", { amount }),
    onSuccess: (data: any) => {
      const end = Date.now() + 30000;
      localStorage.setItem(STORAGE_KEYS.QR, data.qrData);
      localStorage.setItem(STORAGE_KEYS.URL, data.subscribeUrl);
      localStorage.setItem(STORAGE_KEYS.STATUS, "pending");
      localStorage.setItem(STORAGE_KEYS.END, end.toString());

      setQrData(data.qrData);
      setUrl(data.subscribeUrl);
      setStatus("pending");
      toast.success("QR Generated");
    },
  });

  // Timer Effect
  useEffect(() => {
    if (status !== "pending") return;
    const end = parseInt(localStorage.getItem(STORAGE_KEYS.END) || "0");
    
    const tick = () => {
      const diff = Math.max(0, Math.floor((end - Date.now()) / 1000));
      setTimeLeft(diff);
      if (diff <= 0) {
        reset("expired");
        toast.error("Time expired!");
      }
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [status, reset]);

  // SSE Effect
  useEffect(() => {
    if (status !== "pending" || !url) return;
    const es = new EventSource(`${process.env.NEXT_PUBLIC_API_URL}${url}`);
    eventSourceRef.current = es;

    es.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.status === "PAID") reset("paid");
    };

    return () => es.close();
  }, [status, url, reset]);

  return { status, qrData, timeLeft, isPending, mutate, reset };
};