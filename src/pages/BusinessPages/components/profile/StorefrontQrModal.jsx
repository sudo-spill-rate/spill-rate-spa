import React, { useEffect, useRef, useState } from "react";
import { Download, QrCode, Check } from "lucide-react";
import BaseModal from "../../../../components/common/BaseModal";
import { renderQrWithBadge, downloadStorefrontQrCard } from "../../../../utils/qrCodeCanvas";

/**
 * QR Code Modal with embedded central logo badge and high-resolution card download.
 */
export default function StorefrontQrModal({
  isOpen,
  onClose,
  publicUrl,
  businessName,
  logoUrl,
}) {
  const canvasRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen || !publicUrl) return;

    let isMounted = true;
    setIsGenerating(true);

    renderQrWithBadge(canvasRef.current, {
      url: publicUrl,
      logoUrl,
      width: 320,
      isMounted: () => isMounted,
      onComplete: () => {
        if (isMounted) setIsGenerating(false);
      },
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, publicUrl, logoUrl]);

  const handleDownload = () => {
    try {
      downloadStorefrontQrCard(canvasRef.current, { businessName });
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (err) {
      console.error("Failed to download QR code:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Storefront QR Code"
      description="Scan with any smartphone camera"
      icon={
        <span className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
          <QrCode className="w-4 h-4" />
        </span>
      }
      titleId="qr-modal-title"
      maxWidth="max-w-sm"
    >
      {/* QR Code Canvas Card */}
      <div className="flex flex-col items-center justify-center p-4 bg-slate-50/70 rounded-xl border border-slate-200/80">
        <div className="relative p-2.5 bg-white rounded-xl shadow-xs border border-slate-200/80">
          <canvas
            ref={canvasRef}
            className="w-56 h-56 max-w-full rounded-lg"
            width={320}
            height={320}
          />
          {isGenerating && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-2xs rounded-xl flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-teal-700 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        <p className="mt-3 text-xs font-semibold text-slate-800 text-center truncate max-w-[240px]">
          {businessName}
        </p>
        <p className="text-[11px] text-slate-500 text-center truncate max-w-[240px]">
          {publicUrl.replace(/^https?:\/\//, "")}
        </p>
      </div>

      {/* Actions: Download Button & Dismiss */}
      <div className="flex flex-col gap-2 pt-1">
        <button
          type="button"
          onClick={handleDownload}
          disabled={isGenerating}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 active:bg-teal-900 rounded-xl transition-colors min-h-[42px] shadow-xs focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer disabled:opacity-50"
        >
          {downloadSuccess ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>QR Code Downloaded!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download QR Code (PNG)</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    </BaseModal>
  );
}
