"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Upload, X, Loader2 } from "lucide-react";
import {
  uploadSingleFile,
  uploadMultipleFiles,
  deleteFile,
} from "@/src/lib/api/upload";
import type { ImageData } from "@/src/lib/api/banners";
import { useToast } from "@/src/hooks/use-toast";
import Image from "next/image";

interface FileUploadProps {
  multiple?: boolean;
  value: ImageData | ImageData[];
  onChange: (value: ImageData | ImageData[]) => void;
  className?: string;
}

export function FileUpload({
  multiple = false,
  value,
  onChange,
  className,
}: FileUploadProps) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [previewImages, setPreviewImages] = useState<ImageData[]>([]);

  // Update preview images when value changes
  useEffect(() => {
    if (multiple && Array.isArray(value)) {
      setPreviewImages(value.filter((img) => img && img.url));
    } else if (!multiple && value && (value as ImageData).url) {
      setPreviewImages([value as ImageData]);
    } else {
      setPreviewImages([]);
    }
  }, [value, multiple]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setLoading(true);
    try {
      if (multiple) {
        const files = Array.from(e.target.files);
        const uploadedFiles = await uploadMultipleFiles(files);

        if (!uploadedFiles || uploadedFiles.length === 0) {
          throw new Error("No files were uploaded");
        }

        console.log("Uploaded multiple files:", uploadedFiles);
        onChange(uploadedFiles);
      } else {
        const file = e.target.files[0];
        const uploadedFile = await uploadSingleFile(file);

        if (!uploadedFile || !uploadedFile.url) {
          throw new Error("File was not uploaded properly");
        }

        console.log("Uploaded single file:", uploadedFile);
        onChange(uploadedFile);
      }

      toast({
        title: "Success",
        description: "File(s) uploaded successfully",
      });
    } catch (error: any) {
      console.error("File upload error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to upload file(s)",
      });
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveFile = async (file: ImageData) => {
    try {
      await deleteFile(file.id);

      if (multiple && Array.isArray(value)) {
        onChange(value.filter((item) => item.id !== file.id));
      } else {
        onChange({} as ImageData);
      }

      toast({
        title: "Success",
        description: "File removed successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to remove file",
      });
    }
  };
  const renderPreview = () => {
    if (!previewImages || previewImages.length === 0) {
      return null;
    }

    return (
      <div
        className={
          multiple
            ? "grid grid-cols-2 md:grid-cols-3 gap-4 mt-4"
            : "relative group mt-4"
        }
      >
        {previewImages.map((file, index) => (
          <div key={index} className={multiple ? "relative group" : ""}>
            <Image
              src={file.url || "/placeholder.svg"}
              alt={`Preview ${index}`}
              className={
                multiple
                  ? "w-full h-32 object-cover rounded-md"
                  : "w-full h-48 object-cover rounded-md"
              }
              width={100}
              height={100}
            />
            <button
              type="button"
              onClick={() => handleRemoveFile(file)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={className}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple={multiple}
        className="hidden"
        accept="image/*"
      />

      <Card className="p-4 border-dashed border-2 cursor-pointer hover:bg-gray-50 transition-colors">
        <div
          className="flex flex-col items-center justify-center gap-2"
          onClick={() => fileInputRef.current?.click()}
        >
          {loading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : (
            <Upload className="h-8 w-8 text-primary" />
          )}
          <p className="text-sm text-muted-foreground">
            {multiple ? "Click to upload images" : "Click to upload an image"}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            {loading ? "Uploading..." : "Select File"}
          </Button>
        </div>
      </Card>

      {renderPreview()}
    </div>
  );
}
