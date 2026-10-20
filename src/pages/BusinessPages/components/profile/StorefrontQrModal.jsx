import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download, QrCode, Check } from "lucide-react";
import BaseModal from "../../../../components/common/BaseModal";

/**
 * QR Code Modal with embedded central logo (business logo or SpillRate fallback).
 * High-error correction (Level H) ensures reliable scannability even with center logo.
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

    const renderQrWithLogo = async () => {
      try {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Generate base QR code with High error correction (30% redundancy)
        await QRCode.toCanvas(canvas, publicUrl, {
          width: 320,
          margin: 2,
          errorCorrectionLevel: "H",
          color: {
            dark: "#0f172a", // Deep Slate brand
            light: "#ffffff",
          },
        });

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Determine image source: business logo or SpillRate fallback
        const targetLogoSrc = logoUrl || "/logo.png";

        // Load image to draw in the center
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          if (!isMounted) return;

          const size = canvas.width;
          const logoSize = Math.round(size * 0.22); // 22% of QR code width
          const center = size / 2;
          const x = center - logoSize / 2;
          const y = center - logoSize / 2;
          const radius = 10;

          // Draw white badge background behind logo with subtle padding
          const badgePadding = 5;
          const badgeSize = logoSize + badgePadding * 2;
          const badgeX = center - badgeSize / 2;
          const badgeY = center - badgeSize / 2;

          ctx.save();
          // Circular / rounded rectangle background
          ctx.beginPath();
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = "rgba(15, 23, 42, 0.15)";
          ctx.shadowBlur = 8;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 2;

          // Rounded rectangle path for badge
          ctx.roundRect(badgeX, badgeY, badgeSize, badgeSize, radius);
          ctx.fill();

          // Border for the badge
          ctx.shadowColor = "transparent";
          ctx.strokeStyle = "#e2e8f0";
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Clip and draw image inside rounded rectangle
          ctx.beginPath();
          ctx.roundRect(x, y, logoSize, logoSize, radius - 2);
          ctx.clip();
          ctx.drawImage(img, x, y, logoSize, logoSize);
          ctx.restore();

          setIsGenerating(false);
        };

        img.onerror = () => {
          if (!isMounted) return;
          // Fallback to SpillRate default logo if business logo failed to load
          if (targetLogoSrc !== "/logo.png") {
            const fallbackImg = new Image();
            fallbackImg.crossOrigin = "anonymous";
            fallbackImg.onload = () => {
              if (!isMounted) return;
              const size = canvas.width;
              const logoSize = Math.round(size * 0.22);
              const center = size / 2;
              const x = center - logoSize / 2;
              const y = center - logoSize / 2;
              const radius = 10;

              const badgePadding = 5;
              const badgeSize = logoSize + badgePadding * 2;
              const badgeX = center - badgeSize / 2;
              const badgeY = center - badgeSize / 2;

              ctx.save();
              ctx.beginPath();
              ctx.fillStyle = "#ffffff";
              ctx.shadowColor = "rgba(15, 23, 42, 0.15)";
              ctx.shadowBlur = 8;
              ctx.shadowOffsetX = 0;
              ctx.shadowOffsetY = 2;
              ctx.roundRect(badgeX, badgeY, badgeSize, badgeSize, radius);
              ctx.fill();

              ctx.shadowColor = "transparent";
              ctx.strokeStyle = "#e2e8f0";
              ctx.lineWidth = 1.5;
              ctx.stroke();

              ctx.beginPath();
              ctx.roundRect(x, y, logoSize, logoSize, radius - 2);
              ctx.clip();
              ctx.drawImage(fallbackImg, x, y, logoSize, logoSize);
              ctx.restore();

              setIsGenerating(false);
            };
            fallbackImg.src = "/logo.png";
          } else {
            setIsGenerating(false);
          }
        };

        img.src = targetLogoSrc;
      } catch (err) {
        console.error("Failed to render QR Code:", err);
        setIsGenerating(false);
      }
    };

    renderQrWithLogo();

    return () => {
      isMounted = false;
    };
  }, [isOpen, publicUrl, logoUrl]);

  // Handle Download QR as high-quality PNG
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      // Create a downloadable presentation canvas with branding
      const printCanvas = document.createElement("canvas");
      const pCtx = printCanvas.getContext("2d");
      const qrSize = canvas.width;
      const padding = 36;
      const headerHeight = 70;
      const footerHeight = 44;

      printCanvas.width = qrSize + padding * 2;
      printCanvas.height = qrSize + padding * 2 + headerHeight + footerHeight;

      if (pCtx) {
        // Crisp white card surface
        pCtx.fillStyle = "#ffffff";
        pCtx.fillRect(0, 0, printCanvas.width, printCanvas.height);

        // Header Title: Business Name
        pCtx.fillStyle = "#0f172a";
        pCtx.font = "bold 20px Inter, system-ui, sans-serif";
        pCtx.textAlign = "center";
        const displayName = businessName || "SpillRate Storefront";
        pCtx.fillText(displayName, printCanvas.width / 2, padding + 24);

        // Header Subtitle
        pCtx.fillStyle = "#64748b";
        pCtx.font = "normal 12px Inter, system-ui, sans-serif";
        pCtx.fillText("Scan to view reviews and rate", printCanvas.width / 2, padding + 46);

        // Draw the QR Code
        pCtx.drawImage(canvas, padding, padding + headerHeight);

        // Subtle divider
        pCtx.strokeStyle = "#f1f5f9";
        pCtx.lineWidth = 1;
        pCtx.beginPath();
        pCtx.moveTo(padding, printCanvas.height - footerHeight);
        pCtx.lineTo(printCanvas.width - padding, printCanvas.height - footerHeight);
        pCtx.stroke();

        // Footer: SpillRate Verification branding
        pCtx.fillStyle = "#0f766e"; // teal-700
        pCtx.font = "bold 11px Inter, system-ui, sans-serif";
        pCtx.fillText("Verified on SpillRate", printCanvas.width / 2, printCanvas.height - 18);

        const dataUrl = printCanvas.toDataURL("image/png");
        const link = document.createElement("a");
        const safeName = (businessName || "storefront").toLowerCase().replace(/[^a-z0-9]+/g, "-");
        link.download = `${safeName}-spillrate-qr.png`;
        link.href = dataUrl;
        link.click();

        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 2500);
      }
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
