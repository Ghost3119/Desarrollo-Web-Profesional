import { useEffect, useState } from "react";
import type { CaptchaDto } from "../../../../../packages/shared/src/contracts";
import { api } from "../api/client";

export function useCaptcha() {
  const [captcha, setCaptcha] = useState<CaptchaDto>();
  const [captchaAnswer, setCaptchaAnswer] = useState("");

  const refreshCaptcha = async () => {
    const response = await api.captcha();
    if (response.ok && response.data) {
      setCaptcha(response.data);
      setCaptchaAnswer("");
    }
  };

  useEffect(() => {
    void refreshCaptcha();
  }, []);

  return { captcha, captchaAnswer, setCaptchaAnswer, refreshCaptcha };
}
