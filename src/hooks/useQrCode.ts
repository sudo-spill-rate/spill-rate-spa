import { useState, useEffect } from "react";
import QRCode, { QRCodeToDataURLOptions } from "qrcode";

export interface UseQrCodeOptions extends QRCodeToDataURLOptions {
  width?: number;
  margin?: number;
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
  color?: {
    dark?: string;
    light?: string;
  };
}

export interface UseQrCodeResult {
  qrDataUrl: string;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

// Global in-memory cache to prevent redundant QR canvas conversions
const qrCache = new Map<string, string>();

/**
 * useQrCode
 * Lightweight, safe hook to generate base64 data URL QR codes with automatic caching and isMounted safety.
 *
 * @param url Target URL to encode into QR code
 * @param options Optional QRCode rendering configurations
 */
export function useQrCode(
  url?: string | null,
  options?: UseQrCodeOptions
): UseQrCodeResult {
  const targetWidth = options?.width ?? 144;
  const targetMargin = options?.margin ?? 1;
  const cacheKey = url ? `${url}_w${targetWidth}_m${targetMargin}` : "";

  const [qrDataUrl, setQrDataUrl] = useState<string>(() => {
    return cacheKey ? qrCache.get(cacheKey) || "" : "";
  });
  const [isLoading, setIsLoading] = useState<boolean>(!qrDataUrl && Boolean(url));
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!url) {
      setQrDataUrl("");
      setIsLoading(false);
      setError(null);
      return;
    }

    if (qrCache.has(cacheKey)) {
      setQrDataUrl(qrCache.get(cacheKey)!);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const mergedOptions: QRCodeToDataURLOptions = {
      width: targetWidth,
      margin: targetMargin,
      color: {
        dark: options?.color?.dark ?? "#0f172a",
        light: options?.color?.light ?? "#ffffff",
      },
      errorCorrectionLevel: options?.errorCorrectionLevel ?? "M",
      ...options,
    };

    QRCode.toDataURL(url, mergedOptions)
      .then((dataUrl) => {
        if (!isMounted) return;
        qrCache.set(cacheKey, dataUrl);
        setQrDataUrl(dataUrl);
        setIsLoading(false);
      })
      .catch((err: Error) => {
        if (!isMounted) return;
        setError(err);
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [
    url,
    cacheKey,
    targetWidth,
    targetMargin,
    options?.errorCorrectionLevel,
    options?.color?.dark,
    options?.color?.light,
  ]);

  return {
    qrDataUrl,
    isLoading,
    isError: Boolean(error),
    error,
  };
}

export default useQrCode;
