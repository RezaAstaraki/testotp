import { useEffect, useState } from "react";

export default function useSmsAutoFill() {
    const [otp, setOtp] = useState("");
  useEffect(() => {
    if ("OTPCredential" in window) {
      const abortController = new AbortController();
      const handleOTP = async () => {
        try {
          if (navigator.credentials) {
            const content = (await navigator.credentials.get({
              otp: { transport: ["sms"] },
              signal: abortController.signal,
            } as any)) as { code?: string } | null;

            if (content && "code" in content && content.code) {
              setOtp(content.code);
            }
          }
        } catch (error: any) {
          if (error.name !== "AbortError") {
            console.error("Error getting OTP:", error);
          }
        }
      };
      handleOTP();
      return () => {abortController.abort()};
    }
  }, []);
  return { otp , setOtp};
}
