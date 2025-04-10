import api from "./axios";
import type { ImageData } from "./banners";

export const uploadSingleFile = async (file: File): Promise<ImageData> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await api.post("/single", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const image = res.data;

    // if (!image || !image.url || !image.id) {
    //   throw new Error("Invalid response format");
    // }

    return {
      url: image.url,
      id: image.id,
    };
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error("Failed to upload file");
  }
};

// uploadMultipleFiles
export const uploadMultipleFiles = async (
  files: File[]
): Promise<ImageData[]> => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await api.post("/multiple", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Multiple upload response:", response.data);

    const data = Array.isArray(response.data) ? response.data : [response.data];

    if (!data.every((item) => item.url && item.id)) {
      throw new Error("Invalid response format");
    }

    return data;
  } catch (error: any) {
    console.error(
      "Multiple upload error:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to upload files");
  }
};
export const deleteFile = async (fileId: string): Promise<void> => {
  try {
    await api.delete(`/file/${fileId}`);
  } catch (error: any) {
    console.error("Delete file error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to delete file");
  }
};
