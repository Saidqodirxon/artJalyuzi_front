import api from "./axios";

export interface ImageData {
  url: string;
  id: string;
}

export interface BannerData {
  _id?: string;
  name_uz: string;
  name_ru: string;
  description_uz: string;
  description_ru: string;
  link: string;
  image: ImageData;
}

export const getBanners = async (): Promise<BannerData[]> => {
  try {
    const response = await api.get("/banners");
    console.log("Get banners response:", response.data);
    // Ensure we always return an array
    return Array.isArray(response.data) ? response.data : [];
  } catch (error: any) {
    console.error("Get banners error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch banners");
  }
};

export const getBanner = async (id: string): Promise<BannerData> => {
  try {
    const response = await api.get(`/banners/${id}`);
    console.log("Get banner response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Get banner error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch banner");
  }
};

export const createBanner = async (data: BannerData): Promise<BannerData> => {
  try {
    console.log("Creating banner with data:", data);
    const response = await api.post("/banners", data);
    console.log("Create banner response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Create banner error:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to create banner");
  }
};

export const updateBanner = async (
  id: string,
  data: BannerData
): Promise<BannerData> => {
  try {
    console.log("Updating banner with data:", data);
    const response = await api.patch(`/banners/${id}`, data);
    console.log("Update banner response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Update banner error:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to update banner");
  }
};

export const deleteBanner = async (id: string): Promise<void> => {
  try {
    await api.delete(`/banners/${id}`);
  } catch (error: any) {
    console.error(
      "Delete banner error:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to delete banner");
  }
};
