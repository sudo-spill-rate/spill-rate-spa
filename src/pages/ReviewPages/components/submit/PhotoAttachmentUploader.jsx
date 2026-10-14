import React, { useRef, useState } from "react";
import { ImagePlus, X, AlertCircle } from "lucide-react";

export default function PhotoAttachmentUploader({
  images = [],
  onChange,
  maxFiles = 3,
  maxSizeMb = 5,
  disabled = false,
}) {
  const fileInputRef = useRef(null);
  const [uploadError, setUploadError] = useState("");

  const handleFileChange = (e) => {
    setUploadError("");
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (images.length + files.length > maxFiles) {
      setUploadError(`You can attach a maximum of ${maxFiles} photos.`);
      return;
    }

    const validFiles = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setUploadError("Only image files (JPEG, PNG, WebP) are allowed.");
        return;
      }
      if (file.size > maxSizeMb * 1024 * 1024) {
        setUploadError(`Image "${file.name}" exceeds the ${maxSizeMb}MB size limit.`);
        return;
      }
      validFiles.push(file);
    }

    onChange([...images, ...validFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
    setUploadError("");
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          Attach Photos (Optional)
        </label>
        <span className="text-xs text-slate-400">
          {images.length} / {maxFiles} max
        </span>
      </div>

      {/* Thumbnails list and upload button */}
      <div className="flex flex-wrap items-center gap-3">
        {images.map((file, idx) => {
          const previewUrl = URL.createObjectURL(file);
          return (
            <div
              key={idx}
              className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-300 bg-slate-100 group"
            >
              <img
                src={previewUrl}
                alt={`Selected attachment ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                aria-label={`Remove photo ${idx + 1}`}
                className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}

        {images.length < maxFiles && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => fileInputRef.current?.click()}
            className="w-20 h-20 rounded-lg border-2 border-dashed border-slate-300 hover:border-teal-600 active:bg-slate-50 flex flex-col items-center justify-center text-slate-500 hover:text-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ImagePlus className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-semibold">Add Photo</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        id="photo-file-input"
        name="photos"
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="sr-only"
        aria-label="Upload review photos"
      />

      {uploadError && (
        <p className="text-xs text-red-600 flex items-center gap-1 mt-1" role="alert">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{uploadError}</span>
        </p>
      )}

      <p className="text-[11px] text-slate-500">
        Photos of your receipt, product, or visit help verify authenticity. Up to 3 photos, 5MB each.
      </p>
    </div>
  );
}