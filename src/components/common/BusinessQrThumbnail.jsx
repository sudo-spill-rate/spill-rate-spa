import React from "react";
import { QrCode } from "lucide-react";
import { useQrCode } from "../../hooks/useQrCode";

/**
 * BusinessQrThumbnail Component
 * Reusable scannable QR thumbnail for business cards & storefront directories.
 *
 * @param {Object} props
 * @param {string} props.url - Full target URL to encode
 * @param {string} [props.businessName="Storefront"] - Business name for accessible alt & title
 * @param {number} [props.size=144] - Target pixel width of the QR code
 * @param {string} [props.className=""] - Additional container wrapper styling
 */
export default function BusinessQrThumbnail({
  url,
  businessName = "Storefront",
  size = 144,
  className = "",
}) {
  const { qrDataUrl, isLoading } = useQrCode(url, { width: size });

  return (
    <div
      className={`shrink-0 flex flex-col items-center justify-center ${className}`}
      title={`Scan QR to open ${businessName}`}
    >
      <div className="w-16 h-16 rounded-lg border border-slate-200/90 bg-slate-50/50 p-1 shadow-2xs flex items-center justify-center">
        {qrDataUrl ? (
          <img
            src={qrDataUrl}
            alt={`${businessName} storefront QR code`}
            className="w-full h-full object-contain"
            loading="lazy"
          />
        ) : (
          <QrCode className="w-7 h-7 text-slate-600" aria-hidden="true" />
        )}
      </div>
    </div>
  );
}
