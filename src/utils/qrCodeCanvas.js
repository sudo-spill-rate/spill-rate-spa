import QRCode from "qrcode";

/**
 * Renders a high-error-correction QR code to a canvas element with an optional centered logo badge.
 * Handles fallback to "/logo.png" if the target logo fails to load.
 *
 * @param {HTMLCanvasElement} canvas - Target canvas element
 * @param {Object} options
 * @param {string} options.url - Full URL encoded into the QR code
 * @param {string} [options.logoUrl] - URL of business logo or fallback
 * @param {number} [options.width=320] - Target canvas dimension
 * @param {Function} [options.isMounted] - Callback returning boolean whether caller is still mounted
 * @param {Function} [options.onComplete] - Callback on generation finish
 */
export async function renderQrWithBadge(canvas, {
  url,
  logoUrl,
  width = 320,
  isMounted = () => true,
  onComplete = () => {},
}) {
  if (!canvas || !url) return;

  try {
    // Generate base QR code with High error correction (30% redundancy)
    await QRCode.toCanvas(canvas, url, {
      width,
      margin: 2,
      errorCorrectionLevel: "H",
      color: {
        dark: "#0f172a", // Deep Slate brand
        light: "#ffffff",
      },
    });

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const targetLogoSrc = logoUrl || "/logo.png";

    const drawLogoOnCanvas = (img) => {
      if (!isMounted()) return;

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

      onComplete();
    };

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => drawLogoOnCanvas(img);

    img.onerror = () => {
      if (!isMounted()) return;
      if (targetLogoSrc !== "/logo.png") {
        const fallbackImg = new Image();
        fallbackImg.crossOrigin = "anonymous";
        fallbackImg.onload = () => drawLogoOnCanvas(fallbackImg);
        fallbackImg.onerror = () => onComplete();
        fallbackImg.src = "/logo.png";
      } else {
        onComplete();
      }
    };

    img.src = targetLogoSrc;
  } catch (err) {
    console.error("Failed to render QR Code on canvas:", err);
    onComplete();
  }
}

/**
 * Builds a printable card canvas from a source QR canvas and triggers a PNG download.
 *
 * @param {HTMLCanvasElement} sourceCanvas - Rendered QR canvas element
 * @param {Object} options
 * @param {string} [options.businessName="SpillRate Storefront"] - Title on card
 */
export function downloadStorefrontQrCard(sourceCanvas, { businessName }) {
  if (!sourceCanvas) return;

  const printCanvas = document.createElement("canvas");
  const pCtx = printCanvas.getContext("2d");
  if (!pCtx) return;

  const qrSize = sourceCanvas.width;
  const padding = 36;
  const headerHeight = 70;
  const footerHeight = 44;

  printCanvas.width = qrSize + padding * 2;
  printCanvas.height = qrSize + padding * 2 + headerHeight + footerHeight;

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
  pCtx.drawImage(sourceCanvas, padding, padding + headerHeight);

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
}
