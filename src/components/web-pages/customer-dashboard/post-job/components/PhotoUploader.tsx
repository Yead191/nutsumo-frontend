"use client";

import { useRef } from "react";
import Image from "next/image";
import { ImagePlus, X, UploadCloud } from "lucide-react";
import { toast } from "sonner";

interface PhotoUploaderProps {
  files: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
}

export function PhotoUploader({
  files,
  onChange,
  maxFiles = 10,
}: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    const validImages = selected.filter((file) =>
      file.type.startsWith("image/"),
    );

    if (files.length + validImages.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} photos allowed`);
      return;
    }

    onChange([...files, ...validImages]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemove = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-title">Job Photos (Optional)</span>
        <span className="text-muted">
          {files.length} of {maxFiles} max
        </span>
      </div>

      {/* DROPZONE */}
      {files.length < maxFiles && (
        <div
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-line bg-smoke/60 p-6 text-center hover:border-[#FE375D] hover:bg-smoke transition-colors cursor-pointer"
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
          <div className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#FE375D] shadow-2xs mb-2">
            <UploadCloud className="h-5 w-5" />
          </div>
          <p className="font-display text-xs font-bold text-title">
            Click to upload photos of the issue
          </p>
          <p className="text-[11px] text-muted mt-0.5">
            PNG, JPG, or WEBP up to 10MB each
          </p>
        </div>
      )}

      {/* PREVIEWS GRID */}
      {files.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-2">
          {files.map((file, idx) => {
            const previewUrl = URL.createObjectURL(file);
            return (
              <div
                key={idx}
                className="group relative h-20 sm:h-24 rounded-2xl overflow-hidden border border-line shadow-2xs"
              >
                <Image
                  src={previewUrl}
                  alt={`Preview ${idx + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-black/70 text-white hover:bg-[#FE375D] transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
