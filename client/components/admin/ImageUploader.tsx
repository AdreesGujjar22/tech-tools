"use client";

import React, { useEffect, useRef, useState } from "react";
import { Upload, X, CheckCircle, Loader2, AlertCircle, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
}

export default function ImageUploader({ value, onChange, label = "Featured Image", placeholder }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [isDragActive, setIsDragActive] = useState(false);
  const uploadTokenRef = useRef(0);

  useEffect(() => {
    if (!uploading) {
      setPreview(value || null);
    }
  }, [value, uploading]);

  const handleFile = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (JPG, PNG, WebP, etc.)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    const uploadToken = ++uploadTokenRef.current;
    setUploading(true);
    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error("Cloudinary upload is not configured");
      }

      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("upload_preset", uploadPreset);
      uploadData.append("folder", "techtools/blog");

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: uploadData,
      });
      const result = await response.json();

      if (!response.ok || !result.secure_url) {
        throw new Error(result.error?.message || "Cloudinary upload failed");
      }

      if (uploadToken !== uploadTokenRef.current) return;
      onChange(result.secure_url);
      toast.success("Image uploaded successfully!");
    } catch (error: any) {
      if (uploadToken !== uploadTokenRef.current) return;
      console.error("Cloudinary upload error:", error);
      toast.error(error.message || "Failed to upload image");
      setPreview(null);
      onChange("");
    } finally {
      if (uploadToken === uploadTokenRef.current) {
        setUploading(false);
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    uploadTokenRef.current += 1;
    onChange("");
    setUploading(false);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold text-foreground uppercase font-mono tracking-wider block">
        {label}
      </label>

      {preview ? (
        <div className="space-y-3">
          {/* Image Preview */}
          <div className="relative w-full h-40 rounded-xl overflow-hidden border border-border bg-muted/30">
            <img
              src={preview}
              alt="Preview"
              crossOrigin="anonymous"
              className="w-full h-full object-cover"
            />
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            )}
          </div>

          {/* Image Info */}
          {value && (
            <div className="flex items-start gap-2 p-2 bg-emerald-50 border border-emerald-200 rounded-xl">
              <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div className="text-xs text-emerald-700 break-all">
                Image uploaded successfully
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex-1 px-3 py-2.5 brand-gradient hover:opacity-90 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition cursor-pointer flex items-center justify-center gap-1"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-3 h-3" />
                  Change Image
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-semibold rounded-xl transition cursor-pointer flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
            isDragActive
              ? "border-primary bg-primary/10"
              : "border-border bg-muted/20 hover:border-primary/50 hover:bg-primary/5"
          }`}
        >
          <div className="flex justify-center mb-3">
            {uploading ? (
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            ) : (
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
          <p className="text-sm font-semibold text-foreground mb-1">
            {uploading ? "Uploading..." : "Drop image here or click to browse"}
          </p>
          <p className="text-xs text-muted-foreground">
            JPG, PNG, WebP (max 5MB)
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Error State Info */}
      {!value && !preview && (
        <div className="flex items-start gap-2 p-2 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700">
            Images are uploaded to cloud storage and will be available for all your blog posts.
          </p>
        </div>
      )}
    </div>
  );
}
